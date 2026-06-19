<!-- eslint-disable vue/no-v-for-template-key -->
<!-- eslint-disable vue/no-multiple-template-root -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
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
            class="btn btn-outline-danger refresh-btn"
            :disabled="isLoading || isOrderDisplayCleared"
            @click="getOrders(currentPage)"
          >
            <i class="bi bi-arrow-clockwise me-1"></i>
            重新整理
          </button>

          <button
            type="button"
            class="btn btn-danger refresh-btn"
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
            <p class="text-muted mb-0 small">
              可點擊檢視查看完整訂單內容，此頁不提供刪除功能。
            </p>
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
                    {{ item.create_at ? $filters.date(item.create_at) : '未取得時間' }}
                  </div>
                  <small class="text-muted">
                    {{ item.id }}
                  </small>
                </td>

                <td>
                  <div v-if="item.user">
                    <div class="fw-bold">
                      {{ item.user.email || '未填寫 Email' }}
                    </div>
                    <small class="text-muted">
                      {{ item.user.name || '未填寫姓名' }}
                    </small>
                  </div>

                  <span v-else class="text-muted">
                    無用戶資料
                  </span>
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
                        {{ product.product?.title || '未命名商品' }}
                      </span>
                      <span class="product-qty">
                        x {{ product.qty || 0 }} {{ product.product?.unit || '份' }}
                      </span>
                    </div>

                    <span
                      v-if="!getOrderProducts(item.products).length"
                      class="text-muted"
                    >
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
                    <span
                      class="payment-badge"
                      :class="isOrderPaid(item) ? 'paid' : 'unpaid'"
                    >
                      {{ isOrderPaid(item) ? '已付款' : '未付款' }}
                    </span>
                  </div>
                </td>

                <td class="text-end">
                  <div class="btn-group action-group">
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm"
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

        <div v-else class="empty-orders">
          <div class="display-5 mb-3">🧾</div>
          <h5 class="fw-bold">目前沒有訂單資料</h5>
          <p class="text-muted mb-0">
            尚未有顧客建立訂單，或目前頁面沒有資料。
          </p>
        </div>
      </div>

      <div class="mt-4" v-if="!isOrderDisplayCleared && orderList.length">
        <Pagination
          :pages="pagination"
          @emit-pages="getOrders"
        ></Pagination>
      </div>
    </div>
  </div>

  <OrderModal
    ref="orderModal"
    :order="tempOrder"
    @update-order="updatePaid"
  ></OrderModal>
</template>

<script>
import OrderModal from '@/components/orderModal.vue';
import Pagination from '@/components/Pagination.vue';

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
      return order.is_paid === true
        || order.is_paid === 1
        || order.is_paid === '1'
        || order.is_paid === 'true';
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

      this.$http.get(url)
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

          console.warn('找不到指定訂單：', orderId);
        })
        .catch((error) => {
          console.error('取得指定付款訂單失敗:', error);
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

      this.$http.put(api, { data: paid })
        .then((response) => {
          this.$httpMessageState(response, '更新付款狀態');

          this.latestPaidOrderId = item.id;
          localStorage.removeItem('orderDisplayCleared');
          localStorage.setItem('latestPaidOrderId', item.id);

          this.getOnlyPaidOrder(item.id);
        })
        .catch((error) => {
          console.error('更新付款狀態失敗:', error);
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

      window.dispatchEvent(new Event('orders-cleared'));
    },

    handleOrdersCleared() {
      this.orders = {};
      this.pagination = {};
      this.latestPaidOrderId = '';
      this.isOrderDisplayCleared = true;

      localStorage.removeItem('latestPaidOrderId');
      localStorage.setItem('orderDisplayCleared', '1');
    },

    handleOrdersDisplayReset(event) {
      const paidOrderId = event?.detail?.orderId
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
    window.addEventListener('orders-cleared', this.handleOrdersCleared);
    window.addEventListener('orders-display-reset', this.handleOrdersDisplayReset);
  },

  beforeUnmount() {
    window.removeEventListener('orders-cleared', this.handleOrdersCleared);
    window.removeEventListener('orders-display-reset', this.handleOrdersDisplayReset);
  },
};
</script>

<style scoped>
.admin-orders-page {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.08), transparent 28%),
    linear-gradient(180deg, #fff7ef 0%, #ffffff 46%, #fffaf5 100%);
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 32px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.admin-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: #b23a2e;
  background: #fff0e7;
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
  border: 1px solid #f1d8ca;
  box-shadow: 0 12px 32px rgba(120, 54, 28, 0.08);
}

.stat-card span {
  display: block;
  color: #8a7a70;
  font-size: 14px;
  font-weight: 700;
}

.stat-card strong {
  display: block;
  margin-top: 8px;
  color: #b23a2e;
  font-size: 34px;
  line-height: 1;
}

.stat-card.paid strong {
  color: #198754;
}

.stat-card.unpaid strong {
  color: #dc3545;
}

.orders-card {
  overflow: hidden;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.orders-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 26px 30px;
  border-bottom: 1px solid #f1d8ca;
  background: #fffaf6;
}

.admin-order-table thead th {
  padding: 16px 18px;
  color: #6c5b50;
  background: #fff3ea;
  border-bottom: 1px solid #f1d8ca;
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

@media (max-width: 991px) {
  .admin-orders-page {
    padding: 12px;
  }

  .admin-hero {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
    border-radius: 22px;
  }

  .refresh-btn {
    width: 100%;
  }

  .orders-card-header {
    padding: 22px;
  }

  .admin-order-table {
    min-width: 980px;
  }
}
</style>