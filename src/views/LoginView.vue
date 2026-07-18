<template>
  <div class="login-page">
    <div class="container py-5">
      <div class="login-shell mx-auto">
        <div class="row g-0 align-items-stretch">
          <!-- 左側品牌區 -->
          <div class="col-lg-5">
            <div class="login-brand-panel h-100">
              <div class="brand-mark mb-4">
                <i class="bi bi-shop-window"></i>
              </div>

              <span class="login-badge">ADMIN SYSTEM</span>

              <h1 class="fw-bold mt-3 mb-3">
                和韓食堂<br />
                後台管理
              </h1>

              <p class="mb-4">
                管理日韓料理商品、優惠券與訂單資料，讓前台訂購流程保持順暢。
              </p>

              <div class="login-feature-list">
                <div>
                  <i class="bi bi-box-seam"></i>
                  商品管理
                </div>
                <div>
                  <i class="bi bi-ticket-perforated"></i>
                  優惠券管理
                </div>
                <div>
                  <i class="bi bi-receipt-cutoff"></i>
                  訂單檢視
                </div>
              </div>
            </div>
          </div>

          <!-- 右側登入表單 -->
          <div class="col-lg-7">
            <div class="login-form-panel h-100">
              <div class="mb-4">
                <span class="form-kicker">LOGIN</span>
                <h2 class="fw-bold mt-2 mb-2">請先登入後台</h2>
                <p class="text-muted mb-0">
                  請輸入管理員 Email 與密碼，登入後即可進入商品管理頁面。
                </p>
              </div>

              <form @submit.prevent="signin">
                <div class="mb-3">
                  <label for="inputEmail" class="form-label fw-bold">
                    Email
                  </label>

                  <div class="input-icon-wrap">
                    <i class="bi bi-envelope"></i>
                    <input
                      id="inputEmail"
                      v-model.trim="user.username"
                      type="email"
                      class="form-control form-control-lg login-input"
                      placeholder="請輸入 Email"
                      required
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <label for="inputPassword" class="form-label fw-bold">
                    Password
                  </label>

                  <div class="input-icon-wrap">
                    <i class="bi bi-lock"></i>
                    <input
                      id="inputPassword"
                      v-model.trim="user.password"
                      type="password"
                      class="form-control form-control-lg login-input"
                      placeholder="請輸入密碼"
                      required
                    />
                  </div>
                </div>

                <button
                  class="btn btn-brand btn-lg w-100 login-submit-btn"
                  type="submit"
                >
                  <i class="bi bi-box-arrow-in-right me-1"></i>
                  登入後台
                </button>

                <div class="login-note mt-4">
                  <i class="bi bi-shield-check me-1"></i>
                  僅限後台管理人員使用，登入後才會顯示商品管理與優惠券管理功能。
                </div>
              </form>

              <div class="mt-4 text-center">
                <router-link to="/" class="back-home-link">
                  <i class="bi bi-arrow-left me-1"></i>
                  返回和韓食堂首頁
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '@/methods/emitter';

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    signin() {
      const api = `${process.env.VUE_APP_API}/admin/signin`;

      this.$http
        .post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data;

            document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()}; path=/`;

            this.$http.defaults.headers.common.Authorization = token;

            emitter.emit('admin-login-updated');

            this.$router.push('/admin/products').then(() => {
              emitter.emit('push-message', {
                style: 'success',
                title: '登入成功',
                content: '歡迎回來',
              });
            });
          } else {
            emitter.emit('push-message', {
              style: 'danger',
              title: '登入失敗',
              content: res.data.message || '請確認帳號密碼是否正確',
            });
          }
        })
        .catch(() => {
          emitter.emit('push-message', {
            style: 'danger',
            title: '登入失敗',
            content: '伺服器錯誤，請稍後再試',
          });
        });
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.16), transparent 34%),
    radial-gradient(circle at bottom right, rgba(220, 143, 92, 0.14), transparent 30%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 46%, var(--brand-bg-soft) 100%);
}

.login-shell {
  max-width: 1040px;
  overflow: hidden;
  border-radius: 34px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 24px 64px rgba(120, 54, 28, 0.16);
}

.login-brand-panel {
  position: relative;
  overflow: hidden;
  padding: 48px 42px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(178, 58, 46, 0.96), rgba(214, 111, 72, 0.94)),
    var(--brand-primary);
}

.login-brand-panel::after {
  content: "🍱";
  position: absolute;
  right: -12px;
  bottom: -18px;
  font-size: 128px;
  opacity: 0.14;
}

.brand-mark {
  width: 64px;
  height: 64px;
  border-radius: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  background: #ffffff;
  box-shadow: 0 16px 34px rgba(80, 40, 20, 0.18);
}

.brand-mark i {
  font-size: 30px;
  line-height: 1;
}

.login-badge {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1px;
}

.login-brand-panel h1 {
  line-height: 1.35;
  letter-spacing: 1px;
}

.login-brand-panel p {
  max-width: 320px;
  line-height: 1.9;
  opacity: 0.92;
}

.login-feature-list {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

.login-feature-list div {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
}

.login-feature-list i {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
}

.login-form-panel {
  padding: 48px 52px;
}

.form-kicker {
  display: inline-block;
  padding: 7px 12px;
  border-radius: 999px;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
}

.login-form-panel h2 {
  color: var(--brand-text);
}

.input-icon-wrap {
  position: relative;
}

.input-icon-wrap > i {
  position: absolute;
  top: 50%;
  left: 16px;
  z-index: 2;
  color: var(--brand-primary);
  font-size: 18px;
  transform: translateY(-50%);
}

.login-input {
  min-height: 54px;
  padding-left: 46px;
  border-color: var(--brand-border);
  border-radius: 16px;
  font-weight: 700;
}

.login-input:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 0.25rem rgba(178, 58, 46, 0.16);
}

.login-submit-btn {
  min-height: 54px;
  border-radius: 16px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.login-note {
  padding: 14px 16px;
  border-radius: 16px;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  border: 1px solid var(--brand-border);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.7;
}

.back-home-link {
  color: var(--brand-muted);
  font-weight: 800;
  text-decoration: none;
}

.back-home-link:hover {
  color: var(--brand-primary);
}

@media (max-width: 991px) {
  .login-page {
    align-items: flex-start;
  }

  .login-shell {
    border-radius: 28px;
  }

  .login-brand-panel {
    padding: 36px 28px;
  }

  .login-form-panel {
    padding: 36px 28px;
  }
}

@media (max-width: 576px) {
  .login-page .container {
    padding-left: 18px;
    padding-right: 18px;
  }

  .login-shell {
    border-radius: 24px;
  }

  .login-brand-panel {
    padding: 30px 24px;
  }

  .login-brand-panel h1 {
    font-size: 30px;
  }

  .login-form-panel {
    padding: 30px 24px;
  }
}
</style>