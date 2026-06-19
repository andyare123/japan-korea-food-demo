<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable vuejs-accessibility/no-autofocus -->

<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signin">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>

        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            id="inputEmail"
            v-model="user.username"
            type="email"
            class="form-control"
            placeholder="Email address"
            required
            autofocus
          />
        </div>

        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            id="inputPassword"
            v-model="user.password"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">
            登入
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// eslint-disable-next-line import/extensions
import emitter from '@/methods/emitter.js';

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

      this.$http.post(api, this.user)
        .then((res) => {
          if (res.data.success) {
            const { token, expired } = res.data;

            document.cookie = `hexToken=${token}; expires=${new Date(expired).toUTCString()}; path=/`;

            this.$http.defaults.headers.common.Authorization = token;

            this.$router.push('/admin/products')
              .then(() => {
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
        .catch((error) => {
          console.error('登入失敗:', error);

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
