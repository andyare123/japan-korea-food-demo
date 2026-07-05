<template>
  <Loading :active="isLoading"></Loading>

  <div class="admin-orders-page">
    <div class="container-fluid py-4">
      <!-- 頁面標題 -->
      <div class="admin-hero mb-4">
        <div>
          <span class="admin-badge">ORDER SEARCH</span>
          <h2 class="fw-bold mt-2 mb-2">訂單查詢</h2>
          <p class="text-muted mb-0">
            查看顧客訂單、付款狀態與選購料理內容，此頁僅提供查詢與檢視。
          </p>
        </div>

        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-outline-brand refresh-btn"
            :disabled="isLoading || isOrderDisplayCleared"
            @click="getOrders(currentPage)"
          >
            <i class="bi bi-arrow-clockwise me-1"></i>
            重新整理
          </button>

          <button
            type="button"
            class="btn btn-brand refresh-btn"
            :disabled="isLoading || isOrderDisplayCleared"
            @click="clearOrdersDisplay"
          >
            <i class="bi bi-x-circle me-1"></i>
            清空顯示
          </button>
        </div>
      </div>

      <!-- 統計卡片 -->
      <div class="row g-3 mb-4">
        <div class="col-md-4">
          <div class="stat-card">
            <span>本頁訂單數</span>
            <strong>{{ orderList.length }}</strong>
          </div>
        </div>

        <div class="col-md-4">
          <div class="stat-card paid">
            <span>已付款</span>
            <strong>{{ paidCount }}</strong>
          </div>
        </div>

        <div class="col-md-4">
          <div class="stat-card unpaid">
            <span>未付款</span>
            <strong>{{ unpaidCount }}</strong>
          </div>
        </div>
      </div>

      <!-- 訂單列表 -->
      <div class="orders-card">
        <div class="orders-card-header">
          <div>
            <h4 class="fw-bold mb-1">訂單列表</h4>
            <p class="text-muted mb-0 small">可點擊檢視查看完整訂單內容，此頁不提供刪除功能。</p>
          </div>
        </div>

        <div v-if="orderList.length" class="table-responsive">
          <table class="table align-middle admin-order-table mb-0">
            <thead>
              <tr>
                <th>購買時間</th>
                <th>Email</th>
                <th>購買款項</th>
                <th class="text-end">應付金額</th>
                <th class="text-center">付款狀態</th>
                <th class="text-end">操作</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in orderList"
                :key="item.id"
                :class="{ 'unpaid-row': !isOrderPaid(item) }"
              >
                <td class="order-time">
                  <div class="fw-bold">
                    {{ item.create_at ? $filters.date(item.create_at) : "未取得時間" }}
                  </div>
                  <small class="text-muted">
                    {{ item.id }}
                  </small>
                </td>

                <td>
                  <div v-if="item.user">
                    <div class="fw-bold">
                      {{ item.user.email || "未填寫 Email" }}
                    </div>
                    <small class="text-muted">
                      {{ item.user.name || "未填寫姓名" }}
                    </small>
                  </div>

                  <span v-else class="text-muted"> 無用戶資料 </span>
                </td>

                <td>
                  <div class="product-list">
                    <div
                      v-for="product in getOrderProducts(item.products)"
                      :key="product.id"
                      class="product-pill"
                    >
                      <span class="product-dot"></span>
                      <span class="product-title">
                        {{ product.product?.title || "未命名商品" }}
                      </span>
                      <span class="product-qty">
                        x {{ product.qty || 0 }} {{ product.product?.unit || "份" }}
                      </span>
                    </div>

                    <span v-if="!getOrderProducts(item.products).length" class="text-muted">
                      無商品資料
                    </span>
                  </div>
                </td>

                <td class="text-end">
                  <strong class="order-total">
                    {{ $filters.currency(item.total || 0) }}
                  </strong>
                </td>

                <td class="text-center">
                  <div class="payment-control">
                    <span class="payment-badge" :class="isOrderPaid(item) ? 'paid' : 'unpaid'">
                      {{ isOrderPaid(item) ? "已付款" : "未付款" }}
                    </span>
                  </div>
                </td>

                <td class="text-end">
                  <div class="btn-group action-group">
                    <button
                      type="button"
                      class="btn btn-outline-brand btn-sm"
                      @click="openModal(false, item)"
                    >
                      <i class="bi bi-eye me-1"></i>
                      檢視
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="orderList.length" class="mobile-order-list">
          <div
            v-for="item in orderList"
            :key="`mobile-${item.id}`"
            class="mobile-order-card"
            :class="{ unpaid: !isOrderPaid(item) }"
          >
            <div class="mobile-order-top">
              <div>
                <div class="mobile-order-id">
                  {{ item.id }}
                </div>
                <div class="mobile-order-time">
                  訂購時間　{{ item.create_at ? $filters.date(item.create_at) : "未取得時間" }}
                </div>
              </div>

              <button
                type="button"
                class="mobile-order-arrow"
                aria-label="檢視訂單"
                @click="openModal(false, item)"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <div class="mobile-order-row">
              <span>訂購帳戶</span>
              <strong>{{ item.user?.email || item.user?.name || "未填寫資料" }}</strong>
            </div>

            <div class="mobile-order-row">
              <span>總金額</span>
              <strong>{{ $filters.currency(item.total || 0) }}</strong>
            </div>

            <div class="mobile-order-row">
              <span>訂單狀態</span>
              <strong>{{ isOrderPaid(item) ? "已付款" : "未付款" }}</strong>
            </div>

            <div class="mobile-order-products">
              <div
                v-for="product in getOrderProducts(item.products)"
                :key="product.id"
                class="mobile-product-pill"
              >
                {{ product.product?.title || "未命名商品" }}
                x {{ product.qty || 0 }} {{ product.product?.unit || "份" }}
              </div>

              <span v-if="!getOrderProducts(item.products).length" class="text-muted">
                無商品資料
              </span>
            </div>
          </div>
        </div>
        <div v-else class="empty-orders">
          <div class="display-5 mb-3">🧾</div>
          <h5 class="fw-bold">目前沒有訂單資料</h5>
          <p class="text-muted mb-0">尚未有顧客建立訂單，或目前頁面沒有資料。</p>
        </div>
      </div>

      <div class="mt-4" v-if="!isOrderDisplayCleared && orderList.length">
        <Pagination :pages="pagination" @emit-pages="getOrders"></Pagination>
      </div>
    </div>
  </div>

  <OrderModal ref="orderModal" :order="tempOrder" @update-order="updatePaid"></OrderModal>
</template>

<script>
import OrderModal from '@/components/orderModal.vue';
import Pagination from '@/components/Pagination.vue';

import emitter from '../methods/emitter';

export default {
  name: 'AdminOrders',
  components: {
    Pagination,
    OrderModal,
  },
  data() {
    return {
      orders: {},
      isNew: false,
      pagination: {},
      isLoading: false,
      tempOrder: {},
      currentPage: 1,
      latestPaidOrderId: '',
      isOrderDisplayCleared: localStorage.getItem('orderDisplayCleared') === '1',
    };
  },
  computed: {
    orderList() {
      if (this.isOrderDisplayCleared) {
        return [];
      }

      if (Array.isArray(this.orders)) {
        return this.orders;
      }

      if (this.orders && typeof this.orders === 'object') {
        return Object.values(this.orders);
      }

      return [];
    },

    paidCount() {
      return this.orderList.filter((item) => this.isOrderPaid(item)).length;
    },

    unpaidCount() {
      return this.orderList.filter((item) => !this.isOrderPaid(item)).length;
    },
  },
  methods: {
    isOrderPaid(order) {
      return (
        order.is_paid === true
        || order.is_paid === 1
        || order.is_paid === '1'
        || order.is_paid === 'true'
      );
    },

    syncLatestPaidOrderId() {
      const routeOrderId = this.$route.query.orderId || '';
      const storageOrderId = localStorage.getItem('latestPaidOrderId') || '';
      const finalOrderId = routeOrderId || storageOrderId;

      this.latestPaidOrderId = finalOrderId;

      if (finalOrderId) {
        localStorage.removeItem('orderDisplayCleared');
        localStorage.setItem('latestPaidOrderId', finalOrderId);
        this.isOrderDisplayCleared = false;
      }

      return finalOrderId;
    },

    getOrderProducts(products) {
      if (Array.isArray(products)) {
        return products;
      }

      if (products && typeof products === 'object') {
        return Object.values(products);
      }

      return [];
    },

    getOrders() {
      if (this.isOrderDisplayCleared) {
        this.orders = {};
        this.pagination = {};
        return;
      }

      const orderId = this.syncLatestPaidOrderId();

      if (!orderId) {
        this.orders = {};
        this.pagination = {};
        return;
      }

      this.getOnlyPaidOrder(orderId);
    },

    getOnlyPaidOrder(orderId) {
      if (!orderId) {
        this.orders = {};
        this.pagination = {};
        return;
      }

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order/${orderId}`;

      this.isLoading = true;

      this.$http
        .get(url)
        .then((response) => {
          if (response.data.success && response.data.order) {
            const order = {
              id: orderId,
              ...response.data.order,
            };

            this.orders = {
              [orderId]: order,
            };

            this.pagination = {};
            this.currentPage = 1;
            return;
          }

          this.orders = {};
          this.pagination = {};
        })
        .catch(() => {
          alert('取得指定付款訂單失敗，請稍後再試');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    openModal(isNew, item) {
      this.tempOrder = { ...item };
      this.isNew = isNew;

      const orderComponent = this.$refs.orderModal;
      orderComponent.showModal();
    },

    updatePaid(item) {
      if (!item || !item.id) {
        alert('找不到訂單編號，無法更新付款狀態');
        return;
      }

      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`;

      const paid = {
        is_paid: item.is_paid,
      };

      this.$http
        .put(api, { data: paid })
        .then((response) => {
          this.$httpMessageState(response, '更新付款狀態');

          this.latestPaidOrderId = item.id;
          localStorage.removeItem('orderDisplayCleared');
          localStorage.setItem('latestPaidOrderId', item.id);

          this.getOnlyPaidOrder(item.id);
        })
        .catch(() => {
          alert('更新付款狀態失敗，請稍後再試');

          if (this.latestPaidOrderId) {
            this.getOnlyPaidOrder(this.latestPaidOrderId);
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    clearOrdersDisplay() {
      this.orders = {};
      this.pagination = {};
      this.latestPaidOrderId = '';
      this.isOrderDisplayCleared = true;

      localStorage.removeItem('latestPaidOrderId');
      localStorage.setItem('orderDisplayCleared', '1');

      emitter.emit('orders-cleared');
    },

    handleOrdersCleared() {
      this.orders = {};
      this.pagination = {};
      this.latestPaidOrderId = '';
      this.isOrderDisplayCleared = true;

      localStorage.setItem('orderDisplayCleared', '1');
    },

    handleOrdersDisplayReset(payload = {}) {
      const paidOrderId = payload.orderId
        || this.$route.query.orderId
        || localStorage.getItem('latestPaidOrderId')
        || '';

      this.isOrderDisplayCleared = false;
      this.latestPaidOrderId = paidOrderId;

      localStorage.removeItem('orderDisplayCleared');

      if (!paidOrderId) {
        this.orders = {};
        this.pagination = {};
        return;
      }

      localStorage.setItem('latestPaidOrderId', paidOrderId);
      this.getOnlyPaidOrder(paidOrderId);
    },
  },
  created() {
    if (this.isOrderDisplayCleared) {
      this.orders = {};
      this.pagination = {};
      return;
    }

    const orderId = this.syncLatestPaidOrderId();

    if (orderId) {
      this.getOnlyPaidOrder(orderId);
    } else {
      this.orders = {};
      this.pagination = {};
    }
  },
  mounted() {
    emitter.on('orders-cleared', this.handleOrdersCleared);
    emitter.on('orders-display-reset', this.handleOrdersDisplayReset);
  },

  beforeUnmount() {
    emitter.off('orders-cleared', this.handleOrdersCleared);
    emitter.off('orders-display-reset', this.handleOrdersDisplayReset);
  },
};
</script>

<style scoped>
.admin-orders-page {
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.08), transparent 28%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 46%, var(--brand-bg-soft) 100%);
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 32px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.admin-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.refresh-btn {
  border-radius: 999px;
  font-weight: 800;
  white-space: nowrap;
}

.stat-card {
  padding: 22px 24px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 12px 32px rgba(120, 54, 28, 0.08);
}

.stat-card span {
  display: block;
  color: var(--brand-muted);
  font-size: 14px;
  font-weight: 700;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  color: var(--brand-primary);
  font-size: 34px;
  line-height: 1;
}

.stat-card.paid strong {
  color: var(--state-success);
}

.stat-card.unpaid strong {
  color: var(--state-danger);
}

.orders-card {
  overflow: hidden;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.orders-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 30px;
  background: var(--brand-bg-soft);
  border-bottom: 1px solid var(--brand-border);
}

.admin-order-table thead th {
  padding: 16px 18px;
  color: #6c5b50;
  background: var(--brand-primary-light);
  border-bottom: 1px solid var(--brand-border);
  font-size: 14px;
  white-space: nowrap;
}

.admin-order-table tbody td {
  padding: 18px;
  border-bottom: 1px solid #f1e4dc;
  vertical-align: middle;
}

.admin-order-table tbody tr:last-child td {
  border-bottom: 0;
}

.unpaid-row {
  background: rgba(255, 248, 242, 0.65);
}

.order-time small {
  display: block;
  max-width: 180px;
  word-break: break-all;
}

.product-list {
  display: grid;
  gap: 8px;
}

.product-pill {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff8f2;
  border: 1px solid #f1e4dc;
  width: fit-content;
  max-width: 100%;
}

.product-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b23a2e;
  flex-shrink: 0;
}

.product-title {
  color: #33251f;
  font-weight: 800;
}

.product-qty {
  color: #b23a2e;
  font-size: 13px;
  font-weight: 900;
}

.order-total {
  color: #b23a2e;
  font-size: 18px;
}

.payment-control {
  min-width: 96px;
}

.payment-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 78px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
}

.payment-badge.paid {
  color: #198754;
  background: #e9f8ef;
}

.payment-badge.unpaid {
  color: #b23a2e;
  background: #fff0e7;
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

.action-group .btn {
  font-weight: 800;
}

.empty-orders {
  padding: 80px 24px;
  text-align: center;
  color: #8a7a70;
  background: #fffaf6;
}
.mobile-order-list {
  display: none;
}
@media (max-width: 991px) {
  .main-navbar {
    position: sticky;
    top: 0;
    z-index: 5000;
  }

  #mainNavbar {
    position: absolute;
    top: 100%;
    left: 12px;
    right: 12px;
    z-index: 4999;
    padding: 14px;
    border-radius: 20px;
    background: #ffffff;
    border: 1px solid var(--brand-border);
    box-shadow: 0 18px 45px rgba(80, 40, 20, 0.18);
  }

  #mainNavbar:not(.show) {
    display: none;
  }

  #mainNavbar.show {
    display: block;
  }

  .navbar-nav {
    align-items: stretch !important;
    padding-top: 0;
  }

  .navbar-nav .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 12px 14px;
    border-radius: 14px;
  }

  .navbar-nav .nav-link:hover,
  .navbar-nav .nav-link.router-link-active {
    background: var(--brand-primary-light);
  }

  .order-btn {
    width: 100%;
    margin-top: 8px;
  }

  .preview-panel,
  .cart-preview-panel,
  .order-preview-panel {
    position: static;
    width: 100%;
    max-height: none;
    margin-top: 8px;
    box-shadow: none;
  }
  .table-responsive {
    display: none;
  }

  .mobile-order-list {
    display: grid;
    gap: 14px;
    padding: 18px;
  }

  .mobile-order-card {
    padding: 18px;
    border-radius: 20px;
    background: #ffffff;
    border: 1px solid var(--brand-border);
    box-shadow: 0 10px 26px rgba(120, 54, 28, 0.08);
  }

  .mobile-order-card.unpaid {
    background: var(--brand-bg-soft);
  }

  .mobile-order-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  .mobile-order-id {
    color: var(--brand-primary);
    font-size: 18px;
    font-weight: 900;
    word-break: break-all;
  }

  .mobile-order-time {
    margin-top: 8px;
    color: var(--brand-muted);
    font-size: 14px;
  }

  .mobile-order-arrow {
    flex: 0 0 auto;
    width: 38px;
    height: 38px;
    border: 0;
    border-radius: 50%;
    color: var(--brand-primary);
    background: var(--brand-primary-light);
    font-size: 20px;
  }

  .mobile-order-row {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 12px;
    margin-top: 10px;
    font-size: 16px;
  }

  .mobile-order-row span {
    color: var(--brand-muted);
  }

  .mobile-order-row strong {
    color: var(--brand-text);
    word-break: break-word;
  }

  .mobile-order-products {
    display: grid;
    gap: 8px;
    margin-top: 14px;
  }

  .mobile-product-pill {
    width: fit-content;
    max-width: 100%;
    padding: 7px 11px;
    border-radius: 999px;
    color: var(--brand-primary);
    background: var(--brand-primary-light);
    border: 1px solid var(--brand-border);
    font-size: 13px;
    font-weight: 800;
  }

  .admin-order-table {
    min-width: 0;
  }
}
</style>
