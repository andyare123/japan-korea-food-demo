<template>
  <div id="app" class="app-layout">
    <Navbar />

    <main class="app-main">
      <router-view />
    </main>

    <Footer />
    <ToastMessages />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import ToastMessages from '@/components/ToastMessages.vue';

export default {
  components: {
    Navbar,
    Footer,
    ToastMessages,
  },
};
</script>

<style>
:root {
  --brand-primary: #b23a2e;
  --brand-primary-dark: #8f2f25;
  --brand-primary-light: #fff0e7;

  --brand-secondary: #df6b4f;
  --brand-accent: #f4a261;

  --brand-bg: #fff7ef;
  --brand-bg-soft: #fffaf5;
  --brand-border: #f1d8ca;

  --brand-text: #2f2f2f;
  --brand-muted: #6c757d;

  --state-success: #198754;
  --state-danger: #dc3545;
  --state-warning: #b7791f;
}

.btn-brand {
  color: #ffffff;
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  font-weight: 900;
}

.btn-brand:hover,
.btn-brand:focus {
  color: #ffffff;
  background: var(--brand-primary-dark);
  border-color: var(--brand-primary-dark);
}

.btn-outline-brand {
  color: var(--brand-primary);
  background: #ffffff;
  border-color: var(--brand-primary);
  font-weight: 800;
}

.btn-outline-brand:hover,
.btn-outline-brand:focus {
  color: #ffffff;
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.btn-brand:disabled,
.btn-brand.disabled {
  color: #ffffff;
  background: #9f3d34;
  border-color: #9f3d34;
  opacity: 0.75;
}

.btn-outline-brand:disabled,
.btn-outline-brand.disabled {
  color: var(--brand-primary);
  background: #ffffff;
  border-color: var(--brand-primary);
  opacity: 0.6;
}

.page-link {
  color: var(--brand-primary);
}

.page-link:hover {
  color: var(--brand-primary-dark);
}

.page-item.active .page-link {
  color: #ffffff;
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.text-brand {
  color: var(--brand-primary) !important;
}

.bg-brand-soft {
  background: var(--brand-primary-light) !important;
}

.border-brand {
  border-color: var(--brand-border) !important;
}

.category-btn {
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary);
  background: #ffffff;
  font-weight: 800;
}

.category-btn:hover,
.category-btn.active {
  color: #ffffff;
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}
</style>
