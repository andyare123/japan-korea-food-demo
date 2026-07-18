<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <div class="not-found-icon">
        <i class="bi bi-exclamation-triangle"></i>
      </div>

      <span class="not-found-kicker">404 NOT FOUND</span>

      <h1 class="fw-bold mt-3 mb-3">
        找不到這個頁面
      </h1>

      <p class="text-muted mb-4">
        您輸入的網址可能不存在，或頁面已被移除。
      </p>

      <router-link to="/" class="btn btn-brand">
        回到和韓食堂首頁
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 36px 18px;
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.14), transparent 34%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 46%, var(--brand-bg-soft) 100%);
}

.not-found-card {
  max-width: 560px;
  width: 100%;
  padding: 52px 34px;
  border-radius: 32px;
  text-align: center;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 20px 54px rgba(120, 54, 28, 0.12);
}

.not-found-icon {
  width: 78px;
  height: 78px;
  margin: 0 auto 18px;
  border-radius: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  background: var(--brand-primary-light);
  font-size: 38px;
}

.not-found-kicker {
  display: inline-block;
  color: var(--brand-primary);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1.4px;
}
</style>