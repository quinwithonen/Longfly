/* Pre-order page (/preorder/). Settings live under "preorder" in site.config.js.

   Each visitor is shown one pre-order price picked at random from preorder.tiers and keeps it on return
   visits. The regular price shown is double. Pressing Pre-order saves their name and email in PostHog,
   then sends them to that tier's Stripe Payment Link, where Stripe collects payment, phone and shipping
   address. The buyer list (names, addresses) lives in Stripe, never on this site.

   Events (all with "price"): preorder_price_shown, preorder_start, preorder_paid.
   Meta Pixel (if set): InitiateCheckout on Pre-order, Purchase when Stripe sends them back paid.
   You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  var c = L._config || {};
  var po = c.preorder || {};
  var KEY = "longfly.preorderPrice";

  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }

  var tiers = (po.tiers || []).map(function (t) { return { price: Number(t.price), link: t.link || "" }; });
  if (!tiers.length) tiers = [100, 200, 300, 400].map(function (p) { return { price: p, link: "" }; });
  var saved = parseInt(store(KEY), 10);
  var tier = tiers.filter(function (t) { return t.price === saved; })[0] || tiers[Math.floor(Math.random() * tiers.length)];
  store(KEY, String(tier.price));

  // Price block.
  $("po-now").textContent = money(tier.price);
  $("po-was").textContent = money(tier.price * 2);
  $("po-go").textContent = "Pre-order for " + money(tier.price);
  $("po-ship").textContent = po.availability || "Available for purchase by November 5 in the Americas.";
  $("foot-year").textContent = "© " + new Date().getFullYear();

  // Details list.
  var faq = $("po-faq");
  (po.details || []).forEach(function (d) {
    var dt = document.createElement("dt"); dt.textContent = d[0];
    var dd = document.createElement("dd"); dd.textContent = d[1];
    faq.appendChild(dt); faq.appendChild(dd);
  });
  if (!faq.children.length) $("faq").hidden = true;

  // Video and 3D model come from the main page's cockpit settings.
  var ck = c.cockpit || {};
  var base = new URL("../" + (ck.folder || "projects/f14-cockpit").replace(/\/?$/, "/"), document.baseURI).href;
  var video = $("po-video");
  if (ck.video) { video.src = base + ck.video; if (ck.videoPoster) video.poster = base + ck.videoPoster; video.muted = true; }
  else video.closest("figure").hidden = true;
  $("po-credit").textContent = ck.videoCredit || "";

  var box = $("po-viewer");
  if (ck.model) {
    box.querySelector(".viewer-status").textContent = "Loading 3D model…";
    import(new URL("../assets/js/viewer.js", document.baseURI).href)
      .then(function (m) { m.mount(box, base + ck.model, { up: ck.modelUp, color: ck.modelColor || "#9aa1ab", fit: ck.modelFit }); })
      .catch(function () { box.querySelector(".viewer-status").textContent = "3D view isn't supported in this browser."; });
  } else if (ck.image) {
    box.className = "plate"; box.textContent = "";
    var img = document.createElement("img"); img.src = base + ck.image; img.alt = ck.imageAlt || "F-14 cockpit render"; box.appendChild(img);
  }

  // Analytics.
  L.startAnalytics(c.analytics);
  L.startPixel(c.metaPixel);
  L.onRoute("preorder");
  L.track("preorder_price_shown", { price: tier.price });

  // Back from Stripe after paying (set the Payment Link's after-payment redirect to /preorder/?paid=1).
  if (/[?&]paid=1\b/.test(location.search)) {
    $("po-form").hidden = true; $("po-thanks").hidden = false;
    if (!store("longfly.preorderPaid")) {
      store("longfly.preorderPaid", "1");
      L.track("preorder_paid", { price: tier.price });
      L.pixel("Purchase", { value: tier.price, currency: "USD", content_name: "F-14 cockpit pre-order" });
    }
    history.replaceState(null, "", location.pathname);
  }

  $("po-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("po-name").value.trim(), email = $("po-email").value.trim(), err = $("po-error");
    if (!name) { err.textContent = "Please enter your name."; err.hidden = false; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; err.hidden = false; return; }
    err.hidden = true;
    L.identify(email, { name: name, preorder_price: tier.price });
    L.track("preorder_start", { price: tier.price, checkout_open: !!tier.link });

    if (!tier.link) { $("po-form").hidden = true; $("po-closed").hidden = false; return; }
    L.pixel("InitiateCheckout", { value: tier.price, currency: "USD", content_name: "F-14 cockpit pre-order" });
    // Stripe Payment Links accept a pre-filled email; give the analytics call a moment to send first.
    var url = tier.link + (tier.link.indexOf("?") === -1 ? "?" : "&") + "prefilled_email=" + encodeURIComponent(email);
    $("po-go").disabled = true; $("po-go").textContent = "Opening secure checkout…";
    setTimeout(function () { location.href = url; }, 350);
  });
})();
