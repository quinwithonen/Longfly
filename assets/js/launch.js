/* Kickstarter launch pieces: email sign-up, optional $1 reservation, "Back it on Kickstarter" button, press kit.
   Settings live under "launch" and "press" in site.config.js.

   Sign-ups are saved two ways:
     - PostHog: the visitor is identified by their email and a "launch_signup" event is sent.
       See them in PostHog under People (filter: email is set) and export as CSV.
     - A form service, if launch.signupEndpoint is set (e.g. a Formspree form URL). This keeps working for
       visitors whose ad blocker blocks PostHog, so set it before spending money on ads.
   Events: launch_signup { price }, reserve_click { price }, kickstarter_click.
   Meta Pixel (if set): Lead on sign-up, InitiateCheckout on the reservation button.
   You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  var DONE = "longfly.signedUp";

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function testPrice() { var p = parseInt(store("longfly.cockpitPrice"), 10); return isNaN(p) ? null : p; }
  function $(id) { return document.getElementById(id); }

  var launchCfg = {};

  L.renderLaunch = function (c, press, contactEmail) {
    launchCfg = c = c || {};
    var panel = $("signup");
    if (!panel) return;

    // Once the campaign is live, the main button points at it.
    if (c.kickstarterUrl) {
      var ks = $("ks-live");
      ks.href = c.kickstarterUrl; ks.hidden = false;
      ks.addEventListener("click", function () { L.track("kickstarter_click", {}); });
      $("launch-eyebrow").textContent = "Live on Kickstarter";
      $("signup-title").textContent = "Or get updates by email";
    }
    if (c.perk) $("signup-perk").textContent = c.perk; else $("signup-perk").hidden = true;

    var form = $("signup-form"), err = $("s-error"), btn = $("s-go");
    if (store(DONE)) showDone();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("s-email").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; err.hidden = false; return; }
      err.hidden = true;
      btn.disabled = true; btn.textContent = "Saving…";
      var price = testPrice();
      L.identify(email, { signed_up_for: "f14-cockpit", test_price: price });
      L.track("launch_signup", { price: price });
      L.pixel("Lead", { content_name: "F-14 cockpit launch list" });

      var finish = function () { store(DONE, "1"); showDone(); };
      if (!c.signupEndpoint) return finish();
      fetch(c.signupEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email, list: "F-14 cockpit launch", test_price: price, page: location.href })
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        finish();
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Notify me";
        err.textContent = "That didn't go through. Please try again, or email " + (contactEmail || "us") + ".";
        err.hidden = false;
      });
    });

    renderPress(press, contactEmail);
  };

  function showDone() {
    $("signup-form").hidden = true;
    $("signup-done").hidden = false;
    var c = launchCfg;
    if (c.reserveLink && !c.kickstarterUrl) {
      $("reserve").hidden = false;
      $("reserve-text").textContent = c.reserveText || "";
      var go = $("reserve-go");
      go.href = c.reserveLink;
      go.textContent = c.reserveLabel || "Reserve for $1";
      go.addEventListener("click", function () {
        L.track("reserve_click", { price: testPrice() });
        L.pixel("InitiateCheckout", { value: 1, currency: "USD", content_name: "F-14 cockpit $1 reservation" });
      });
    }
  }

  function renderPress(p, contactEmail) {
    var section = $("press");
    if (!section || !p) return;
    section.hidden = false;
    $("press-blurb").textContent = p.blurb || "";
    var base = new URL((p.folder || "").replace(/\/?$/, "/"), document.baseURI).href;
    var list = $("press-files");
    (p.files || []).forEach(function (f) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = base + f.file; a.setAttribute("download", ""); a.className = "press-file";
      if (/\.(jpe?g|png|webp|svg)$/i.test(f.file)) {
        var img = document.createElement("img"); img.src = base + (f.thumb || f.file); img.alt = ""; img.loading = "lazy";
        var plate = document.createElement("span"); plate.className = "plate"; plate.appendChild(img); a.appendChild(plate);
      }
      var t = document.createElement("span"); t.className = "press-label"; t.textContent = f.label; a.appendChild(t);
      if (f.note) { var n = document.createElement("span"); n.className = "fine mono"; n.textContent = f.note; a.appendChild(n); }
      li.appendChild(a); list.appendChild(li);
    });
    if (p.folderLink) { var fl = $("press-folder"); fl.href = p.folderLink; fl.hidden = false; }
    $("press-contact").textContent = "Press and creator enquiries: " + (p.email || contactEmail || "");
  }
})();
