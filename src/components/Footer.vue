<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-brand">
          <h3 class="fw-bold mb-3">和韓食堂</h3>
          <p class="mb-0">
            嚴選日式職人料理與韓式人氣美食，讓你不用出門，
            也能快速享受美味餐點。
          </p>
        </div>

        <div class="footer-links">
          <h6 class="fw-bold mb-3">快速連結</h6>
          <router-link to="/products">日韓料理</router-link>
          <router-link to="/favorites">我的最愛</router-link>
          <router-link to="/user/cart">購物車</router-link>
          <router-link to="/admin/orders">訂單查詢</router-link>
        </div>

        <div class="footer-info">
          <h6 class="fw-bold mb-3">服務資訊</h6>
          <p class="mb-2">
            <i class="bi bi-clock me-2"></i>
            營業時間：11:00 - 21:00
          </p>
          <p class="mb-2">
            <i class="bi bi-telephone me-2"></i>
            客服專線：07-123-4567
          </p>
          <p class="mb-0">
            <i class="bi bi-geo-alt me-2"></i>
            高雄市美味區和韓路 88 號
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© 2026 和韓食堂. All Rights Reserved.</span>

        <div class="footer-social">
          <a href="#" aria-label="Facebook">
            <i class="bi bi-facebook"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="#" aria-label="Line">
            <i class="bi bi-chat-dots"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: 0;
  padding: 64px 0 24px;
  color: #fff;
  background:
    linear-gradient(135deg, rgba(178, 58, 46, 0.96), rgba(45, 32, 26, 0.98)),
    #2d201a;
}

.footer-main {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr 1.2fr;
  gap: 42px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}

.footer-brand h3 {
  letter-spacing: 2px;
}

.footer-brand p,
.footer-info p {
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.8;
}

.footer-links {
  display: flex;
  flex-direction: column;
}

.footer-links a {
  display: inline-block;
  width: fit-content;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  font-weight: 700;
  transition: 0.2s ease;
}

.footer-links a:hover {
  color: #fff;
  transform: translateX(4px);
}

.footer-info i {
  color: #ffd5c2;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

.footer-social {
  display: flex;
  gap: 12px;
}

.footer-social a {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.14);
  transition: 0.2s ease;
}

.footer-social a:hover {
  background: #fff;
  color: #b23a2e;
  transform: translateY(-3px);
}

@media (max-width: 991px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>