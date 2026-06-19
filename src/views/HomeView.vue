<template>
  <main>
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <span class="badge bg-danger mb-3">今日限定優惠 9 折起</span>
            <h1 class="display-4 fw-bold mb-4">
              在家也能享受<br>
              日式職人料理與韓式人氣美食
            </h1>
            <p class="lead text-muted mb-4">
              精選壽司、拉麵、丼飯、韓式炸雞、泡菜鍋與部隊鍋，
              從一人獨享到多人聚餐，一站式快速訂購。
            </p>

            <div class="d-flex flex-wrap gap-3">
              <router-link to="/products" class="btn btn-danger btn-lg">
                立即點餐
              </router-link>
              <router-link to="/favorites" class="btn btn-outline-dark btn-lg">
                查看我的最愛
              </router-link>
            </div>
          </div>

          <div class="col-lg-6 mt-5 mt-lg-0">
            <div class="hero-card">
              <h4 class="fw-bold mb-3">本週人氣推薦</h4>
              <ul class="list-unstyled mb-0">
                <li>🍣 炙燒鮭魚握壽司套餐</li>
                <li>🍜 九州豚骨拉麵</li>
                <li>🍗 韓式甜辣炸雞</li>
                <li>🍲 起司部隊鍋雙人組</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-5">
      <div class="text-center mb-5">
        <h2 class="fw-bold">為什麼選擇和韓食堂？</h2>
        <p class="text-muted">快速、好吃、選擇多，讓每一餐都像小旅行。</p>
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
  </main>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #fff7ef, #fff);
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-card {
  padding: 36px;
  border-radius: 28px;
  background: #fff;
  box-shadow: 0 20px 50px rgba(80, 40, 20, 0.12);
  border: 1px solid #f1dfd4;
}

.hero-card li {
  padding: 12px 0;
  font-size: 18px;
  border-bottom: 1px solid #f2f2f2;
}

.feature-card {
  height: 100%;
  padding: 30px;
  border-radius: 24px;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 16px;
}
</style>
