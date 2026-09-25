// 離線外殼：先抓網路（拿到最新版），3 秒沒回應或失敗才用快取。報價與 Firebase 資料不經過這裡。
const CACHE = 'dca-shell-v4';
const SHELL = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'hodl-192.png', 'hodl-512.png', 'hodl-apple-180.png'];
const FB = 'https://www.gstatic.com/firebasejs/';   // 版本號固定的 Firebase 程式，快取優先，離線也能啟動
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.href.startsWith(FB)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r.ok || r.type === 'opaque') { const copy = r.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, copy))); }
      return r;
    })));
    return;
  }
  if (u.origin !== location.origin) return;
  const fallback = () => caches.match(e.request).then(r => r || caches.match('index.html'));
  const net = fetch(e.request).then(r => {
    if (!r.ok) return fallback().then(c => c || r);   // 伺服器錯誤時不覆蓋快取，改用上次正常的版本
    const copy = r.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(e.request, copy))); return r;
  });
  const timeout = new Promise(res => setTimeout(() => fallback().then(c => c && res(c)), 3000));
  e.respondWith(Promise.race([net.catch(fallback), timeout]));
});
