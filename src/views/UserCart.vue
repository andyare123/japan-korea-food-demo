<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading"></Loading>

  <div class="food-cart-page">
    <div class="container py-5">
      <!-- 頁面標題 -->
      <div class="page-hero mb-5">
        <div class="hero-content">
          <span class="hero-badge">YOUR ORDER</span>
          <h1 class="fw-bold mt-3 mb-3">
            我的餐點購物車
          </h1>
          <p class="text-muted mb-0">
            請確認餐點數量、套用優惠券，確認無誤後即可進入完成訂購流程。
          </p>
        </div>
      </div>

      <div class="row justify-content-center">
        <!-- 購物車 -->
        <div class="col-lg-8 col-xl-7">
          <div class="cart-panel">
            <div class="cart-header mb-3">
              <div>
                <span class="small text-danger fw-bold">CART DETAIL</span>
                <h4 class="fw-bold mb-1">我的餐點購物車</h4>
                <p class="text-muted mb-0 small">
                  確認餐點數量後，可套用優惠券並進入下一步。
                </p>
              </div>
            </div>

            <div class="mb-4">
              <router-link to="/products" class="btn btn-outline-secondary w-100">
                <i class="bi bi-arrow-left me-1"></i>
                繼續挑選日韓料理
              </router-link>
            </div>

            <div v-if="cart.carts && cart.carts.length">
              <div
                class="cart-item"
                v-for="item in cart.carts"
                :key="item.id"
              >
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm cart-remove"
                  :disabled="status.loadingItem === item.id"
                  @click="removeCartItem(item.id)"
                >
                  <i class="bi bi-x"></i>
                </button>

                <div
                  class="cart-thumb"
                  :style="{ backgroundImage: `url(${item.product?.imageUrl || defaultImage})` }"
                ></div>

                <div class="cart-info">
                  <div class="d-flex align-items-center gap-2 mb-1">
                    <span class="cart-category">
                      {{ item.product?.category || '料理' }}
                    </span>

                    <span class="text-success small" v-if="item.coupon">
                      已套用優惠
                    </span>
                  </div>

                  <h6 class="fw-bold mb-2">
                    {{ item.product?.title || '未命名餐點' }}
                  </h6>

                  <div class="input-group input-group-sm cart-qty">
                    <input
                      type="number"
                      class="form-control"
                      min="1"
                      :disabled="item.id === status.loadingItem"
                      @change="updateCart(item)"
                      v-model.number="item.qty"
                    >

                    <div class="input-group-text">
                      {{ item.product?.unit || '份' }}
                    </div>
                  </div>
                </div>

                <div class="cart-price text-end">
                  <small
                    v-if="cart.final_total !== cart.total"
                    class="text-success d-block"
                  >
                    折扣價
                  </small>

                  <strong>
                    {{ $filters.currency(item.final_total) }}
                  </strong>
                </div>
              </div>
            </div>

            <div v-else class="empty-cart">
              <i class="bi bi-bag-x"></i>
              <h5 class="fw-bold mt-3 mb-2">購物車目前沒有餐點</h5>
              <p class="text-muted mb-4">
                還沒有加入任何日韓料理，先回到料理列表挑選想吃的餐點吧。
              </p>

              <router-link to="/products" class="btn btn-danger">
                <i class="bi bi-search me-1"></i>
                前往挑選料理
              </router-link>
            </div>

            <!-- 金額 -->
            <div class="cart-summary mt-4">
              <div class="d-flex justify-content-between mb-2">
                <span>餐點小計</span>
                <strong>{{ $filters.currency(cart.total || 0) }}</strong>
              </div>

              <div
                class="d-flex justify-content-between text-success"
                v-if="cart.final_total !== cart.total"
              >
                <span>優惠後金額</span>
                <strong>{{ $filters.currency(cart.final_total || 0) }}</strong>
              </div>

              <hr>

              <div class="d-flex justify-content-between total-line">
                <span>應付總額</span>
                <strong>{{ $filters.currency(cart.final_total || cart.total || 0) }}</strong>
              </div>
            </div>

            <!-- 優惠券介紹 -->
            <div class="coupon-box mt-4 mb-3">
              <div>
                <h5 class="fw-bold mb-1">日韓美食優惠券</h5>
                <p class="mb-0 text-muted">
                  輸入優惠碼
                  <strong class="text-danger">JPKR100</strong>
                  ，滿額享折扣優惠。
                </p>
              </div>
            </div>

            <!-- 優惠券輸入 -->
            <div class="input-group mb-3 coupon-input-group">
              <input
                type="text"
                class="form-control"
                v-model.trim="coupon_code"
                placeholder="請輸入優惠碼"
                @keyup.enter="addCouponCode"
              >

              <button
                class="btn btn-outline-danger"
                type="button"
                :disabled="isLoading || !cart.carts.length"
                @click="addCouponCode"
              >
                套用優惠碼
              </button>
            </div>

            <div class="d-grid mt-4">
              <button
                type="button"
                class="btn btn-danger btn-lg next-checkout-btn"
                :disabled="!cart.carts || !cart.carts.length"
                @click="goCheckoutProcess"
              >
                下一步，完成訂購流程
                <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const { VUE_APP_API, VUE_APP_PATH } = process.env;

export default {
  inject: ['emitter'],
  data() {
    return {
      isLoading: false,
      status: {
        loadingItem: '',
      },
      cart: {
        carts: [],
        total: 0,
        final_total: 0,
      },
      coupon_code: '',
      defaultImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    };
  },
  methods: {
    pushToast(title, content = '', style = 'danger') {
      this.emitter.emit('push-message', {
        style,
        title,
        content,
      });
    },

    getCart() {
      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart`;

      this.isLoading = true;

      this.$http.get(url)
        .then((response) => {
          this.cart = response.data.data || {
            carts: [],
            total: 0,
            final_total: 0,
          };
        })
        .catch((error) => {
          console.error('取得購物車失敗:', error);

          this.pushToast(
            '取得購物車失敗',
            '請稍後再試，或重新整理頁面。',
            'danger',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    updateCart(item) {
      if (item.qty < 1) {
        // eslint-disable-next-line no-param-reassign
        item.qty = 1;

        this.pushToast(
          '數量錯誤',
          '餐點數量至少需要 1 份。',
          'warning',
        );
      }

      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart/${item.id}`;

      this.isLoading = true;
      this.status.loadingItem = item.id;

      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };

      this.$http.put(url, { data: cart })
        .then((res) => {
          this.$httpMessageState(res, '更新購物車');

          if (res.data.success) {
            this.pushToast(
              '更新購物車成功',
              `${item.product?.title || '餐點'} 數量已更新。`,
              'success',
            );

            this.getCart();
            window.dispatchEvent(new Event('cart-updated'));
          } else {
            this.pushToast(
              '更新購物車失敗',
              res.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('更新購物車失敗:', error);

          this.pushToast(
            '更新購物車失敗',
            '請確認網路連線或稍後再試。',
            'danger',
          );
        })
        .finally(() => {
          this.status.loadingItem = '';
          this.isLoading = false;
        });
    },

    removeCartItem(id) {
      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/cart/${id}`;

      this.status.loadingItem = id;
      this.isLoading = true;

      this.$http.delete(url)
        .then((response) => {
          this.$httpMessageState(response, '移除購物車品項');

          if (response.data.success) {
            this.pushToast(
              '已移除餐點',
              '餐點已從購物車移除。',
              'success',
            );

            this.getCart();
            window.dispatchEvent(new Event('cart-updated'));
          } else {
            this.pushToast(
              '移除餐點失敗',
              response.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('移除購物車品項失敗:', error);

          this.pushToast(
            '移除餐點失敗',
            '請確認網路連線或稍後再試。',
            'danger',
          );
        })
        .finally(() => {
          this.status.loadingItem = '';
          this.isLoading = false;
        });
    },

    addCouponCode() {
      if (!this.cart.carts.length) {
        this.pushToast(
          '無法套用優惠券',
          '購物車目前沒有餐點，請先加入餐點後再套用優惠券。',
          'warning',
        );
        return;
      }

      if (!this.coupon_code.trim()) {
        this.pushToast(
          '請輸入優惠券代碼',
          '請輸入優惠碼後再按下套用。',
          'warning',
        );
        return;
      }

      const url = `${VUE_APP_API}/api/${VUE_APP_PATH}/coupon`;

      const coupon = {
        code: this.coupon_code.trim(),
      };

      this.isLoading = true;

      this.$http.post(url, { data: coupon })
        .then((response) => {
          this.$httpMessageState(response, '套用優惠券');

          if (response.data.success) {
            this.pushToast(
              '套用優惠券成功',
              `優惠碼 ${this.coupon_code.trim()} 已成功套用。`,
              'success',
            );

            this.getCart();
          } else {
            this.pushToast(
              '優惠券套用失敗',
              response.data.message || '請確認優惠碼是否正確或是否已啟用。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('優惠券套用失敗:', error);

          this.pushToast(
            '優惠券套用失敗',
            '請確認後台是否有建立並啟用這張優惠券。',
            'danger',
          );
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    goCheckoutProcess() {
      if (!this.cart.carts || !this.cart.carts.length) {
        this.pushToast(
          '購物車目前沒有餐點',
          '請先加入餐點後再進入完成訂購流程。',
          'warning',
        );
        return;
      }

      this.$router.push('/checkout-process');
    },
  },
  created() {
    this.getCart();
  },
};
</script>

<style scoped>
.food-cart-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.12), transparent 32%),
    linear-gradient(180deg, #fff7ef 0%, #ffffff 44%, #fffaf5 100%);
}

.page-hero {
  position: relative;
  overflow: hidden;
  padding: 44px;
  border-radius: 30px;
  background:
    linear-gradient(135deg, rgba(178, 58, 46, 0.14), rgba(255, 255, 255, 0.96)),
    #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(110, 58, 30, 0.12);
}

.page-hero::after {
  content: "🛒";
  position: absolute;
  right: 38px;
  bottom: 20px;
  font-size: 72px;
  opacity: 0.16;
}

.hero-content {
  max-width: 720px;
}

.hero-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: #b23a2e;
  background: #fff0e7;
  font-weight: 800;
  letter-spacing: 1px;
}

.cart-panel {
  padding: 28px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 48px rgba(120, 54, 28, 0.13);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.cart-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid #f1e4dc;
}

.cart-remove {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border-radius: 50%;
}

.cart-thumb {
  flex: 0 0 auto;
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background-size: cover;
  background-position: center;
  background-color: #fff4ec;
  border: 1px solid #f1d8ca;
}

.cart-info {
  flex: 1;
  min-width: 0;
}

.cart-category {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 999px;
  color: #b23a2e;
  background: #fff0e7;
  font-size: 12px;
  font-weight: 800;
}

.cart-qty {
  max-width: 155px;
}

.cart-price {
  flex: 0 0 98px;
}

.empty-cart {
  padding: 34px 20px;
  border-radius: 22px;
  text-align: center;
  color: #6c757d;
  background: #fff8f2;
  border: 1px dashed #e5c9b8;
}

.empty-cart i {
  display: block;
  margin-bottom: 10px;
  font-size: 42px;
  color: #c9a18b;
}

.cart-summary {
  padding: 20px;
  border-radius: 20px;
  background: #fff8f2;
  border: 1px solid #f1d8ca;
}

.total-line {
  color: #b23a2e;
  font-size: 18px;
}

.coupon-box {
  padding: 20px;
  border-radius: 20px;
  background: #fff8e1;
  border: 1px solid #ffe0a1;
}

.coupon-input-group .form-control,
.coupon-input-group .btn {
  min-height: 44px;
}

.next-checkout-btn {
  min-height: 52px;
  border-radius: 14px;
  font-weight: 900;
}

@media (max-width: 768px) {
  .container {
    padding-left: 18px;
    padding-right: 18px;
  }

  .page-hero {
    padding: 28px 22px;
    border-radius: 22px;
  }

  .page-hero h1 {
    font-size: 28px;
    line-height: 1.45;
  }

  .page-hero::after {
    right: 20px;
    bottom: 18px;
    font-size: 42px;
  }

  .cart-panel {
    padding: 20px;
    border-radius: 22px;
  }

  .cart-header {
    align-items: flex-start;
  }

  .cart-item {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .cart-price {
    flex-basis: 100%;
    text-align: left !important;
    padding-left: 124px;
  }

  .coupon-input-group {
    flex-direction: column;
  }

  .coupon-input-group .form-control,
  .coupon-input-group .btn {
    width: 100%;
    border-radius: 8px !important;
  }

  .coupon-input-group .btn {
    margin-top: 8px;
  }
}
</style>