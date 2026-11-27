// 急診就診導覽：離線快取。更新網頁內容後請把版本號加 1。
const V="er-map-v2";
const FILES=["./","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const q=e.request;if(q.method!=="GET"||new URL(q.url).origin!==location.origin)return;
  if(q.mode==="navigate"){ // 網頁本身：有網路就拿最新的，沒網路用快取
    e.respondWith(fetch(q).then(r=>{const c=r.clone();caches.open(V).then(k=>k.put("./",c));return r}).catch(()=>caches.match("./")));
    return;
  }
  e.respondWith(caches.match(q).then(r=>r||fetch(q)));
});
