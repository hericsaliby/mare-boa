/* Maré Boa: recebe os avisos no celular mesmo com o app fechado (Firebase Cloud Messaging). */
importScripts("fb/firebase-app-compat.js");
importScripts("fb/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyCPj7ywVSXpguBTU0mpFUzWX8RkW-eNOgQ",authDomain:"mareboa-2642f.firebaseapp.com",projectId:"mareboa-2642f",storageBucket:"mareboa-2642f.firebasestorage.app",messagingSenderId:"705491594133",appId:"1:705491594133:web:df0ef4a6ea78c7b069e49c"});
const messaging = firebase.messaging();
messaging.onBackgroundMessage(p => {
  const n = p.notification || {}, d = p.data || {};
  self.registration.showNotification(n.title || "Maré Boa", { body: n.body || "", icon: "icon.svg", badge: "icon.svg", data: { link: d.link || "./" }, tag: d.tag || undefined });
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL(e.notification.data && e.notification.data.link || "./", self.registration.scope).href;
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(L => {
    for (const c of L) if (c.url.startsWith(self.registration.scope)) { c.navigate(url); return c.focus(); }
    return clients.openWindow(url);
  }));
});

/* ===== Funcionar sem internet (no mar, sem sinal) =====
   - a página e as bibliotecas ficam guardadas: o app abre mesmo offline (a previsão salva vem do próprio app);
   - a página sempre tenta a versão nova primeiro (até 4 s); sem rede, usa a guardada;
   - pedaços de mapa já vistos ficam guardados (até 400) para o mapa aparecer no mar. */
const CV = "mareboa-app-3", CT = "mareboa-mapa", MAXT = 400;
const APP = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./apple-touch-icon.png",
  "./fb/firebase-app.js", "./fb/firebase-auth.js", "./fb/firebase-firestore.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CV).then(c => Promise.all(APP.map(u => c.add(u).catch(() => {}))))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(K => Promise.all(K.filter(k => k.startsWith("mareboa-app-") && k !== CV).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function comTempo(p, ms) { return new Promise((ok, no) => { const t = setTimeout(() => no(new Error("lento")), ms); p.then(r => { clearTimeout(t); ok(r); }, x => { clearTimeout(t); no(x); }); }); }
async function redePrimeiro(req) {
  const c = await caches.open(CV);
  try { const r = await comTempo(fetch(req), 4000); if (r && r.ok) c.put(req, r.clone()); return r; }
  catch (x) { return (await c.match(req, { ignoreSearch: true })) || (await c.match("./index.html")) || (await c.match("./")) || Response.error(); }
}
async function guardadoPrimeiro(req, nome, limite) {
  const c = await caches.open(nome), m = await c.match(req);
  if (m) return m;
  try {
    const r = await fetch(req);
    if (r && (r.ok || r.type === "opaque")) {
      await c.put(req, r.clone());
      if (limite) { const K = await c.keys(); for (let i = 0; i < K.length - limite; i++) await c.delete(K[i]); }
    }
    return r;
  } catch (x) { return m || Response.error(); }
}
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (u.origin === self.location.origin) {
    if (req.mode === "navigate" || u.pathname.endsWith(".html") || u.pathname.endsWith("/")) return e.respondWith(redePrimeiro(req));
    if (/\.(js|svg|png|webmanifest|css)$/.test(u.pathname) && !u.pathname.endsWith("firebase-messaging-sw.js")) return e.respondWith(guardadoPrimeiro(req, CV));
    return;
  }
  if (u.host === "cdnjs.cloudflare.com" || u.host === "fonts.googleapis.com" || u.host === "fonts.gstatic.com") return e.respondWith(guardadoPrimeiro(req, CV));
  if (u.host === "server.arcgisonline.com" || u.host === "tile.openstreetmap.org") return e.respondWith(guardadoPrimeiro(req, CT, MAXT));
});
