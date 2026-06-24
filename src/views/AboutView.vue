<template>
  <div class="about-page">
    <!-- Hero 區塊 -->
    <section class="about-hero">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <span class="hero-badge">ABOUT WAKAN DINING</span>

            <h1 class="fw-bold mt-3 mb-4">
              關於和韓食堂
            </h1>

            <p class="hero-text mb-4">
              和韓食堂是一個專為日式與韓式料理打造的線上訂餐平台，
              我們嚴選人氣餐點、簡化訂購流程，讓顧客能快速找到喜歡的料理，
              輕鬆完成收藏、加入購物車、結帳與訂單查詢。
            </p>

            <div class="hero-actions">
              <router-link to="/products" class="btn btn-danger btn-lg">
                立即瀏覽料理
                <i class="bi bi-arrow-right ms-1"></i>
              </router-link>

              <router-link to="/favorites" class="btn btn-outline-dark btn-lg">
                查看我的最愛
              </router-link>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="hero-image-card">
              <div class="hero-image"></div>

              <div class="floating-card">
                <i class="bi bi-stars"></i>
                <div>
                  <strong>日韓料理精選平台</strong>
                  <span>快速點餐・收藏料理・安心付款</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 數據特色 -->
    <section class="stats-section">
      <div class="container">
        <div class="row g-4">
          <div
            v-for="item in stats"
            :key="item.title"
            class="col-md-4"
          >
            <div class="stat-card">
              <strong>{{ item.value }}</strong>
              <span>{{ item.title }}</span>
              <p>{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 品牌理念 -->
    <section class="brand-section">
      <div class="container">
        <div class="section-title text-center mb-5">
          <span>OUR VALUE</span>
          <h2 class="fw-bold mt-2">我們重視的，不只是餐點</h2>
          <p class="text-muted mb-0">
            從料理選擇到訂單完成，我們希望每一步都簡單、清楚又安心。
          </p>
        </div>

        <div class="row g-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="col-md-6 col-lg-3"
          >
            <div class="feature-card">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>

              <h5 class="fw-bold mt-4 mb-3">
                {{ feature.title }}
              </h5>

              <p class="text-muted mb-0">
                {{ feature.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 平台服務 -->
    <section class="service-section">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-5">
            <span class="section-label">PLATFORM SERVICE</span>

            <h2 class="fw-bold mt-3 mb-4">
              打造更順暢的線上點餐體驗
            </h2>

            <p class="text-muted service-text">
              和韓食堂整合料理瀏覽、我的最愛、購物車、優惠券、付款確認與訂單查詢，
              讓顧客不用在複雜流程中來回切換，就能完成完整訂餐流程。
            </p>

            <router-link to="/products" class="btn btn-danger mt-3">
              開始點餐
            </router-link>
          </div>

          <div class="col-lg-7">
            <div class="process-list">
              <div
                v-for="(step, index) in process"
                :key="step.title"
                class="process-item"
              >
                <div class="process-number">
                  {{ index + 1 }}
                </div>

                <div>
                  <h5 class="fw-bold mb-2">
                    {{ step.title }}
                  </h5>

                  <p class="text-muted mb-0">
                    {{ step.text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 品牌承諾 -->
    <section class="promise-section">
      <div class="container">
        <div class="promise-card">
          <div>
            <span class="section-label">OUR PROMISE</span>

            <h2 class="fw-bold mt-3 mb-3">
              用心整理每一道料理，讓每一次點餐都更安心
            </h2>

            <p class="mb-0">
              我們希望讓日式與韓式料理不只是選項，而是一種簡單、快速、愉快的日常享受。
              從第一眼看到料理，到完成付款與查詢訂單，和韓食堂都會陪你完成每一步。
            </p>
          </div>

          <router-link to="/products" class="btn btn-light btn-lg">
            前往日韓料理
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      stats: [
        {
          value: '2',
          title: '主打料理類型',
          text: '精選日式料理與韓式料理，讓顧客快速找到喜歡的餐點。',
        },
        {
          value: '4',
          title: '完整訂餐功能',
          text: '支援料理瀏覽、收藏、購物車與訂單查詢流程。',
        },
        {
          value: '100%',
          title: '清楚透明流程',
          text: '從加入購物車到付款完成，每一步都清楚呈現。',
        },
      ],
      features: [
        {
          icon: 'bi bi-bag-heart-fill',
          title: '快速點餐',
          text: '清楚的料理卡片、價格與分類，幫助顧客快速完成選購。',
        },
        {
          icon: 'bi bi-heart-fill',
          title: '收藏清單',
          text: '喜歡的料理可以加入我的最愛，下次回購更加方便。',
        },
        {
          icon: 'bi bi-ticket-perforated-fill',
          title: '優惠折抵',
          text: '支援優惠券套用，讓顧客在結帳時享有更多彈性。',
        },
        {
          icon: 'bi bi-receipt-cutoff',
          title: '訂單查詢',
          text: '付款狀態與訂單內容清楚呈現，方便後續查詢與管理。',
        },
      ],
      process: [
        {
          title: '瀏覽日韓料理',
          text: '依照日式、韓式分類快速瀏覽料理，查看餐點內容與價格。',
        },
        {
          title: '加入我的最愛或購物車',
          text: '想回購的料理可加入收藏，確定要購買的餐點可加入購物車。',
        },
        {
          title: '確認餐點與填寫資料',
          text: '在購物車確認數量與金額，接著填寫訂購人資訊。',
        },
        {
          title: '完成付款與訂單查詢',
          text: '付款完成後可查看訂單狀態，確認本次訂購內容。',
        },
      ],
    };
  },
};
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(220, 53, 69, 0.12), transparent 30%),
    linear-gradient(180deg, #fff7ef 0%, #ffffff 45%, #fffaf5 100%);
}

.about-hero {
  padding: 90px 0 70px;
}

.hero-badge,
.section-label,
.section-title span {
  display: inline-block;
  color: #b23a2e;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.hero-badge {
  padding: 8px 14px;
  border-radius: 999px;
  background: #fff0e7;
}

.about-hero h1 {
  color: #2d201a;
  font-size: clamp(38px, 5vw, 64px);
  line-height: 1.18;
  letter-spacing: 1px;
}

.hero-text {
  max-width: 620px;
  color: #6c5b50;
  font-size: 18px;
  line-height: 1.9;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.hero-image-card {
  position: relative;
  padding: 16px;
  border-radius: 34px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 24px 60px rgba(120, 54, 28, 0.16);
}

.hero-image {
  min-height: 430px;
  border-radius: 26px;
  background:
    linear-gradient(180deg, rgba(45, 32, 26, 0.05), rgba(45, 32, 26, 0.28)),
    url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200') center/cover;
}

.floating-card {
  position: absolute;
  left: -18px;
  bottom: 34px;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 320px;
  padding: 16px 18px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(60, 40, 30, 0.2);
}

.floating-card i {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #b23a2e;
  font-size: 22px;
}

.floating-card strong,
.floating-card span {
  display: block;
}

.floating-card strong {
  color: #2d201a;
}

.floating-card span {
  color: #777;
  font-size: 14px;
}

.stats-section {
  padding: 0 0 70px;
}

.stat-card {
  height: 100%;
  padding: 28px;
  border-radius: 26px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 14px 36px rgba(120, 54, 28, 0.09);
}

.stat-card strong {
  display: block;
  color: #b23a2e;
  font-size: 42px;
  line-height: 1;
}

.stat-card span {
  display: block;
  margin-top: 12px;
  color: #2d201a;
  font-size: 18px;
  font-weight: 900;
}

.stat-card p {
  margin: 12px 0 0;
  color: #7a6a60;
  line-height: 1.7;
}

.brand-section {
  padding: 80px 0;
  background: #ffffff;
}

.section-title h2,
.service-section h2,
.promise-section h2 {
  color: #2d201a;
}

.feature-card {
  height: 100%;
  padding: 30px;
  border-radius: 28px;
  background: #fffaf6;
  border: 1px solid #f1d8ca;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 44px rgba(120, 54, 28, 0.12);
}

.feature-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, #b23a2e, #df6b4f);
  font-size: 26px;
}

.feature-card p {
  line-height: 1.8;
}

.service-section {
  padding: 90px 0;
}

.service-text {
  font-size: 17px;
  line-height: 1.9;
}

.process-list {
  display: grid;
  gap: 18px;
}

.process-item {
  display: flex;
  gap: 18px;
  padding: 24px;
  border-radius: 24px;
  background: #ffffff;
  border: 1px solid #f1d8ca;
  box-shadow: 0 12px 32px rgba(120, 54, 28, 0.08);
}

.process-number {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: #b23a2e;
  font-weight: 900;
  font-size: 20px;
}

.process-item p {
  line-height: 1.8;
}

.promise-section {
  padding: 0 0 90px;
}

.promise-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 28px;
  padding: 44px;
  border-radius: 32px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(178, 58, 46, 0.96), rgba(45, 32, 26, 0.96)),
    #b23a2e;
  box-shadow: 0 24px 60px rgba(120, 54, 28, 0.18);
}

.promise-card .section-label,
.promise-card h2,
.promise-card p {
  color: #ffffff;
}

.promise-card p {
  max-width: 780px;
  line-height: 1.9;
  opacity: 0.9;
}

.promise-card .btn {
  flex: 0 0 auto;
  color: #b23a2e;
  font-weight: 900;
  border-radius: 999px;
}

.btn-danger {
  background: #b23a2e;
  border-color: #b23a2e;
}

.btn-danger:hover {
  background: #982f25;
  border-color: #982f25;
}

.btn-outline-dark {
  border-color: #2d201a;
  color: #2d201a;
}

.btn-outline-dark:hover {
  background: #2d201a;
  border-color: #2d201a;
}
*,
*::before,
*::after {
  box-sizing: border-box;
}

.about-page {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.about-page .container,
.about-page .row,
.about-page [class*="col-"] {
  max-width: 100%;
}

.hero-image-card,
.promise-card,
.stat-card,
.feature-card,
.process-item {
  max-width: 100%;
}

@media (max-width: 575.98px) {
  .about-hero {
    padding: 46px 0 38px;
  }

  .about-hero h1 {
    font-size: 32px;
    line-height: 1.25;
  }

  .hero-text {
    max-width: 100%;
    font-size: 15px;
    line-height: 1.8;
  }

  .hero-actions {
    width: 100%;
  }

  .hero-actions .btn {
    width: 100%;
    max-width: 100%;
    white-space: normal;
  }

  .hero-image-card {
    padding: 10px;
    border-radius: 24px;
  }

  .hero-image {
    min-height: 230px;
    border-radius: 18px;
  }

  .floating-card {
    position: static;
    width: 100%;
    max-width: 100%;
    margin-top: 12px;
    padding: 14px;
    border-radius: 18px;
  }

  .floating-card i {
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .stat-card,
  .feature-card,
  .process-item {
    padding: 22px;
    border-radius: 22px;
  }

  .promise-card {
    width: 100%;
    max-width: 100%;
    padding: 26px 20px;
    border-radius: 22px;
  }

  .promise-card h2 {
    font-size: 24px;
    line-height: 1.4;
  }

  .promise-card .btn {
    width: 100%;
    white-space: normal;
  }
}
@media (max-width: 991px) {
  .about-hero {
    padding: 64px 0 50px;
  }

  .hero-image {
    min-height: 340px;
  }

  .floating-card {
    left: 24px;
    right: 24px;
    bottom: 24px;
    max-width: none;
  }

  .promise-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .promise-card .btn {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .about-hero h1 {
    font-size: 38px;
  }

  .hero-text {
    font-size: 16px;
  }

  .hero-actions .btn {
    width: 100%;
  }

  .hero-image {
    min-height: 280px;
  }

  .floating-card {
    position: static;
    margin-top: 14px;
  }

  .brand-section,
  .service-section {
    padding: 60px 0;
  }

  .process-item {
    flex-direction: column;
  }

  .promise-card {
    padding: 30px 24px;
    border-radius: 24px;
  }
}
</style>
