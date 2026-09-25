const CACHE_NAME = "cadastro-usuarios-v1";
const ARQUIVOS = ["./", "index.html", "style.css", "app.js", "manifest.json", "icon.svg"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS))
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    )
  );
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") {
    return;
  }

  evento.respondWith(
    fetch(evento.request).catch(() => caches.match(evento.request))
  );
});
