<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <router-link to="/" class="admin-brand">
        <span class="admin-brand-icon">
          <i class="bi bi-shop-window"></i>
        </span>

        <span>
          和韓食堂
          <small>Admin</small>
        </span>
      </router-link>

      <nav class="admin-menu">
        <router-link to="/admin/products" class="admin-menu-link">
          <i class="bi bi-box-seam"></i>
          商品管理
        </router-link>

        <router-link to="/admin/coupons" class="admin-menu-link">
          <i class="bi bi-ticket-perforated"></i>
          優惠券管理
        </router-link>

        <router-link to="/admin/orders" class="admin-menu-link">
          <i class="bi bi-receipt-cutoff"></i>
          訂單檢視
        </router-link>
      </nav>

      <button type="button" class="admin-logout-btn" @click="logout">
        <i class="bi bi-box-arrow-left"></i>
        登出後台
      </button>
    </aside>

    <section class="admin-content">
      <header class="admin-topbar">
        <div>
          <span class="admin-kicker">ADMIN CONSOLE</span>
          <h1 class="fw-bold mb-0">後台管理系統</h1>
          <p class="admin-topbar-desc mb-0">
            管理商品、優惠券與顧客訂單資料。
          </p>
        </div>
      </header>

      <main class="admin-main">
        <router-view />
      </main>
    </section>
  </div>
</template>

<script>
import emitter from '@/methods/emitter';

export default {
  name: 'AdminLayout',
  methods: {
    logout() {
      document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      emitter.emit('admin-login-updated');

      this.pushToast('已登出後台', '您已安全登出後台管理系統。', 'success');

      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  background:
    radial-gradient(circle at top left, rgba(178, 58, 46, 0.12), transparent 32%),
    linear-gradient(180deg, var(--brand-bg) 0%, #ffffff 48%, var(--brand-bg-soft) 100%);
}

.admin-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  padding: 26px 20px;
  color: #ffffff;
  background:
    linear-gradient(
      180deg,
      var(--brand-primary) 0%,
      var(--brand-primary-dark) 100%
    );
  box-shadow: 18px 0 40px rgba(120, 54, 28, 0.16);
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;
  text-decoration: none;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 1px;
}

.admin-brand:hover {
  color: #ffffff;
}

.admin-brand small {
  display: block;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.admin-brand-icon {
  width: 46px;
  height: 46px;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  background: #ffffff;
  font-size: 22px;
  box-shadow: 0 12px 26px rgba(80, 40, 20, 0.18);
}

.admin-menu {
  display: grid;
  gap: 10px;
  margin-top: 34px;
}

.admin-menu-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  font-weight: 900;
  transition: 0.2s ease;
}

.admin-menu-link i {
  font-size: 18px;
}

.admin-menu-link:hover,
.admin-menu-link.router-link-active {
  color: var(--brand-primary);
  background: #ffffff;
  box-shadow: 0 12px 26px rgba(80, 40, 20, 0.14);
}

.admin-logout-btn {
  width: calc(100% - 40px);
  position: absolute;
  left: 20px;
  bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 14px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 16px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  font-weight: 900;
  transition: 0.2s ease;
}

.admin-logout-btn:hover {
  background: rgba(255, 255, 255, 0.22);
}

.admin-content {
  min-width: 0;
}

.admin-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin: 24px 28px 0;
  padding: 24px 28px;
  border-radius: 26px;
  background: #ffffff;
  border: 1px solid var(--brand-border);
  box-shadow: 0 16px 42px rgba(120, 54, 28, 0.1);
}

.admin-kicker {
  display: inline-block;
  margin-bottom: 6px;
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.admin-topbar h1 {
  color: var(--brand-text);
}

.admin-topbar-desc {
  margin-top: 8px;
  color: var(--brand-muted);
  font-size: 15px;
  font-weight: 700;
}

.admin-main {
  padding: 0 28px 36px;
}

@media (max-width: 991px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .admin-sidebar {
    position: relative;
    height: auto;
    padding: 18px;
  }

  .admin-menu {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 18px;
  }

  .admin-logout-btn {
    position: static;
    width: 100%;
    margin-top: 14px;
  }

  .admin-topbar {
    flex-direction: column;
    align-items: stretch;
    margin: 18px 16px 0;
  }

  .admin-main {
    padding: 0 16px 28px;
  }
}

@media (max-width: 576px) {
  .admin-menu {
    grid-template-columns: 1fr;
  }
}
</style>