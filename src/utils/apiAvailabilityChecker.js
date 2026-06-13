let _router = null;
let _validating = false;


const getRouterInstance = async () => {
  if (_router) return _router;
  const mod = await import('@/router');
  _router = mod.default || mod.router || mod;
  return _router;
};


const API_CHECK_TIMEOUT = 2000;
const API_CHECK_PATH = '/guest/comm/config';


/**
 * 快速验证单个 API URL 是否可用
 */
async function quickPingUrl(baseUrl) {
  try {
    const url = `${baseUrl}${API_CHECK_PATH}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), API_CHECK_TIMEOUT);
    const response = await fetch(url, { method: 'GET', signal: controller.signal });
    clearTimeout(timer);
    if (!response.ok) return false;
    const data = await response.json();
    return data && (data.data !== undefined || data.message !== undefined);
  } catch {
    return false;
  }
}


/**
 * 并发竞速检测，从 URL 数组中找最快的可用地址
 */
async function findFastestWorkingUrl(urls) {
  const results = await Promise.all(
    urls.map(async (url) => {
      const start = performance.now();
      try {
        const pingUrl = `${url}${API_CHECK_PATH}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), API_CHECK_TIMEOUT);
        const response = await fetch(pingUrl, { method: 'GET', signal: controller.signal });
        clearTimeout(timer);
        if (!response.ok) return { url, available: false, time: Infinity };
        const data = await response.json();
        const ok = data && (data.data !== undefined || data.message !== undefined);
        return { url, available: ok, time: ok ? Math.round(performance.now() - start) : Infinity };
      } catch {
        return { url, available: false, time: Infinity };
      }
    })
  );

  const available = results.filter(r => r.available).sort((a, b) => a.time - b.time);
  return available.length > 0 ? available[0].url : null;
}


/**
 * 判断是否存在多个 API 地址需要连通性检测
 */
function hasMultipleApiUrls() {
  if (typeof window === 'undefined' || !window.EZ_CONFIG) return false;
  
  if (window.EZ_CONFIG.API_MIDDLEWARE_ENABLED === true) return false;
  
  const apiConfig = window.EZ_CONFIG.API_CONFIG;
  if (!apiConfig || apiConfig.urlMode !== 'static') return false;
  
  const staticBaseUrls = apiConfig.staticBaseUrl;
  return Array.isArray(staticBaseUrls) && staticBaseUrls.length > 1;
}


/**
 * 判断是否向用户展示检测过程（验证页跳转 + 加载动画）
 * 仅控制"展示"，不影响功能本身
 */
function shouldShowCheckUI() {
  if (!hasMultipleApiUrls()) return false;
  const apiConfig = window.EZ_CONFIG.API_CONFIG;
  return apiConfig.showCheckBackend !== false;
}


/**
 * 获取当前可用的 API URL
 * 优先返回 sessionStorage 缓存的已验证 URL
 */
function getAvailableApiUrl() {
  const cachedUrl = sessionStorage.getItem('ez_api_available_url');
  if (cachedUrl) return cachedUrl;

  if (window.EZ_CONFIG?.API_CONFIG?.staticBaseUrl) {
    const urls = window.EZ_CONFIG.API_CONFIG.staticBaseUrl;
    return Array.isArray(urls) ? urls[0] : urls;
  }
  return '';
}


/**
 * 新会话首次调用时：验证缓存 URL 的可用性，失效则重新检测
 * 每个标签页只执行一次
 */
async function ensureValidApiUrl() {
  if (_validating || !hasMultipleApiUrls()) return null;
  _validating = true;

  try {
    const cachedUrl = sessionStorage.getItem('ez_api_available_url');

    // 有缓存 → 快速验证是否仍然可用
    if (cachedUrl) {
      const alive = await quickPingUrl(cachedUrl);
      if (alive) {
        console.log('[API检测] 缓存URL可用:', cachedUrl);
        return cachedUrl;
      }
      console.log('[API检测] 缓存URL失效，重新检测...');
      sessionStorage.removeItem('ez_api_available_url');
    }

    // 无缓存或缓存失效 → 并发竞速找最快可用地址
    const urls = window.EZ_CONFIG.API_CONFIG.staticBaseUrl;
    const workingUrl = await findFastestWorkingUrl(urls);

    if (workingUrl) {
      console.log('[API检测] 找到可用URL:', workingUrl);
      sessionStorage.setItem('ez_api_available_url', workingUrl);
      return workingUrl;
    }

    // 全部失败 → 回退到数组第一个
    const fallback = Array.isArray(urls) ? urls[0] : urls;
    console.warn('[API检测] 全部节点不可用，回退到:', fallback);
    sessionStorage.setItem('ez_api_available_url', fallback);
    return fallback;
  } finally {
    _validating = false;
  }
}


async function initApiAvailabilityChecker(redirect = true) {
  return null;
}


export {
  getAvailableApiUrl,
  initApiAvailabilityChecker,
  ensureValidApiUrl,
  hasMultipleApiUrls,
  shouldShowCheckUI
};
