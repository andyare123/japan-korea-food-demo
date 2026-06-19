<!-- eslint-disable vue/no-multiple-template-root -->
<template>
  <Loading :active="isLoading"></Loading>

  <div class="checkout-process-page">
    <div class="container py-5">
      <div class="page-hero mb-5">
        <span class="hero-badge">CHECKOUT STEP</span>
        <h1 class="fw-bold mt-3 mb-3">完成訂購流程</h1>
        <p class="text-muted mb-0">
          請確認餐點內容、填寫訂購資料，最後確認無誤後建立訂單並前往付款。
        </p>
      </div>

      <div class="checkout-steps mb-4">
        <div class="step-item" :class="{ active: checkoutStep >= 1 }">
          <div class="step-circle">1</div>
          <div>
            <strong>確認購物車</strong>
            <small>確認餐點與數量</small>
          </div>
        </div>

        <div class="step-line" :class="{ active: checkoutStep >= 2 }"></div>

        <div class="step-item" :class="{ active: checkoutStep >= 2 }">
          <div class="step-circle">2</div>
          <div>
            <strong>填寫資料</strong>
            <small>填寫收件資訊</small>
          </div>
        </div>

        <div class="step-line" :class="{ active: checkoutStep >= 3 }"></div>

        <div class="step-item" :class="{ active: checkoutStep >= 3 }">
          <div class="step-circle">3</div>
          <div>
            <strong>最後確認</strong>
            <small>確認後建立訂單</small>
          </div>
        </div>
      </div>

      <div class="checkout-card">
        <!-- STEP 1 -->
        <div v-if="checkoutStep === 1">
          <div class="checkout-card-header mb-4">
            <div>
              <span class="small text-danger fw-bold">STEP 1</span>
              <h4 class="fw-bold mb-1">確認購物車餐點</h4>
              <p class="text-muted mb-0">
                請確認餐點、數量與金額是否正確，確認後再進入下一步。
              </p>
            </div>
          </div>

          <div v-if="cart.carts && cart.carts.length">
            <div
              class="confirm-item"
              v-for="item in cart.carts"
              :key="item.id"
            >
              <div
                class="confirm-img"
                :style="{ backgroundImage: `url(${item.product.imageUrl || defaultImage})` }"
              ></div>

              <div class="confirm-info">
                <h6 class="fw-bold mb-1">
                  {{ item.product.title }}
                </h6>

                <p class="text-muted small mb-2">
                  {{ item.product.description || item.product.content || '日韓人氣料理。' }}
                </p>

                <div class="input-group input-group-sm confirm-qty">
                  <input
                    type="number"
                    class="form-control"
                    min="1"
                    :disabled="item.id === status.loadingItem"
                    @change="updateCart(item)"
                    v-model.number="item.qty"
                  >
                  <span class="input-group-text">
                    {{ item.product.unit || '份' }}
                  </span>
                </div>
              </div>

              <div class="confirm-price text-end">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-sm mb-2"
                  :disabled="status.loadingItem === item.id"
                  @click="removeCartItem(item.id)"
                >
                  移除
                </button>

                <div class="fw-bold text-danger">
                  {{ $filters.currency(item.final_total) }}
                </div>
              </div>
            </div>

            <div class="checkout-summary mt-4">
              <div class="d-flex justify-content-between mb-2">
                <span>餐點小計</span>
                <strong>{{ $filters.currency(cart.total) }}</strong>
              </div>

              <div
                class="d-flex justify-content-between text-success"
                v-if="cart.final_total !== cart.total"
              >
                <span>優惠後金額</span>
                <strong>{{ $filters.currency(cart.final_total) }}</strong>
              </div>

              <hr>

              <div class="d-flex justify-content-between total-line">
                <span>應付總額</span>
                <strong>{{ $filters.currency(cart.final_total || cart.total) }}</strong>
              </div>
            </div>

            <div class="d-flex justify-content-between mt-4">
              <router-link to="/user/cart" class="btn btn-outline-secondary btn-lg">
                <i class="bi bi-arrow-left me-1"></i>
                返回購物車
              </router-link>

              <button
                type="button"
                class="btn btn-danger btn-lg"
                @click="nextStep"
              >
                下一步，填寫訂購資料
                <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>

          <div v-else class="empty-cart">
            <i class="bi bi-bag-x"></i>
            <h5 class="fw-bold mt-3 mb-2">購物車目前沒有餐點</h5>
            <p class="text-muted mb-4">
              請先加入日韓料理後再進行結帳。
            </p>
            <router-link to="/products" class="btn btn-danger">
              前往挑選料理
            </router-link>
          </div>
        </div>

        <!-- STEP 2 -->
        <div v-if="checkoutStep === 2">
          <div class="checkout-card-header mb-4">
            <div>
              <span class="small text-danger fw-bold">STEP 2</span>
              <h4 class="fw-bold mb-1">填寫訂購資料</h4>
              <p class="text-muted mb-0">
                請填寫正確的聯絡資訊，方便後續通知與配送。
              </p>
            </div>
          </div>
          <Form
            v-slot="{ errors, meta, validate }"
            :validate-on-mount="true"
            @submit.prevent
          >
            <div class="row g-3">
              <div class="col-md-6">
                <label for="email" class="form-label fw-bold">
                  Email <span class="text-danger">*</span>
                </label>

                <Field
                  id="email"
                  name="Email"
                  type="email"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': errors.Email,
                    'is-valid': !errors.Email && form.user.email,
                  }"
                  placeholder="請輸入 Email"
                  rules="required|email"
                  v-model="form.user.email"
                ></Field>

                <ErrorMessage name="Email" class="invalid-feedback"></ErrorMessage>
              </div>

              <div class="col-md-6">
                <label for="name" class="form-label fw-bold">
                  收件人姓名 <span class="text-danger">*</span>
                </label>

                <Field
                  id="name"
                  name="姓名"
                  type="text"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': errors['姓名'],
                    'is-valid': !errors['姓名'] && form.user.name,
                  }"
                  placeholder="請輸入姓名"
                  rules="required|min:2"
                  v-model="form.user.name"
                ></Field>

                <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
              </div>

              <div class="col-md-6">
                <label for="tel" class="form-label fw-bold">
                  收件人電話 <span class="text-danger">*</span>
                </label>

                <Field
                  id="tel"
                  name="電話"
                  type="tel"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': errors['電話'],
                    'is-valid': !errors['電話'] && form.user.tel,
                  }"
                  placeholder="請輸入手機號碼，例如：0912345678"
                  rules="required|twMobile"
                  v-model="form.user.tel"
                ></Field>

                <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>

                <small class="text-muted d-block mt-1">
                  請輸入 09 開頭的 10 碼手機號碼。
                </small>
              </div>

              <div class="col-md-6">
                <label for="address" class="form-label fw-bold">
                  收件人地址 <span class="text-danger">*</span>
                </label>

                <Field
                  id="address"
                  name="地址"
                  type="text"
                  class="form-control form-control-lg"
                  :class="{
                    'is-invalid': errors['地址'],
                    'is-valid': !errors['地址'] && form.user.address,
                  }"
                  placeholder="請輸入完整地址"
                  rules="required|min:6"
                  v-model="form.user.address"
                ></Field>

                <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
              </div>

              <div class="col-12">
                <label for="message" class="form-label fw-bold">備註</label>

                <textarea
                  id="message"
                  class="form-control"
                  rows="5"
                  placeholder="例如：不要辣、餐具數量、外送備註、希望送達時間"
                  v-model="form.message"
                ></textarea>
              </div>
            </div>

            <div class="form-checkout-alert mt-4" v-if="!meta.valid">
              <i class="bi bi-exclamation-circle me-1"></i>
              請確認以下欄位：

              <ul class="mb-0 mt-2 ps-4">
                <li v-for="(message, field) in errors" :key="field">
                  {{ field }}：{{ message }}
                </li>
              </ul>
            </div>

            <div class="d-flex justify-content-between mt-4">
              <button
                type="button"
                class="btn btn-outline-secondary btn-lg"
                @click="prevStep"
              >
                <i class="bi bi-arrow-left me-1"></i>
                上一步
              </button>

              <button
                type="button"
                class="btn btn-danger btn-lg"
                :disabled="isLoading || !meta.valid"
                @click="validate().then((result) => { if (result.valid) nextStep(); })"
              >
                下一步，確認訂單
                <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </Form>
        </div>

        <!-- STEP 3 -->
        <div v-if="checkoutStep === 3">
          <div class="checkout-card-header mb-4">
            <div>
              <span class="small text-danger fw-bold">STEP 3</span>
              <h4 class="fw-bold mb-1">最後確認訂單</h4>
              <p class="text-muted mb-0">
                請確認餐點、金額與訂購資料是否正確，確認後即可建立訂單並前往付款。
              </p>
            </div>
          </div>

          <div class="final-section mb-4">
            <h5 class="fw-bold mb-3">
              <i class="bi bi-bag-check me-1 text-danger"></i>
              餐點明細
            </h5>

            <div
              class="final-item"
              v-for="item in cart.carts"
              :key="item.id"
            >
              <div>
                <strong>{{ item.product.title }}</strong>
                <div class="text-muted small">
                  數量：{{ item.qty }} {{ item.product.unit || '份' }}
                </div>
              </div>

              <strong class="text-danger">
                {{ $filters.currency(item.final_total) }}
              </strong>
            </div>

            <div class="checkout-summary mt-3">
              <div class="d-flex justify-content-between mb-2">
                <span>餐點小計</span>
                <strong>{{ $filters.currency(cart.total) }}</strong>
              </div>

              <div
                class="d-flex justify-content-between text-success"
                v-if="cart.final_total !== cart.total"
              >
                <span>優惠後金額</span>
                <strong>{{ $filters.currency(cart.final_total) }}</strong>
              </div>

              <hr>

              <div class="d-flex justify-content-between total-line">
                <span>應付總額</span>
                <strong>{{ $filters.currency(cart.final_total || cart.total) }}</strong>
              </div>
            </div>
          </div>

          <div class="final-section mb-4">
            <h5 class="fw-bold mb-3">
              <i class="bi bi-person-lines-fill me-1 text-danger"></i>
              訂購資料
            </h5>

            <div class="info-grid">
              <div>
                <span>Email</span>
                <strong>{{ form.user.email }}</strong>
              </div>

              <div>
                <span>姓名</span>
                <strong>{{ form.user.name }}</strong>
              </div>

              <div>
                <span>電話</span>
                <strong>{{ form.user.tel }}</strong>
              </div>

              <div>
                <span>地址</span>
                <strong>{{ form.user.address }}</strong>
              </div>

              <div class="full">
                <span>備註</span>
                <strong>{{ form.message || '無備註' }}</strong>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button
              type="button"
              class="btn btn-outline-secondary btn-lg"
              @click="prevStep"
            >
              <i class="bi bi-arrow-left me-1"></i>
              上一步修改
            </button>

            <button
              type="button"
              class="btn btn-danger btn-lg"
              :disabled="isLoading || !cart.carts.length"
              @click="createOrder"
            >
              <span
                v-if="isLoading"
                class="spinner-grow spinner-grow-sm me-1"
              ></span>
              建立訂單並前往付款
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['emitter'],
  data() {
    return {
      isLoading: false,
      status: {
        loadingItem: '',
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {
        carts: [],
        total: 0,
        final_total: 0,
      },
      checkoutStep: 1,
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
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart`;

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

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${item.id}`;

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
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/cart/${id}`;

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

    nextStep() {
      if (this.checkoutStep === 1 && !this.cart.carts.length) {
        this.pushToast(
          '購物車目前沒有餐點',
          '請先加入餐點後再進入下一步。',
          'warning',
        );
        return;
      }

      if (this.checkoutStep < 3) {
        this.checkoutStep += 1;

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    },

    prevStep() {
      if (this.checkoutStep > 1) {
        this.checkoutStep -= 1;

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    },

    createOrder() {
      if (!this.cart.carts.length) {
        this.pushToast(
          '購物車目前沒有餐點',
          '請先加入餐點後再建立訂單。',
          'warning',
        );

        this.checkoutStep = 1;
        return;
      }

      const {
        name, email, tel, address,
      } = this.form.user;

      if (!name || !email || !tel || !address) {
        this.pushToast(
          '請先填寫完整訂購資料',
          '姓名、Email、電話與地址皆為必填。',
          'warning',
        );

        this.checkoutStep = 2;
        return;
      }

      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/order`;
      const order = this.form;

      this.isLoading = true;

      this.$http.post(url, { data: order })
        .then((res) => {
          if (res.data.success) {
            const { orderId } = res.data;

            this.pushToast(
              '訂單建立成功',
              '即將前往付款頁面。',
              'success',
            );

            localStorage.removeItem('orderDisplayCleared');

            window.dispatchEvent(new Event('cart-updated'));
            window.dispatchEvent(new Event('orders-display-reset'));
            window.dispatchEvent(new Event('orders-updated'));

            setTimeout(() => {
              this.$router.push(`/checkout/${orderId}`);
            }, 800);
          } else {
            this.pushToast(
              '訂單建立失敗',
              res.data.message || '請稍後再試。',
              'danger',
            );
          }
        })
        .catch((error) => {
          console.error('建立訂單失敗:', error);

          this.pushToast(
            '訂單建立失敗',
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
    this.getCart();
  },
};
</script>

<style scoped>
.checkout-process-page {
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

.hero-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: #b23a2e;
  background: #fff0e7;
  font-weight: 800;
  letter-spacing: 1px;
}

.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  max-width: 900px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #999;
}

.step-item strong {
  display: block;
  font-size: 15px;
}

.step-item small {
  display: block;
  font-size: 13px;
}

.step-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1e4dc;
  color: #9b7a68;
  font-weight: 900;
}

.step-item.active {
  color: #b23a2e;
}

.step-item.active .step-circle {
  color: #ffffff;
  background: #b23a2e;
  box-shadow: 0 10px 22px rgba(178, 58, 46, 0.22);
}

.step-line {
  width: 80px;
  height: 3px;
  border-radius: 999px;
  background: #f1e4dc;
}

.step-line.active {
  background: #b23a2e;
}

.checkout-card {
  max-width: 960px;
  margin: 0 auto;
  padding: 34px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.11);
}

.checkout-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
}

.confirm-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid #f1e4dc;
}

.confirm-img {
  flex: 0 0 auto;
  width: 92px;
  height: 92px;
  border-radius: 22px;
  background-size: cover;
  background-position: center;
  background-color: #fff4ec;
  border: 1px solid #f1d8ca;
}

.confirm-info {
  flex: 1;
  min-width: 0;
}

.confirm-qty {
  max-width: 170px;
}

.confirm-price {
  flex: 0 0 130px;
}

.checkout-summary {
  padding: 22px;
  border-radius: 20px;
  background: #fff8f2;
  border: 1px solid #f1d8ca;
}

.total-line {
  color: #b23a2e;
  font-size: 18px;
}

.final-section {
  padding: 24px;
  border-radius: 24px;
  background: #fffaf6;
  border: 1px solid #f1d8ca;
}

.final-item {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 14px 0;
  border-bottom: 1px solid #f1e4dc;
}

.final-item:last-child {
  border-bottom: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.info-grid div {
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #f1e4dc;
}

.info-grid span {
  display: block;
  margin-bottom: 6px;
  color: #888;
  font-size: 13px;
}

.info-grid strong {
  display: block;
  color: #333;
  line-height: 1.6;
  word-break: break-word;
}

.info-grid .full {
  grid-column: 1 / -1;
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
.form-checkout-alert {
  padding: 14px 18px;
  border-radius: 16px;
  color: #b23a2e;
  background: #fff0e7;
  border: 1px
  solid #f1d8ca;
  font-weight: 700;
}
@media (max-width: 768px) {
  .page-hero {
    padding: 28px 22px;
    border-radius: 22px;
  }

  .checkout-steps {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    border-radius: 22px;
    background: #ffffff;
    border: 1px solid #f1d8ca;
  }

  .step-line {
    width: 3px;
    height: 24px;
    margin-left: 19px;
  }

  .checkout-card {
    padding: 24px 18px;
    border-radius: 22px;
  }

  .confirm-item {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .confirm-price {
    flex-basis: 100%;
    text-align: left !important;
    padding-left: 110px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .d-flex.justify-content-between {
    gap: 12px;
    flex-direction: column;
  }

  .d-flex.justify-content-between .btn {
    width: 100%;
  }
}
</style>