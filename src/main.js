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
    // 兜底：JS 加载失败时隐藏预加载器
    try {
      var preloader = document.getElementById('app-preloader');
      if (preloader && !preloader.classList.contains('preloader-exit')) {
        preloader.classList.add('preloader-exit');
        document.documentElement.classList.remove('preloader-active');
      }
    } catch (_) {}
  }
})();

