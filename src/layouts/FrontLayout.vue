<template>
  <div class="front-layout">
    <Navbar />

    <main class="front-main">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'FrontLayout',
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style scoped>
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.front-main {
  flex: 1;
}
</style>