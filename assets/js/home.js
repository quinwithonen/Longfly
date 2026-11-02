/* Longfly F-16 cockpit page (index.html). Reads site.config.js and runs the page:
   waitlist form, founders deposit button and spots counter, sticky mobile reserve bar, footer links,
   Settings to change live in site.config.js ("preorder", "launch", "analytics"). You should not need to edit this file.

   PostHog events:
     launch_signup  { list: "waitlist", jet }   someone joined the waitlist (they are also identified by email)
     reserve_click  { link: true|false }         "Hold my spot" pressed (link:false = no Stripe link set yet)
     deposit_paid                                 visitor came back from Stripe (?paid=1)
   Meta Pixel (if set): Lead on waitlist, InitiateCheckout on the deposit button. */
(function () {
  "use strict";

  var state = { config: {} };
  var DONE = "longfly.signedUp";

  // ---------- hooks used by the data file and the section scripts ----------
  var L = (window.Longfly = {
    config: function (c) { state.config = c || {}; },
    onRoute: function () {}, startAnalytics: function () {}, track: function () {}, identify: function () {},
    pixel: function () {}, startPixel: function () {},
    start: start
  });

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // ---------- page ----------
  function start() {
    var c = state.config;
    renderWaitlist(c.launch || {}, c.contact && c.contact.email && c.contact.email.value);
    renderFounders(c.preorder || {});
    stickyBar();
    L.startAnalytics(c.analytics);
    L.startPixel(c.metaPixel);
    L.onRoute("home");
  }

  // Form A · waitlist
  function renderWaitlist(c, contactEmail) {
    var form = $("wl-form"), err = $("wl-error"), btn = $("wl-go");
    var done = function () { form.hidden = true; $("wl-done").hidden = false; };
    if (store(DONE)) done();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("wl-email").value.trim();
      var name = $("wl-name").value.trim(), jet = $("wl-jet").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; err.hidden = false; $("wl-email").focus(); return; }
      err.hidden = true;
      btn.disabled = true; btn.textContent = "Saving…";
      var props = { signed_up_for: "f16-cockpit", list: "waitlist" };
      if (name) props.first_name = name;
      if (jet) props.jet = jet;
      L.identify(email, props);
      L.track("launch_signup", { list: "waitlist", jet: jet || null });
      L.pixel("Lead", { content_name: "F-16 cockpit waitlist" });
      var finish = function () { store(DONE, "1"); done(); };
      if (!c.signupEndpoint) return finish();
      fetch(c.signupEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email, first_name: name, jet: jet, list: "F-16 cockpit waitlist", page: location.href })
      }).then(function (r) { if (!r.ok) throw new Error(r.status); finish(); })
        .catch(function () {
          btn.disabled = false; btn.textContent = "Join the waitlist";
          err.textContent = "That didn't go through. Please try again, or email " + (contactEmail || "me") + ".";
          err.hidden = false;
        });
    });
  }

  // Founders card: real claimed count, deposit link, and the thank-you after Stripe.
  function renderFounders(p) {
    var units = p.units || 10;
    var claimed = Math.max(0, Math.min(units, parseInt(p.claimed, 10) || 0));
    $("spots-bar").style.width = (claimed / units * 100) + "%";
    $("spots-text").textContent = claimed >= units
      ? "All " + units + " founder spots claimed"
      : claimed + " of " + units + " founder spots claimed";

    var go = $("reserve-go");
    if (claimed >= units) {
      go.textContent = "Founder spots are gone — join the waitlist";
      go.href = "#waitlist";
    } else if (p.link) {
      go.href = p.link; go.target = "_blank"; go.rel = "noopener";
    }
    go.addEventListener("click", function (e) {
      if (claimed >= units) return;
      L.track("reserve_click", { link: !!p.link });
      if (p.link) {
        L.pixel("InitiateCheckout", { value: p.deposit || 100, currency: "USD", content_name: "F-16 cockpit founders deposit" });
        return;
      }
      // No Stripe link yet: point people at the waitlist instead.
      e.preventDefault();
      $("reserve-soon").hidden = false;
      $("waitlist").scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(function () { $("wl-email").focus({ preventScroll: true }); }, 500);
    });

    if (/[?&]paid=1\b/.test(location.search)) {
      $("paid").hidden = false;
      L.track("deposit_paid", {});
      L.pixel("Purchase", { value: p.deposit || 100, currency: "USD" });
      setTimeout(function () { $("reserve").scrollIntoView(); }, 50);
    }
  }

  // Phones: a reserve bar slides up once the hero has scrolled away, and hides again over the offer.
  function stickyBar() {
    var bar = $("sticky");
    if (!("IntersectionObserver" in window)) return;
    var heroOn = true, offerOn = false;
    var link = bar.querySelector("a");
    var set = function () {
      var on = !heroOn && !offerOn;
      bar.classList.toggle("on", on);
      bar.setAttribute("aria-hidden", on ? "false" : "true");
      link.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroOn = e[0].isIntersecting; set(); }).observe($("hero"));
    new IntersectionObserver(function (e) { offerOn = e[0].isIntersecting; set(); }, { threshold: 0.15 }).observe($("reserve"));
  }

})();
