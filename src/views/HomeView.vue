<template>
  <main class="home-page">
    <!-- Hero -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <span class="badge bg-brand-soft text-brand mb-3">
              今日限定優惠 9 折起
            </span>

            <h1 class="display-4 fw-bold mb-4 hero-title">
              在家也能享受<br />
              日式職人料理與韓式人氣美食
            </h1>

            <p class="lead text-muted mb-4">
              精選壽司、拉麵、丼飯、韓式炸雞、泡菜鍋與部隊鍋，
              從一人獨享到多人聚餐，一站式快速訂購。
            </p>

            <div class="d-flex flex-wrap gap-3">
              <router-link to="/products" class="btn btn-brand btn-lg">
                立即點餐
              </router-link>

              <router-link to="/favorites" class="btn btn-outline-brand btn-lg">
                查看我的最愛
              </router-link>
            </div>
          </div>

          <div class="col-lg-6 mt-5 mt-lg-0">
            <div class="hero-card">
              <div class="hero-card-label">WEEKLY TOP</div>
              <h4 class="fw-bold mb-3">本週人氣推薦</h4>

              <ul class="list-unstyled mb-0">
                <li>🍣 炙燒鮭魚握壽司套餐</li>
                <li>🍜 九州豚骨拉麵</li>
                <li>🍗 韓式甜辣炸雞</li>
                <li>🍲 起司部隊鍋雙人組</li>
              </ul>

              <router-link to="/products" class="btn btn-outline-brand w-100 mt-4">
                查看全部人氣料理
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 產品分類 -->
    <section class="container py-5">
      <div class="section-heading text-center mb-5">
        <span class="section-kicker">CATEGORY</span>
        <h2 class="fw-bold">依照今天的心情選料理</h2>
        <p class="text-muted mb-0">
          想吃清爽日式，還是濃郁韓式？快速找到最適合的一餐。
        </p>
      </div>

      <div class="row g-4">
        <div class="col-md-4">
          <router-link to="/products" class="category-card">
            <div class="category-icon">🍱</div>
            <h5 class="fw-bold">日式定食</h5>
            <p>壽司、丼飯、咖哩飯與日式餐盒，適合日常輕鬆享用。</p>
          </router-link>
        </div>

        <div class="col-md-4">
          <router-link to="/products" class="category-card">
            <div class="category-icon">🍜</div>
            <h5 class="fw-bold">拉麵與湯品</h5>
            <p>豚骨拉麵、味噌拉麵與暖胃湯品，滿足想喝熱湯的時刻。</p>
          </router-link>
        </div>

        <div class="col-md-4">
          <router-link to="/products" class="category-card">
            <div class="category-icon">🌶️</div>
            <h5 class="fw-bold">韓式人氣料理</h5>
            <p>韓式炸雞、泡菜鍋、部隊鍋與拌飯，適合聚餐共享。</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 行銷活動 -->
    <section class="promo-section py-5">
      <div class="container">
        <div class="promo-card">
          <div>
            <span class="section-kicker">SPECIAL OFFER</span>
            <h2 class="fw-bold mb-3">輸入優惠碼，滿額現折</h2>
            <p class="text-muted mb-0">
              購物車輸入優惠碼
              <strong class="text-brand">JPKR100</strong>
              ，滿額即可享折扣優惠。適合午餐外送、晚餐加菜與多人聚餐。
            </p>
          </div>

          <router-link to="/user/cart" class="btn btn-brand btn-lg">
            前往使用優惠券
          </router-link>
        </div>
      </div>
    </section>

    <!-- 人氣料理 -->
    <section class="container py-5">
      <div class="section-heading text-center mb-5">
        <span class="section-kicker">POPULAR MENU</span>
        <h2 class="fw-bold">人氣料理推薦</h2>
        <p class="text-muted mb-0">
          從日式經典到韓式熱門餐點，快速加入你的下一餐清單。
        </p>
      </div>

      <div class="row g-4">
        <div class="col-md-6 col-lg-3" v-for="item in popularMenus" :key="item.title">
          <div class="menu-card">
            <div class="menu-emoji">{{ item.icon }}</div>
            <h5 class="fw-bold">{{ item.title }}</h5>
            <p class="text-muted">{{ item.desc }}</p>
            <div class="menu-price">NT$ {{ item.price }}</div>
          </div>
        </div>
      </div>

      <div class="text-center mt-5">
        <router-link to="/products" class="btn btn-outline-brand btn-lg">
          瀏覽更多料理
        </router-link>
      </div>
    </section>

    <!-- 服務特色 -->
    <section class="container py-5">
      <div class="section-heading text-center mb-5">
        <span class="section-kicker">WHY CHOOSE US</span>
        <h2 class="fw-bold">為什麼選擇和韓食堂？</h2>
        <p class="text-muted mb-0">
          快速、好吃、選擇多，讓每一餐都像小旅行。
        </p>
      </div>

      <div class="row g-4">
        <div class="col-md-4">
          <div class="feature-card">
            <div class="feature-icon">🍱</div>
            <h5 class="fw-bold">精選日韓料理</h5>
            <p class="text-muted">
              從清爽日式餐盒到重口味韓式鍋物，滿足不同用餐情境。
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="feature-card">
            <div class="feature-icon">🎁</div>
            <h5 class="fw-bold">優惠券與組合價</h5>
            <p class="text-muted">
              不定期推出滿額折扣、雙人套餐與人氣料理加購優惠。
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="feature-card">
            <div class="feature-icon">❤️</div>
            <h5 class="fw-bold">我的最愛收藏</h5>
            <p class="text-muted">
              喜歡的料理一鍵收藏，下次不用重新尋找，快速回購。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 訂閱電子報 -->
    <section class="newsletter-section py-5">
      <div class="container">
        <div class="newsletter-card text-center">
          <span class="section-kicker">NEWSLETTER</span>
          <h2 class="fw-bold mb-3">訂閱最新優惠與新品消息</h2>
          <p class="text-muted mb-4">
            第一時間收到期間限定餐點、優惠券與人氣組合推薦。
          </p>

          <form class="newsletter-form mx-auto" @submit.prevent="subscribeNewsletter">
            <input
              v-model.trim="newsletterEmail"
              type="email"
              class="form-control form-control-lg"
              :class="{ 'is-invalid': newsletterError }"
              placeholder="請輸入 Email"
            />

            <button type="submit" class="btn btn-brand btn-lg newsletter-submit-btn">
              訂閱
            </button>

            <div v-if="newsletterError" class="invalid-feedback d-block text-start">
              {{ newsletterError }}
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import emitter from '../methods/emitter';

export default {
  name: 'HomeView',
  data() {
    return {
      newsletterEmail: '',
      newsletterError: '',
      popularMenus: [
        {
          icon: '🍣',
          title: '炙燒鮭魚握壽司',
          desc: '香氣濃郁的炙燒鮭魚，搭配醋飯剛剛好。',
          price: 280,
        },
        {
          icon: '🍜',
          title: '九州豚骨拉麵',
          desc: '濃厚湯頭與叉燒搭配，是經典日式風味。',
          price: 220,
        },
        {
          icon: '🍗',
          title: '韓式甜辣炸雞',
          desc: '外酥內嫩，甜辣醬香氣十足，適合分享。',
          price: 260,
        },
        {
          icon: '🍲',
          title: '起司部隊鍋',
          desc: '濃郁起司與韓式湯底，雙人聚餐首選。',
          price: 390,
        },
      ],
    };
  },
  methods: {
    pushToast(title, content = '', style = 'danger') {
      emitter.emit('push-message', {
        style,
        title,
        content,
      });
    },

    subscribeNewsletter() {
      const email = this.newsletterEmail.trim();

      if (!email) {
        this.newsletterError = '請先輸入 Email。';

        this.pushToast(
          '訂閱失敗',
          '請先輸入 Email。',
          'warning',
        );

        return;
      }

      const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRule.test(email)) {
        this.newsletterError = 'Email 格式不正確，請重新輸入。';

        this.pushToast(
          '訂閱失敗',
          'Email 格式不正確，請重新輸入。',
          'warning',
        );

        return;
      }

      this.newsletterError = '';

      this.pushToast(
        '訂閱成功',
        `我們會將最新優惠與新品消息寄送到 ${email}。`,
        'success',
      );

      this.newsletterEmail = '';
    },
  },
};
</script>

<style scoped>
.home-page {
  background: #ffffff;
}

.hero-section {
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.12), transparent 32%),
    linear-gradient(135deg, var(--brand-bg), #ffffff);
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-title {
  color: var(--brand-text);
  line-height: 1.25;
}

.hero-card {
  padding: 36px;
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(80, 40, 20, 0.12);
  border: 1px solid var(--brand-border);
}

.hero-card-label,
.section-kicker {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
}

.hero-card li {
  padding: 12px 0;
  color: var(--brand-text);
  font-size: 18px;
  border-bottom: 1px solid var(--brand-border);
}

.hero-card li:last-child {
  border-bottom: 0;
}

.section-heading h2 {
  color: var(--brand-text);
}

.category-card {
  display: block;
  height: 100%;
  padding: 30px;
  border-radius: 24px;
  color: var(--brand-text);
  text-decoration: none;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 12px 30px rgba(120, 54, 28, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.category-card:hover {
  color: var(--brand-text);
  transform: translateY(-5px);
  border-color: var(--brand-primary);
  box-shadow: 0 18px 42px rgba(120, 54, 28, 0.13);
}

.category-icon,
.feature-icon,
.menu-emoji {
  margin-bottom: 16px;
  font-size: 38px;
}

.category-card p {
  margin-bottom: 0;
  color: var(--brand-muted);
  line-height: 1.7;
}

.promo-section {
  background: var(--brand-bg-soft);
}

.promo-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 36px;
  border-radius: 28px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.menu-card,
.feature-card {
  height: 100%;
  padding: 30px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 12px 30px rgba(120, 54, 28, 0.08);
}

.menu-card h5,
.feature-card h5 {
  color: var(--brand-text);
}

.menu-card p,
.feature-card p {
  line-height: 1.7;
}

.menu-price {
  margin-top: 16px;
  color: var(--brand-primary);
  font-size: 20px;
  font-weight: 900;
}

.newsletter-section {
  background:
    linear-gradient(180deg, #ffffff 0%, var(--brand-bg) 100%);
}

.newsletter-card {
  max-width: 860px;
  margin: 0 auto;
  padding: 42px;
  border-radius: 30px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 18px 45px rgba(120, 54, 28, 0.1);
}

.newsletter-form {
  display: flex;
  max-width: 620px;
  gap: 12px;
}

.newsletter-form .form-control {
  border-color: var(--brand-border);
}

.newsletter-form .form-control:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 0.25rem rgba(178, 58, 46, 0.16);
}
.newsletter-submit-btn {
  min-width: 96px;
  white-space: nowrap;
}
@media (max-width: 991px) {
  .promo-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .promo-card .btn {
    width: 100%;
  }
  .newsletter-submit-btn {
    min-width: 96px;
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 28px 0;
  }

  .hero-title {
    font-size: 34px;
  }

  .hero-card,
  .promo-card,
  .newsletter-card {
    padding: 26px 22px;
    border-radius: 22px;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-form .btn,
  .newsletter-form .form-control {
    width: 100%;
  }
  .newsletter-submit-btn {
    min-width: 96px;
    white-space: nowrap;
  }
}
</style>
