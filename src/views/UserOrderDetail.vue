<template>
  <Loading :active="isLoading" />

  <div class="user-order-page">
    <div class="container py-5">
      <div class="order-complete-hero mb-4">
        <div class="success-icon">
          <i class="bi bi-check2-circle"></i>
        </div>

        <span class="order-kicker">ORDER DETAIL</span>

        <h1 class="fw-bold mt-3 mb-3">
          感謝您的訂購
        </h1>

        <p class="text-muted mb-0">
          以下是本次和韓食堂訂單明細，您可以確認付款狀態、訂購資料與餐點內容。
        </p>
      </div>

      <div v-if="orderData.id" class="row g-4">
        <div class="col-lg-8">
          <div class="receipt-card mb-4">
            <div class="receipt-header">
              <div>
                <span class="section-label">訂單編號</span>
                <h5 class="fw-bold mb-0 order-id">
                  {{ orderData.id }}
                </h5>
              </div>

              <span class="payment-badge" :class="isOrderPaid(orderData) ? 'paid' : 'unpaid'">
                {{ isOrderPaid(orderData) ? '已付款' : '未付款' }}
              </span>
            </div>

            <div class="receipt-divider"></div>

            <div class="receipt-info-grid">
              <div>
                <span>訂購時間</span>
                <strong>
                  {{ orderData.create_at ? $filters.date(orderData.create_at) : '未取得時間' }}
                </strong>
              </div>

              <div>
                <span>付款時間</span>
                <strong>
                  {{ orderData.paid_date ? $filters.date(orderData.paid_date) : '尚未付款' }}
                </strong>
              </div>
            </div>
          </div>

          <div class="receipt-card">
            <div class="section-title">
              <i class="bi bi-bag-heart"></i>
              <div>
                <h4 class="fw-bold mb-1">訂購餐點</h4>
                <p class="text-muted mb-0 small">本次選購的日韓料理明細</p>
              </div>
            </div>

            <div v-if="orderProducts.length" class="order-food-list">
              <div
                v-for="item in orderProducts"
                :key="item.id"
                class="food-row"
              >
                <div class="food-info">
                  <div class="food-thumb">
                    <img
                      :src="item.product?.imageUrl || defaultImage"
                      :alt="item.product?.title || '訂購餐點圖片'"
                      class="food-thumb-img"
                    />
                  </div>

                  <div>
                    <h6 class="fw-bold mb-1">
                      {{ item.product?.title || '未命名商品' }}
                    </h6>
                    <p class="text-muted small mb-0">
                      {{ item.product?.category || '精選料理' }}
                    </p>
                  </div>
                </div>

                <div class="food-meta">
                  <div class="food-meta-item">
                    <span>數量</span>
                    <strong>
                      {{ item.qty || 0 }} {{ item.product?.unit || '份' }}
                    </strong>
                  </div>

                  <div class="food-meta-divider"></div>

                  <div class="food-meta-item subtotal">
                    <span>小計</span>
                    <strong>
                      NT$ {{ $filters.currency(item.final_total || 0) }}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="empty-box">
              此訂單尚無商品資料
            </div>

           <div class="receipt-total">
              <span>訂單總計</span>
              <strong>NT$ {{ $filters.currency(orderData.total || 0) }}</strong>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="customer-card mb-4">
            <div class="section-title mb-3">
              <i class="bi bi-person-lines-fill"></i>
              <div>
                <h4 class="fw-bold mb-1">訂購資料</h4>
                <p class="text-muted mb-0 small">您的聯絡資訊</p>
              </div>
            </div>

            <div class="customer-list">
              <div>
                <span>姓名</span>
                <strong>{{ orderData.user?.name || '未填寫' }}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{{ orderData.user?.email || '未填寫' }}</strong>
              </div>

              <div>
                <span>電話</span>
                <strong>{{ orderData.user?.tel || '未填寫' }}</strong>
              </div>

              <div>
                <span>地址</span>
                <strong>{{ orderData.user?.address || '未填寫' }}</strong>
              </div>

              <div>
                <span>備註</span>
                <strong>{{ orderData.message || '無備註' }}</strong>
              </div>
            </div>
          </div>

          <div class="next-action-card">
            <h5 class="fw-bold mb-2">想再加點嗎？</h5>
            <p class="text-muted mb-3">
              歡迎繼續瀏覽更多日式、韓式人氣料理。
            </p>

            <router-link to="/products" class="btn btn-brand w-100">
              <i class="bi bi-shop me-1"></i>
              繼續挑選料理
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="empty-order-card">
        <div class="display-5 mb-3">🧾</div>
        <h5 class="fw-bold">目前沒有訂單資料</h5>
        <p class="text-muted mb-4">
          找不到這筆訂單，或訂單資料已被清除。
        </p>

        <router-link to="/products" class="btn btn-brand">
          前往點餐
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserOrderDetail',
  data() {
    return {
      isLoading: false,
      orderData: {},
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    };
  },
  computed: {
    orderProducts() {
      const products = this.orderData.products;

      if (Array.isArray(products)) {
        return products;
      }

      if (products && typeof products === 'object') {
        return Object.values(products);
      }

      return [];
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

    getOrder() {
      const orderId = this.$route.params.orderId || localStorage.getItem('latestPaidOrderId') || '';

      if (!orderId) {
        this.orderData = {};
        return;
      }

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order/${orderId}`;

      this.isLoading = true;

      this.$http
        .get(url)
        .then((response) => {
          if (response.data.success && response.data.order) {
            this.orderData = {
              id: orderId,
              ...response.data.order,
            };

            localStorage.setItem('latestPaidOrderId', orderId);
          } else {
            this.orderData = {};
            this.pushToast('取得訂單失敗', response.data.message || '找不到指定訂單。', 'danger');
          }
        })
        .catch(() => {
          this.orderData = {};
          this.pushToast('取得訂單失敗', '請稍後再試，或回到商品列表重新操作。', 'danger');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.getOrder();
  },
};
</script>

<style scoped>
.user-order-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.12), transparent 32%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 44%, var(--brand-bg-soft) 100%);
}

.order-complete-hero {
  max-width: 760px;
  margin: 0 auto;
  padding: 42px 32px;
  border-radius: 34px;
  text-align: center;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.success-icon {
  width: 82px;
  height: 82px;
  margin: 0 auto 18px;
  border-radius: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--state-success);
  background: #e9f8ef;
  font-size: 42px;
}

.order-kicker,
.section-label {
  display: inline-block;
  color: var(--brand-primary);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.receipt-card,
.customer-card,
.next-action-card,
.empty-order-card {
  padding: 28px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.order-id {
  color: var(--brand-text);
  word-break: break-all;
}

.payment-badge {
  display: inline-flex;
  min-width: 86px;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
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

.receipt-divider {
  height: 1px;
  margin: 24px 0;
  border-top: 1px dashed var(--brand-border);
}

.receipt-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.receipt-info-grid div,
.customer-list div {
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--brand-bg-soft);
  border: 1px solid var(--brand-border);
}

.receipt-info-grid span,
.customer-list span {
  display: block;
  margin-bottom: 6px;
  color: var(--brand-muted);
  font-size: 13px;
  font-weight: 700;
}

.receipt-info-grid strong,
.customer-list strong {
  color: var(--brand-text);
  word-break: break-word;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title > i {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-size: 22px;
  flex-shrink: 0;
}

.order-food-list {
  display: grid;
  gap: 14px;
  margin-top: 24px;
}

.food-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-radius: 20px;
  background: #fffaf6;
  border: 1px solid var(--brand-border);
}

.food-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.food-thumb {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  overflow: hidden;
  flex-shrink: 0;
  background: #fff4ec;
  border: 1px solid var(--brand-border);
  box-shadow: 0 8px 18px rgba(120, 54, 28, 0.08);
}

.food-thumb-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.food-meta {
  min-width: 210px;
  display: grid;
  grid-template-columns: 1fr 1px 1.35fr;
  align-items: center;
  column-gap: 10px;
  padding: 12px 14px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 8px 18px rgba(120, 54, 28, 0.06);
}

.food-meta-item {
  display: grid;
  gap: 4px;
  text-align: center;
}

.food-meta-item.subtotal {
  text-align: center;
}

.food-meta-item span {
  color: var(--brand-muted);
  font-size: 12px;
  font-weight: 800;
}

.food-meta-item strong {
  color: var(--brand-text);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.2;
}

.food-meta-item.subtotal strong {
  color: var(--brand-primary);
  font-size: 20px;
}

.food-meta-divider {
  width: 1px;
  height: 34px;
  background: var(--brand-border);
}

.receipt-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
  padding: 18px 20px;
  border-radius: 20px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
}

.receipt-total span {
  font-weight: 800;
}

.receipt-total strong {
  font-size: 24px;
  font-weight: 900;
}

.customer-list {
  display: grid;
  gap: 12px;
}

.empty-box,
.empty-order-card {
  text-align: center;
  color: var(--brand-muted);
}

.empty-box {
  padding: 30px 18px;
  border-radius: 18px;
  background: var(--brand-bg);
  border: 1px dashed var(--brand-border);
}

.empty-order-card {
  max-width: 560px;
  margin: 0 auto;
  padding: 64px 28px;
}

@media (max-width: 768px) {
  .order-complete-hero {
    padding: 34px 24px;
    border-radius: 26px;
  }

  .receipt-card,
  .customer-card,
  .next-action-card {
    padding: 22px;
    border-radius: 22px;
  }

  .receipt-header,
  .food-row,
  .receipt-total {
    flex-direction: column;
    align-items: flex-start;
  }

  .receipt-info-grid {
    grid-template-columns: 1fr;
  }

  .food-meta {
    width: 100%;
    min-width: 0;
    grid-template-columns: 1fr 1px 1.35fr;
    column-gap: 10px;
    padding: 12px 14px;
  }

  .food-meta-item {
    text-align: center;
  }

  .food-meta-item.subtotal {
    text-align: center;
  }

  .food-meta-item.subtotal strong {
    font-size: 20px;
  }
  .food-info {
    width: 100%;
    align-items: flex-start;
  }

  .food-thumb {
    width: 58px;
    height: 58px;
    border-radius: 16px;
  }
}
</style>