import disableDevtool from "disable-devtool";

const isProd = process.env.NODE_ENV === "production";
const enableConfigJS = process.env.VUE_APP_CONFIGJS == "true";
const enableAntiDebugging = process.env.VUE_APP_DEBUGGING == "true";

(async () => {
  try {
    if (!isProd || !enableConfigJS) {
      const res = await import('./config/index.js');
      if (typeof window !== 'undefined') {
        window.EZ_CONFIG = res.config || res.default || res;
      }
    }
    
    // 反调试逻辑
    if (isProd && enableAntiDebugging) {
      disableDevtool()
    }
    
    // ⚠️ 确保在 config 加载后再初始化应用
    await import('./appInit.js');
  } catch (error) {
    console.error(error);
    // JS 加载失败，取消预加载器，之后自动刷新重试
    if (window.__ez_preloader_timer) {
      window.clearTimeout(window.__ez_preloader_timer);
      window.__ez_preloader_timer = null;
    }
    // 限制最多重试 2 次，防止无限刷新
    var retryCount = parseInt(sessionStorage.getItem('ez_reload_count') || '0', 10);
    if (retryCount < 2) {
      sessionStorage.setItem('ez_reload_count', String(retryCount + 1));
      try {
        var preloader = document.getElementById('app-preloader');
        if (preloader && !preloader.classList.contains('preloader-exit')) {
          preloader.classList.add('preloader-exit');
          document.documentElement.classList.remove('preloader-active');
          window.setTimeout(function () {
            preloader.remove();
            window.location.reload();
          }, 320);
        } else {
          // 预加载器已被移除或已隐藏，直接刷新
          window.location.reload();
        }
      } catch (_) {
        window.location.reload();
      }
    } else {
      sessionStorage.removeItem('ez_reload_count');
    }
  }
})();

