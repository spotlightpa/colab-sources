import Alpine from "alpinejs";

import searchPeople from "../utils/search-people.js";

// Redirect admin emails to admin
const routes =
  /(access|confirmation|invite|recovery|email_change)_token=([^&]+)/g;

if (window.location.hash.match(routes)) {
  window.location.replace(
    window.location.origin + "/admin/" + window.location.hash,
  );
}

function shuffleChildren(el) {
  let children = Array.from(el.children);
  children.sort(() => 0.5 - Math.random());
  el.replaceChildren(...children);
}

function rotateChildren(el, n) {
  let children = Array.from(el.children);
  el.replaceChildren(...children.slice(n), ...children.slice(0, n));
}

Alpine.data("searchPeople", searchPeople);

Alpine.magic("shuffle", () => (el) => shuffleChildren(el));
Alpine.magic("rotate", () => (el, n) => rotateChildren(el, n));

Alpine.start();
