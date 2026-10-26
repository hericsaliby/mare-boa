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
