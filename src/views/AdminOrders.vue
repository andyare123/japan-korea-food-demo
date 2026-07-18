<template>
  <Loading :active="isLoading" />

  <div class="admin-orders-page">
    <div class="container py-5">
      <div class="admin-hero mb-4">
        <div>
          <span class="admin-badge">ORDER MANAGEMENT</span>
          <h1 class="fw-bold mt-3 mb-2">後台訂單檢視</h1>
          <p class="text-muted mb-0">
            查看顧客訂單、付款狀態、訂購資料與選購料理明細。
          </p>
        </div>

        <button
          type="button"
          class="btn btn-brand btn-lg refresh-btn"
          :disabled="isLoading"
          @click="getOrders(currentPage)"
        >
          <i class="bi bi-arrow-clockwise me-1"></i>
          重新整理
        </button>
      </div>

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

      <div class="orders-card">
        <div class="orders-card-header">
          <div>
            <h4 class="fw-bold mb-1">訂單列表</h4>
            <p class="text-muted mb-0 small">
              每頁顯示 10 筆，可點擊「檢視」查看完整訂單內容。
            </p>
          </div>
        </div>

        <div v-if="orderList.length" class="table-responsive">
          <table class="table align-middle admin-order-table mb-0">
            <thead>
              <tr>
                <th>購買時間</th>
                <th>訂購人</th>
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
                  <small class="text-muted">{{ item.id }}</small>
                </td>

                <td>
                  <strong>{{ item.user?.name || '未填寫姓名' }}</strong>
                </td>

                <td>
                  <span class="text-muted">
                    {{ item.user?.email || '未填寫 Email' }}
                  </span>
                </td>

                <td>
                  <div class="product-list">
                    <div
                      v-for="product in getOrderProducts(item.products).slice(0, 3)"
                      :key="product.id"
                      class="product-pill"
                    >
                      <span class="product-dot"></span>
                      <span class="product-title">
                        {{ product.product?.title || '未命名商品' }}
                      </span>
                      <span class="product-qty">
                        x {{ product.qty || 0 }}
                      </span>
                    </div>

                    <span
                      v-if="getOrderProducts(item.products).length > 3"
                      class="more-pill"
                    >
                      + {{ getOrderProducts(item.products).length - 3 }} 項
                    </span>

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
                  <span class="payment-badge" :class="isOrderPaid(item) ? 'paid' : 'unpaid'">
                    {{ isOrderPaid(item) ? '已付款' : '未付款' }}
                  </span>
                </td>

                <td class="text-end">
                  <button
                    type="button"
                    class="btn btn-outline-brand btn-sm view-btn"
                    @click="openModal(item)"
                  >
                    <i class="bi bi-eye me-1"></i>
                    檢視
                  </button>
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
          >
            <div class="mobile-order-top">
              <div>
                <span class="payment-badge" :class="isOrderPaid(item) ? 'paid' : 'unpaid'">
                  {{ isOrderPaid(item) ? '已付款' : '未付款' }}
                </span>

                <div class="mobile-order-id mt-2">
                  {{ item.id }}
                </div>

                <div class="mobile-order-time">
                  {{ item.create_at ? $filters.date(item.create_at) : '未取得時間' }}
                </div>
              </div>

              <button
                type="button"
                class="mobile-view-btn"
                aria-label="檢視訂單"
                @click="openModal(item)"
              >
                <i class="bi bi-chevron-right"></i>
              </button>
            </div>

            <div class="mobile-order-row">
              <span>訂購人</span>
              <strong>{{ item.user?.name || '未填寫姓名' }}</strong>
            </div>

            <div class="mobile-order-row">
              <span>Email</span>
              <strong>{{ item.user?.email || '未填寫 Email' }}</strong>
            </div>

            <div class="mobile-order-row">
              <span>總金額</span>
              <strong>{{ $filters.currency(item.total || 0) }}</strong>
            </div>

            <div class="mobile-order-products">
              <div
                v-for="product in getOrderProducts(item.products)"
                :key="product.id"
                class="mobile-product-pill"
              >
                {{ product.product?.title || '未命名商品' }}
                x {{ product.qty || 0 }} {{ product.product?.unit || '份' }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-orders">
          <div class="display-5 mb-3">🧾</div>
          <h5 class="fw-bold">目前沒有訂單資料</h5>
          <p class="text-muted mb-0">
            尚未有顧客建立訂單，或目前無法取得訂單資料。
          </p>
        </div>

        <div v-if="pagination.total_pages > 1" class="pagination-wrap">
          <Pagination :pages="pagination" @emit-pages="getOrders" />
        </div>
      </div>
    </div>
  </div>

  <OrderModal
    ref="orderModal"
    :order="tempOrder"
    @update-order="updatePaid"
  />
</template>

<script>
import OrderModal from '@/components/OrderModal.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'AdminOrders',
  components: {
    OrderModal,
    Pagination,
  },
  data() {
    return {
      orders: {},
      pagination: {
        total_pages: 1,
        current_page: 1,
        has_pre: false,
        has_next: false,
      },
      currentPage: 1,
      isLoading: false,
      tempOrder: {},
    };
  },
  computed: {
    orderList() {
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

    getOrderProducts(products) {
      if (Array.isArray(products)) {
        return products;
      }

      if (products && typeof products === 'object') {
        return Object.values(products);
      }

      return [];
    },

    getOrders(page = 1) {
      this.currentPage = page;
      this.isLoading = true;

      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;

      this.$http
        .get(api)
        .then((response) => {
          if (response.data.success) {
            this.orders = response.data.orders || {};
            this.pagination = response.data.pagination || {
              total_pages: 1,
              current_page: 1,
              has_pre: false,
              has_next: false,
            };
          } else {
            this.pushToast('取得訂單失敗', response.data.message || '請稍後再試。', 'danger');
          }
        })
        .catch(() => {
          this.pushToast('取得訂單失敗', '請確認是否已登入後台，或稍後再試。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    openModal(item) {
      this.tempOrder = {
        ...item,
        is_paid: this.isOrderPaid(item),
      };

      this.$refs.orderModal.showModal();
    },

    updatePaid(item) {
      if (!item || !item.id) {
        this.pushToast('更新付款狀態失敗', '找不到訂單編號。', 'warning');
        return;
      }

      const api = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`;

      const paid = {
        is_paid: item.is_paid ? 1 : 0,
      };

      this.isLoading = true;

      this.$http
        .put(api, { data: paid })
        .then((response) => {
          if (response.data.success) {
            this.pushToast('更新付款狀態成功', '訂單付款狀態已更新。', 'success');

            this.$refs.orderModal.hideModal();
            this.getOrders(this.currentPage);
          } else {
            this.pushToast('更新付款狀態失敗', response.data.message || '請稍後再試。', 'danger');
          }
        })
        .catch(() => {
          this.pushToast('更新付款狀態失敗', '請確認登入狀態或稍後再試。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.getOrders();
  },
};
</script>

<style scoped>
.admin-orders-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.12), transparent 32%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 44%, var(--brand-bg-soft) 100%);
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 34px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
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
  min-height: 50px;
  border-radius: 16px;
  font-weight: 900;
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
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.orders-card-header {
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

.unpaid-row {
  background: rgba(255, 248, 242, 0.72);
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

.product-pill,
.more-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  max-width: 100%;
  padding: 7px 11px;
  border-radius: 999px;
  background: #fff8f2;
  border: 1px solid #f1e4dc;
}

.product-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-primary);
  flex-shrink: 0;
}

.product-title {
  color: var(--brand-text);
  font-weight: 800;
}

.product-qty {
  color: var(--brand-primary);
  font-size: 13px;
  font-weight: 900;
}

.more-pill {
  color: var(--brand-muted);
  font-weight: 800;
}

.order-total {
  color: var(--brand-primary);
  font-size: 18px;
}

.payment-badge {
  display: inline-flex;
  justify-content: center;
  min-width: 78px;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 900;
}

.payment-badge.paid {
  color: var(--state-success);
  background: #e9f8ef;
}

.payment-badge.unpaid {
  color: var(--brand-primary);
  background: var(--brand-primary-light);
}

.view-btn {
  font-weight: 800;
}

.empty-orders {
  padding: 80px 24px;
  text-align: center;
  color: var(--brand-muted);
  background: #fffaf6;
}

.pagination-wrap {
  padding: 22px 24px 26px;
  border-top: 1px solid var(--brand-border);
  background: #fffaf6;
}

.mobile-order-list {
  display: none;
}

@media (max-width: 991px) {
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

  .mobile-order-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 14px;
  }

  .mobile-order-id {
    color: var(--brand-primary);
    font-size: 16px;
    font-weight: 900;
    word-break: break-all;
  }

  .mobile-order-time {
    margin-top: 8px;
    color: var(--brand-muted);
    font-size: 14px;
  }

  .mobile-view-btn {
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
    grid-template-columns: 80px 1fr;
    gap: 12px;
    margin-top: 10px;
  }

  .mobile-order-row span {
    color: var(--brand-muted);
    font-weight: 700;
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
}

@media (max-width: 768px) {
  .admin-hero {
    flex-direction: column;
    align-items: stretch;
    padding: 28px 22px;
    border-radius: 24px;
  }

  .refresh-btn {
    width: 100%;
  }

  .orders-card {
    border-radius: 24px;
  }

  .orders-card-header {
    padding: 22px;
  }
}
</style>