/* Longfly visitor analytics.
   Sends three kinds of events to PostHog (set up in site.config.js under "analytics"):
     $pageview         one per page view (home or a product page)
     section_reached   the first time a visitor gets a section on screen during a page view
     section_time      seconds a section spent on screen, sent when the visitor leaves the page or tab
   Does nothing until an analytics key is filled in. You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  var cfg = {}, ready = false, page = null, latest = null, observer = null;
  var sections = [];         // { el, name }
  var seen = {}, onScreen = {}, since = {}, total = {};

  function now() { return performance.now(); }
  function enabled() { return ready || cfg.debug; }

  function send(event, props) {
    props = props || {};
    props.page = page;
    if (cfg.debug) console.log("[analytics]", event, props);
    if (ready && window.posthog) window.posthog.capture(event, props, { transport: "sendBeacon" });
  }

  // ---------- section timing ----------
  function start(name) { if (since[name] == null && !document.hidden) since[name] = now(); }
  function stop(name) {
    if (since[name] == null) return;
    total[name] = (total[name] || 0) + (now() - since[name]);
    since[name] = null;
  }
  function flush() {
    Object.keys(since).forEach(stop);
    Object.keys(total).forEach(function (name) {
      var s = total[name] / 1000;
      if (s >= 1) send("section_time", { section: name, seconds: Math.round(s * 10) / 10 });
      total[name] = 0;
    });
  }

  function onIntersect(entries) {
    var vh = window.innerHeight || 1;
    entries.forEach(function (e) {
      var item = sections.filter(function (s) { return s.el === e.target; })[0];
      if (!item) return;
      // "On screen" = at least half the section is visible, or it fills at least half the screen (tall sections).
      var visible = e.isIntersecting && (e.intersectionRatio >= 0.5 || e.intersectionRect.height >= vh * 0.5);
      if (visible && !onScreen[item.name]) {
        onScreen[item.name] = true;
        // Count it as reached only after half a second on screen, so fast scrolls and jump links don't count.
        if (!seen[item.name]) setTimeout(function () {
          if (onScreen[item.name] && !seen[item.name] && !document.hidden) { seen[item.name] = true; send("section_reached", { section: item.name, order: item.order }); }
        }, 500);
        start(item.name);
      } else if (!visible && onScreen[item.name]) {
        onScreen[item.name] = false;
        stop(item.name);
      }
    });
  }

  function slug(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  function watch() {
    if (observer) observer.disconnect();
    sections = [];
    var els = document.querySelectorAll("[data-section]");
    var n = 0;
    els.forEach(function (el) {
      if (el.closest("[hidden]")) return;
      sections.push({ el: el, name: el.getAttribute("data-section") || slug(el.id), order: ++n });
    });
    if (!("IntersectionObserver" in window)) return;
    var thresholds = []; for (var i = 0; i <= 20; i++) thresholds.push(i / 20);
    observer = new IntersectionObserver(onIntersect, { threshold: thresholds });
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  // Called by site.js every time the view changes (home <-> product page).
  L.onRoute = function (name) {
    latest = name;
    if (!enabled()) return;
    if (page === name) return;
    if (page !== null) flush();
    page = name;
    seen = {}; onScreen = {}; since = {}; total = {};
    send("$pageview", { $current_url: location.href, $title: document.title });
    // Wait a frame so the newly drawn view is laid out before measuring.
    requestAnimationFrame(watch);
  };

  document.addEventListener("visibilitychange", function () {
    if (!enabled()) return;
    if (document.hidden) flush();
    else Object.keys(onScreen).forEach(function (n) { if (onScreen[n]) start(n); });
  });
  window.addEventListener("pagehide", function () { if (enabled()) flush(); });

  // ---------- load PostHog ----------
  L.startAnalytics = function (c) {
    cfg = c || {};
    if (!cfg.key) return;
    var host = (cfg.host || "https://us.i.posthog.com").replace(/\/$/, "");
    var s = document.createElement("script");
    s.async = true;
    s.src = host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js";
    s.onload = function () {
      if (!window.posthog || !window.posthog.init) return;
      window.posthog.init(cfg.key, {
        api_host: host,
        persistence: cfg.cookieless ? "memory" : "localStorage",
        person_profiles: "identified_only",
        capture_pageview: false,   // sent by onRoute so product pages count as their own pages
        capture_pageleave: false,
        autocapture: true          // also records button and link clicks (Preorder, Copy, etc.)
      });
      ready = true;
      page = null;
      if (latest) L.onRoute(latest);
    };
    document.head.appendChild(s);
  };
})();
