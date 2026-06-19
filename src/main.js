/* eslint-disable import/no-duplicates */
import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';

import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
import * as AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue';
import router from './router';
import { currency, date } from './methods/filters';
import $httpMessageState from './methods/pushMessageState';

axios.defaults.withCredentials = true;

const token = document.cookie.replace(
  /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
  '$1',
);

if (token) {
  axios.defaults.headers.common.Authorization = token;
}

const app = createApp(App);

const emitter = {
  events: {},

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  },

  off(eventName, callback) {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName] = this.events[eventName].filter(
      (eventCallback) => eventCallback !== callback,
    );
  },

  emit(eventName, payload) {
    if (!this.events[eventName]) {
      return;
    }

    this.events[eventName].forEach((callback) => {
      callback(payload);
    });
  },
};

app.provide('emitter', emitter);

app.config.globalProperties.$filters = {
  date,
  currency,
};

Object.keys(AllRules).forEach((rule) => {
  if (rule !== 'all') {
    defineRule(rule, AllRules[rule]);
  }
});

defineRule('twMobile', (value) => {
  if (!value) {
    return '電話為必填';
  }

  const phone = String(value).replace(/\s|-/g, '');

  if (!/^09\d{8}$/.test(phone)) {
    return '請輸入 09 開頭的 10 碼手機號碼，例如：0912345678';
  }

  return true;
});

configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});

setLocale('zh_TW');

app.config.globalProperties.$httpMessageState = $httpMessageState;

app.use(VueAxios, axios);
app.use(router);
app.component('Loading', Loading);
app.component('Form', Form);
app.component('Field', Field);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app');