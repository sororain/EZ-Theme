window.__VUE_OPTIONS_API__ = true;
window.__VUE_PROD_DEVTOOLS__ = false;
window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './i18n';
import { useToast } from './composables/useToast';
import initPageTitle from './utils/exposeConfig';
import { handleUnauthorizedDomain } from './utils/domainChecker';


if (!handleUnauthorizedDomain()) {
  throw new Error('Unauthorized domain');
}

const hideAppPreloader = () => {
  // 页面加载成功，取消兜底刷新定时器
  if (window.__ez_preloader_timer) {
    window.clearTimeout(window.__ez_preloader_timer);
    window.__ez_preloader_timer = null;
  }

  if (!window.__SHOW_APP_PRELOADER__) {
    return;
  }

  const preloader = document.getElementById('app-preloader');

  document.documentElement.classList.remove('preloader-active');

  if (!preloader) {
    return;
  }

  preloader.classList.add('preloader-exit');
  window.setTimeout(() => {
    preloader.remove();
  }, 320);
};

const showAppPreloaderError = () => {
  // 加载失败，取消兜底刷新定时器
  if (window.__ez_preloader_timer) {
    window.clearTimeout(window.__ez_preloader_timer);
    window.__ez_preloader_timer = null;
  }

  if (!window.__SHOW_APP_PRELOADER__) {
    return;
  }

  const preloader = document.getElementById('app-preloader');

  document.documentElement.classList.remove('preloader-active');

  if (!preloader) {
    return;
  }

  const title = preloader.querySelector('.app-preloader__title');
  const text = preloader.querySelector('.app-preloader__text');

  if (title) {
    title.textContent = 'Load Failed';
  }

  if (text) {
    text.textContent = '页面加载失败，请刷新重试';
  }
};

const initApp = async () => {
  try {
    initPageTitle();

    await import('./assets/styles/index.scss');

    const app = createApp(App);

    const toast = useToast();

    app.provide('$toast', toast);

    app.use(router)
       .use(store)
       .use(i18n);

    app.mount('#app');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hideAppPreloader();
      });
    });

    store.dispatch('initUserInfo');
  } catch (error) {
    showAppPreloaderError();
    console.error('应用初始化失败:', error);
  }
};

initApp();

window.router = router;
