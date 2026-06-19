<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading"></Loading>

  <div class="checkout-pay-page">
    <div class="container py-5">
      <!-- 頁首 -->
      <div class="pay-hero mb-5">
        <span class="pay-badge">PAYMENT CONFIRMATION</span>
        <h1 class="fw-bold mt-3 mb-3">
          確認付款
        </h1>
        <p class="text-muted mb-0">
          請再次確認餐點明細、訂購資料與付款狀態，確認無誤後即可完成付款。
        </p>
      </div>

      <div v-if="orderId" class="row g-4 align-items-start">
        <!-- 左側：訂單明細 -->
        <div class="col-lg-8">
          <div class="checkout-card mb-4">
            <div class="card-title-row mb-4">
              <div>
                <span class="section-label">ORDER ITEMS</span>
                <h4 class="fw-bold mb-1">餐點明細</h4>
                <p class="text-muted mb-0 small">
                  以下為本次訂單的餐點與數量。
                </p>
              </div>

              <span
                class="status-pill"
                :class="order.is_paid ? 'paid' : 'unpaid'"
              >
                {{ order.is_paid ? '付款完成' : '尚未付款' }}
              </span>
            </div>

            <div v-if="orderProducts.length">
              <div
                v-for="item in orderProducts"
                :key="item.id"
                class="order-item"
              >
                <div
                  class="order-img"
                  :style="{ backgroundImage: `url(${item.product?.imageUrl || defaultImage})` }"
                ></div>

                <div class="order-info">
                  <span class="food-category">
                    {{ item.product?.category || '精選料理' }}
                  </span>

                  <h5 class="fw-bold mt-2 mb-1">
                    {{ item.product?.title || '未命名料理' }}
                  </h5>

                  <p class="text-muted small mb-0">
                    數量：{{ item.qty }} {{ item.product?.unit || '份' }}
                  </p>
                </div>

                <div class="order-price text-end">
                  <small class="text-muted d-block">小計</small>
                  <strong class="text-danger">
                    {{ $filters.currency(item.final_total) }}
                  </strong>
                </div>
              </div>
            </div>

            <div v-else class="empty-box text-center">
              <div class="display-5 mb-3">🍱</div>
              <h5 class="fw-bold">目前沒有訂單餐點</h5>
              <p class="text-muted mb-0">
                請返回購物車重新建立訂單。
              </p>
            </div>
          </div>

          <!-- 訂購人資料 -->
          <div class="checkout-card">
            <div class="card-title-row mb-4">
              <div>
                <span class="section-label">CUSTOMER INFO</span>
                <h4 class="fw-bold mb-1">訂購資料</h4>
                <p class="text-muted mb-0 small">
                  請確認聯絡資訊是否正確。
                </p>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-item">
                <span>Email</span>
                <strong>{{ order.user.email || '未填寫' }}</strong>
              </div>

              <div class="info-item">
                <span>姓名</span>
                <strong>{{ order.user.name || '未填寫' }}</strong>
              </div>

              <div class="info-item">
                <span>收件人電話</span>
                <strong>{{ order.user.tel || '未填寫' }}</strong>
              </div>

              <div class="info-item">
                <span>收件人地址</span>
                <strong>{{ order.user.address || '未填寫' }}</strong>
              </div>

              <div class="info-item full">
                <span>付款狀態</span>
                <strong :class="order.is_paid ? 'text-success' : 'text-danger'">
                  {{ order.is_paid ? '付款完成' : '尚未付款' }}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <!-- 右側：付款摘要 -->
        <div class="col-lg-4">
          <form class="summary-card sticky-lg-top" @submit.prevent="payOrder">
            <span class="section-label">PAYMENT</span>

            <h3 class="fw-bold mt-2 mb-3">
              付款摘要
            </h3>

            <div class="summary-line">
              <span>訂單編號</span>
              <strong class="order-id-text">{{ orderId }}</strong>
            </div>

            <div class="summary-line">
              <span>餐點數量</span>
              <strong>{{ orderProductCount }} 份</strong>
            </div>

            <div class="summary-line">
              <span>付款狀態</span>
              <strong :class="order.is_paid ? 'text-success' : 'text-danger'">
                {{ order.is_paid ? '付款完成' : '尚未付款' }}
              </strong>
            </div>

            <hr>

            <div class="summary-total">
              <span>應付總額</span>
              <strong>{{ $filters.currency(order.total) }}</strong>
            </div>

            <div class="pay-notice mt-4">
              <h6 class="fw-bold mb-2">
                <i class="bi bi-shield-check me-1"></i>
                付款提醒
              </h6>
              <p class="mb-0">
                確認付款後，訂單狀態會更新為付款完成。
              </p>
            </div>

            <div class="d-grid gap-2 mt-4">
              <button
                v-if="order.is_paid === false"
                class="btn btn-danger btn-lg"
                type="submit"
                :disabled="isLoading || !orderProducts.length"
              >
                <span
                  v-if="isLoading"
                  class="spinner-grow spinner-grow-sm me-1"
                ></span>
                確認付款
              </button>

              <button
                v-else
                class="btn btn-success btn-lg"
                type="button"
                disabled
              >
                <i class="bi bi-check-circle me-1"></i>
                已完成付款
              </button>

              <router-link to="/products" class="btn btn-outline-dark">
                繼續選購料理
              </router-link>

              <router-link to="/user/cart" class="btn btn-outline-secondary">
                返回購物車
              </router-link>
            </div>
          </form>
        </div>
      </div>

      <div v-else-if="!isLoading" class="empty-box text-center">
        <div class="display-5 mb-3">🧾</div>
        <h4 class="fw-bold">找不到訂單編號</h4>
        <p class="text-muted">
          請先從購物車建立訂單，再前往付款頁。
        </p>
        <router-link to="/user/cart" class="btn btn-danger">
          返回購物車
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['emitter'],
  data() {
    return {
      order: {
        products: [],
        user: {},
        total: 0,
        is_paid: false,
      },
      orderId: '',
      isLoading: false,
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    };
  },
  computed: {
    orderProducts() {
      if (Array.isArray(this.order.products)) {
        return this.order.products;
      }

      if (this.order.products && typeof this.order.products === 'object') {
        return Object.values(this.order.products);
      }

      return [];
    },

    orderProductCount() {
      return this.orderProducts.reduce(
        (total, item) => total + Number(item.qty || 0),
        0,
      );
    },
  },
  methods: {
    pushToast(title, content = '', style = 'danger') {
      this.emitter.emit('push-message', {
        style,
        title,
        content,
      });
    },

    getOrder() {
      if (!this.orderId) {
        this.pushToast(
          '找不到訂單編號',
          '請先從購物車建立訂單，再前往付款頁。',
          'warning',
        );

        this.$router.push('/user/cart');
        return;
      }

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order/${this.orderId}`;

      this.isLoading = true;

      this.$http.get(url)
        .then((res) => {
          if (res.data.success) {
            this.order = {
              products: [],
              user: {},
              total: 0,
              is_paid: false,
              ...res.data.order,
            };
          } else {
            this.pushToast(
              '找不到訂單資料',
              res.data.message || '請重新從購物車建立訂單。',
              'danger',
            );

            this.$router.push('/user/cart');
          }
        })
        .catch((error) => {
          console.error('取得訂單失敗:', error);

          this.pushToast(
            '取得訂單失敗',
            '請稍後再試，或重新從購物車建立訂單。',
            'danger',
          );

          this.$router.push('/user/cart');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    payOrder() {
      if (this.order.is_paid) {
        return;
      }

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/pay/${this.orderId}`;

      this.isLoading = true;

      this.$http.post(url)
        .then((res) => {
          this.$httpMessageState(res, '付款');

          if (res.data.success) {
            this.order.is_paid = true;

            this.pushToast(
              '付款完成',
              '訂單已成功付款，即將前往訂單查詢。',
              'success',
            );

            localStorage.removeItem('orderDisplayCleared');
            localStorage.setItem('latestPaidOrderId', this.orderId);

            window.dispatchEvent(new CustomEvent('orders-display-reset', {
              detail: {
                orderId: this.orderId,
              },
            }));

            window.dispatchEvent(new Event('orders-updated'));
            window.dispatchEvent(new Event('cart-updated'));

            setTimeout(() => {
              this.$router.push({
                path: '/admin/orders',
                query: {
                  orderId: this.orderId,
                },
              });
            }, 1500);
          } else {
            this.pushToast(
              '付款失敗',
              res.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('付款失敗:', error);

          this.pushToast(
            '付款失敗',
            '請確認網路連線或稍後再試。',
            'danger',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  created() {
    this.orderId = this.$route.params.orderId;
    this.getOrder();
  },
};
</script>

<style scoped>
.checkout-pay-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.12), transparent 32%),
    linear-gradient(180deg, #fff7ef 0%, #ffffff 44%, #fffaf5 100%);
}

.pay-hero {
  padding: 42px;
  border-radius: 30px;
  background:
    linear-gradient(135deg, rgba(178, 58, 46, 0.14), rgba(255, 255, 255, 0.96)),
    #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(110, 58, 30, 0.12);
}

.pay-badge,
.section-label {
  display: inline-block;
  color: #b23a2e;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.pay-badge {
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff0e7;
}

.checkout-card,
.summary-card {
  padding: 30px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.summary-card {
  top: 24px;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
}

.status-pill {
  flex: 0 0 auto;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 900;
}

.status-pill.unpaid {
  color: #b23a2e;
  background: #fff0e7;
}

.status-pill.paid {
  color: #198754;
  background: #e9f8ef;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid #f1e4dc;
}

.order-item:last-child {
  border-bottom: 0;
}

.order-img {
  flex: 0 0 auto;
  width: 90px;
  height: 90px;
  border-radius: 22px;
  background-size: cover;
  background-position: center;
  background-color: #fff4ec;
  border: 1px solid #f1d8ca;
}

.order-info {
  flex: 1;
  min-width: 0;
}

.food-category {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  color: #b23a2e;
  background: #fff0e7;
  font-size: 12px;
  font-weight: 800;
}

.order-price {
  flex: 0 0 120px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-item {
  padding: 16px;
  border-radius: 16px;
  background: #fffaf6;
  border: 1px solid #f1e4dc;
}

.info-item.full {
  grid-column: 1 / -1;
}

.info-item span {
  display: block;
  margin-bottom: 6px;
  color: #888;
  font-size: 13px;
}

.info-item strong {
  display: block;
  color: #333;
  line-height: 1.6;
  word-break: break-word;
}

.summary-line,
.summary-total {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
}

.summary-line span,
.summary-total span {
  color: #777;
}

.summary-total {
  align-items: center;
  color: #b23a2e;
}

.summary-total strong {
  font-size: 28px;
}

.order-id-text {
  max-width: 160px;
  text-align: right;
  word-break: break-all;
  font-size: 13px;
}

.pay-notice {
  padding: 18px;
  border-radius: 18px;
  color: #6c5b50;
  background: #fff8e1;
  border: 1px solid #ffe0a1;
}

.empty-box {
  padding: 80px 24px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

@media (max-width: 991px) {
  .sticky-lg-top {
    position: static !important;
  }

  .summary-card {
    margin-top: 10px;
  }
}

@media (max-width: 768px) {
  .pay-hero {
    padding: 28px 22px;
    border-radius: 22px;
  }

  .checkout-card,
  .summary-card {
    padding: 22px;
    border-radius: 22px;
  }

  .card-title-row {
    flex-direction: column;
  }

  .order-item {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .order-price {
    flex-basis: 100%;
    text-align: left !important;
    padding-left: 108px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .summary-total strong {
    font-size: 24px;
  }
}
</style>