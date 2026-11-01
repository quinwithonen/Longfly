/* Pre-order page (/preorder/). Settings live under "preorder" in site.config.js.

   One fixed offer for everyone: the expected final price (finalPrice, about $400) is shown crossed out next to
   the early price (earlyPrice, $200) for the first few units (units, 10), reserved with a deposit (deposit, $100).
   Pressing the button saves their name and email in PostHog, then sends them to the Stripe Payment Link for the
   deposit (link), where Stripe collects payment, phone and shipping address. Set that link to stop after 10
   payments in Stripe so nobody can pay once the 10 are gone. The buyer list lives in Stripe, never on this site.

   Events (all with "price" = earlyPrice and "deposit"): preorder_price_shown, preorder_start, preorder_paid.
   Meta Pixel (if set): InitiateCheckout on the button, Purchase when Stripe sends them back paid.
   You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  var c = L._config || {};
  var po = c.preorder || {};

  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }

  var early = Number(po.earlyPrice || 200), finalP = Number(po.finalPrice || 400);
  var deposit = Number(po.deposit || 100), units = Number(po.units || 10);
  var link = po.link || "";
  var props = { price: early, deposit: deposit };

  // Price block.
  $("po-now").textContent = money(early);
  $("po-was").textContent = money(finalP);
  $("po-tag").textContent = "First " + units + " units · expected price ~" + money(finalP);
  $("po-eyebrow").textContent = "Pre-order · first " + units + " units " + money(early);
  $("po-deposit").textContent = po.depositText || ("Put down a " + money(deposit) + " deposit now to hold one of the first " + units +
    " at " + money(early) + ". The other " + money(early - deposit) + " is due when it's ready to ship.");
  $("po-go").textContent = "Pay " + money(deposit) + " deposit";
  $("po-ship").textContent = po.availability || "";
  if (!po.availability) $("po-ship").hidden = true;
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
  L.track("preorder_price_shown", props);

  // Back from Stripe after paying (set the Payment Link's after-payment redirect to /preorder/?paid=1).
  if (/[?&]paid=1\b/.test(location.search)) {
    $("po-form").hidden = true; $("po-thanks").hidden = false;
    if (!store("longfly.preorderPaid")) {
      store("longfly.preorderPaid", "1");
      L.track("preorder_paid", props);
      L.pixel("Purchase", { value: deposit, currency: "USD", content_name: "F-14 cockpit pre-order" });
    }
    history.replaceState(null, "", location.pathname);
  }

  $("po-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("po-name").value.trim(), email = $("po-email").value.trim(), err = $("po-error");
    if (!name) { err.textContent = "Please enter your name."; err.hidden = false; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; err.hidden = false; return; }
    err.hidden = true;
    L.identify(email, { name: name, preorder_price: early });
    L.track("preorder_start", { price: early, deposit: deposit, checkout_open: !!link });

    if (!link) { $("po-form").hidden = true; $("po-closed").hidden = false; return; }
    L.pixel("InitiateCheckout", { value: deposit, currency: "USD", content_name: "F-14 cockpit pre-order" });
    // Stripe Payment Links accept a pre-filled email; give the analytics call a moment to send first.
    var url = link + (link.indexOf("?") === -1 ? "?" : "&") + "prefilled_email=" + encodeURIComponent(email);
    $("po-go").disabled = true; $("po-go").textContent = "Opening secure checkout…";
    setTimeout(function () { location.href = url; }, 350);
  });
})();
