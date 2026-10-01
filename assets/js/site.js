/* Longfly site script. Reads site.config.js, products/catalog.js, each product.js and work/work.js, then draws the page.
   You should not need to edit this file to change content. */
(function () {
  "use strict";

  var state = { config: {}, slugs: [], products: {}, work: [] };
  var CURRENCY = { USD: "$", CAD: "CA$", EUR: "€", GBP: "£", AUD: "A$" };

  // ---------- data hooks called by the data files ----------
  var Longfly = (window.Longfly = {
    config: function (c) { state.config = c || {}; },
    onRoute: function () {},
    startAnalytics: function () {},
    catalog: function (list) { state.slugs = (list || []).slice(); },
    work: function (list) { state.work = (list || []).slice(); },
    addProduct: function (p) {
      var script = document.currentScript;
      var base = script && script.src ? new URL(".", script.src).href : "";
      var slug = script && script.dataset.slug;
      p.slug = slug || p.slug;
      p.base = base;
      state.products[p.slug] = p;
    },
    start: start
  });

  // ---------- helpers ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "text") n.textContent = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function slug(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function src(p, path) { return path ? p.base + path : ""; }
  function price(p) {
    if (p.price == null) return "Price TBA";
    return (CURRENCY[p.currency] || (p.currency + " ")) + Number(p.price).toFixed(p.price % 1 ? 2 : 0);
  }
  function forSale(p) { return p.preorder || p.status === "in-stock"; }
  function buyLabel(p) { return p.buyLabel || (p.status === "in-stock" ? "Buy" : "Preorder"); }
  function list() { return state.slugs.map(function (s) { return state.products[s]; }).filter(Boolean); }
  function statusPill(p) {
    return el("span", { class: "pill pill-" + (p.status || "prototype"), text: p.statusLabel || p.status });
  }
  function placeholderTag(on) { return on ? el("span", { class: "ph", text: "Placeholder" }) : null; }
  function copyButton(text, label) {
    var b = el("button", { type: "button", class: "btn small", text: label || "Copy" });
    b.addEventListener("click", function () {
      var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = label || "Copy"; }, 1600); };
      var fallback = function () {
        var t = el("textarea", { class: "sr" }); t.value = text; document.body.appendChild(t); t.select();
        try { document.execCommand("copy"); done(); } catch (e) { b.textContent = "Select and copy"; }
        t.remove();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    });
    return b;
  }

  // ---------- loading ----------
  function loadProducts(done) {
    var pending = state.slugs.length;
    if (!pending) return done();
    state.slugs.forEach(function (slug) {
      var s = document.createElement("script");
      s.src = "products/" + slug + "/product.js";
      s.async = false;
      s.dataset.slug = slug;
      s.onload = s.onerror = function () { if (--pending === 0) done(); };
      document.body.appendChild(s);
    });
  }

  function start() { loadProducts(render); }

  // ---------- rendering ----------
  function render() {
    var c = state.config;
    document.title = c.name || "Longfly";
    $("#foot-name").textContent = (c.name || "Longfly") + (c.tagline ? " · " + c.tagline : "");
    $("#foot-year").textContent = "© " + new Date().getFullYear();
    renderHero();
    renderGrid();
    renderWork();
    renderAbout();
    renderMethods();
    renderOrder();
    renderPay();
    renderContact();
    Longfly.startAnalytics(c.analytics);
    route();
    window.addEventListener("hashchange", route);
    setupLightbox();
  }

  function renderHero() {
    var p = state.products[state.config.featured] || list()[0];
    var hero = $("#hero");
    if (!p) { hero.hidden = true; return; }
    var media = p.video
      ? el("video", { src: src(p, p.video), poster: src(p, p.videoPoster || p.heroImage), autoplay: "", muted: "", loop: "", playsinline: "", "aria-label": p.name + " motion test" })
      : el("img", { src: src(p, p.heroImage), alt: p.name });
    if (media.tagName === "VIDEO") media.muted = true;
    hero.append(
      el("div", { class: "hero-copy" }, [
        el("p", { class: "eyebrow" }, ["First product · " + (p.revision || "")]),
        el("h1", { text: p.headline || p.name }),
        el("p", { class: "lede", text: p.summary }),
        el("div", { class: "actions" }, [
          el("a", { class: "btn primary", href: "#" + p.slug, text: "See the " + p.name.replace(/^FPV /, "").toLowerCase() }),
          forSale(p) ? el("a", { class: "btn", href: "#order", "data-product": p.slug, text: buyLabel(p) }) : null
        ])
      ]),
      el("figure", { class: "hero-media" }, [
        el("div", { class: "plate" }, [media]),
        p.readout ? el("dl", { class: "readout" }, p.readout.map(function (r) {
          return el("div", null, [el("dt", { text: r.label }), el("dd", { text: r.value })]);
        })) : null
      ])
    );
  }

  function renderGrid() {
    var grid = $("#product-grid");
    grid.textContent = "";
    list().forEach(function (p) {
      grid.appendChild(el("a", { class: "card", href: "#" + p.slug }, [
        el("div", { class: "plate" }, [el("img", { src: src(p, p.cardImage || p.heroImage), alt: p.name, loading: "lazy" })]),
        el("div", { class: "card-body" }, [
          el("div", { class: "card-meta" }, [statusPill(p), el("span", { class: "mono", text: p.revision || "" })]),
          el("h3", { text: p.name }),
          el("p", { text: p.subtitle }),
          el("p", { class: "price mono", text: price(p) })
        ])
      ]));
    });
  }

  function renderWork() {
    var ol = $("#work-log");
    ol.textContent = "";
    state.work.forEach(function (w) {
      var link = w.product && state.products[w.product] ? el("a", { href: "#" + w.product, text: "View " + state.products[w.product].name }) : null;
      ol.appendChild(el("li", null, [
        el("time", { class: "mono", datetime: w.date, text: w.date }),
        el("div", { class: "log-text" }, [el("h3", { text: w.title }), el("p", { text: w.text }), link]),
        w.image ? el("button", { type: "button", class: "log-img plate", "data-zoom": w.image, "data-caption": w.title, "aria-label": "Enlarge image: " + w.title }, [el("img", { src: w.image, alt: "", loading: "lazy" })]) : null
      ]));
    });
    if (!state.work.length) $("#work").hidden = true;
  }

  function renderAbout() {
    var body = $("#about-body");
    body.textContent = "";
    (state.config.about || []).forEach(function (t) { body.appendChild(el("p", { text: t })); });
  }

  function renderProduct(p) {
    var a = $("#product");
    a.textContent = "";
    var gallery = p.gallery || [];
    var main = el("img", { src: src(p, (gallery[0] || {}).src || p.heroImage), alt: (gallery[0] || {}).caption || p.name });
    var cap = el("figcaption", { text: (gallery[0] || {}).caption || "" });
    var thumbs = el("div", { class: "thumbs", role: "list" }, gallery.map(function (g, i) {
      return el("button", { type: "button", class: "thumb plate" + (i === 0 ? " on" : ""), role: "listitem", "aria-label": g.caption, onclick: function (e) {
        main.src = src(p, g.src); main.alt = g.caption; cap.textContent = g.caption;
        a.querySelectorAll(".thumb").forEach(function (t) { t.classList.remove("on"); });
        e.currentTarget.classList.add("on");
      } }, [el("img", { src: src(p, g.src), alt: "", loading: "lazy" })]);
    }));

    a.append(
      el("a", { class: "back", href: "#products", text: "← All products" }),
      el("header", { class: "p-head" }, [
        el("div", { class: "card-meta" }, [statusPill(p), el("span", { class: "mono", text: p.revision || "" })]),
        el("h1", { text: p.name }),
        el("p", { class: "lede", text: p.subtitle })
      ]),
      el("div", { class: "p-top", "data-section": "overview" }, [
        el("div", { class: "p-gallery" }, [
          el("figure", { class: "p-main" }, [el("button", { type: "button", class: "plate zoom", "aria-label": "Enlarge image", onclick: function () { openLightbox(main.src, cap.textContent); } }, [main]), cap]),
          thumbs
        ]),
        el("aside", { class: "p-buy panel" }, [
          el("p", { class: "price big mono", text: price(p) }),
          el("p", { text: p.summary }),
          forSale(p) ? el("a", { class: "btn primary", href: "#order", "data-product": p.slug, text: buyLabel(p) }) : null,
          p.includes ? el("div", { class: "includes" }, [el("p", { class: "eyebrow", text: "What you get" }), el("ul", null, p.includes.map(function (t) { return el("li", { text: t }); }))]) : null,
          p.notes ? el("p", { class: "fine", text: p.notes }) : null
        ])
      ])
    );

    if (p.video) {
      var v = el("video", { src: src(p, p.video), poster: src(p, p.videoPoster), controls: "", muted: "", loop: "", playsinline: "", preload: "metadata" });
      v.muted = true;
      a.appendChild(el("section", { class: "p-sec", "data-section": "video" }, [el("h2", { text: "In motion" }), el("div", { class: "plate video" }, [v])]));
    }

    (p.sections || []).forEach(function (s) {
      a.appendChild(el("section", { class: "p-sec prose", "data-section": slug(s.heading) }, [el("h2", { text: s.heading })]
        .concat((s.paragraphs || []).map(function (t) { return el("p", { text: t }); }))
        .concat(s.bullets ? [el("ul", null, s.bullets.map(function (t) { return el("li", { text: t }); }))] : [])));
    });

    if (p.specs) {
      a.appendChild(el("section", { class: "p-sec", "data-section": "specs" }, [
        el("h2", { text: "Specifications" }),
        el("div", { class: "table-wrap" }, [el("table", { class: "specs" }, [el("tbody", null, p.specs.map(function (r) {
          return el("tr", null, [el("th", { scope: "row", text: r[0] }), el("td", { text: r[1] })]);
        }))])])
      ]));
    }

    if (p.changes) {
      a.appendChild(el("section", { class: "p-sec prose", "data-section": "revision-notes" }, [
        el("h2", { text: "What's new in " + (p.revision || "this revision") }),
        el("ul", null, p.changes.map(function (t) { return el("li", { text: t }); }))
      ]));
    }
  }

  // ---------- routing ----------
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    var p = state.products[h];
    $("#home").hidden = !!p;
    $("#product").hidden = !p;
    if (p) {
      renderProduct(p);
      document.title = p.name + " · " + (state.config.name || "Longfly");
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      document.title = state.config.name || "Longfly";
      var target = h && document.getElementById(h);
      if (target) target.scrollIntoView();
    }
    Longfly.onRoute(p ? p.slug : "home");
  }

  // Preselect a product when a "Preorder" link is clicked.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-product]");
    if (a) { var sel = $("#o-product"); if (sel) sel.value = a.getAttribute("data-product"); }
    var z = e.target.closest && e.target.closest("[data-zoom]");
    if (z) openLightbox(z.getAttribute("data-zoom"), z.getAttribute("data-caption"));
  });

  // ---------- order ----------
  function renderOrder() {
    var sel = $("#o-product");
    sel.textContent = "";
    list().filter(forSale).forEach(function (p) {
      sel.appendChild(el("option", { value: p.slug, text: p.name + " " + (p.revision || "") + " · " + price(p) }));
    });
    if (!sel.options.length) { $("#order-form").hidden = true; return; }

    $("#order-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.currentTarget, err = $("#o-error");
      var missing = ["o-name", "o-email"].filter(function (id) { return !$("#" + id).value.trim(); });
      if (missing.length) { err.textContent = "Fill in your name and email so your download link can reach you."; err.hidden = false; $("#" + missing[0]).focus(); return; }
      if (!$("#o-email").checkValidity()) { err.textContent = "That email address doesn't look complete. Check it and try again."; err.hidden = false; $("#o-email").focus(); return; }
      err.hidden = true;

      var p = state.products[sel.value];
      var qty = 1;
      var ref = "LF-" + Date.now().toString(36).slice(-5).toUpperCase();
      var total = p.price == null ? "TBA" : price({ price: p.price * qty, currency: p.currency });
      var summary = [
        "Longfly order " + ref,
        "Product: " + p.name + " " + (p.revision || ""),
        "Total: " + total,
        "Payment: " + (chosenMethod() ? chosenMethod().label : "not chosen"),
        "Name: " + $("#o-name").value.trim(),
        "Email: " + $("#o-email").value.trim(),
        $("#o-note").value.trim() ? "Note: " + $("#o-note").value.trim() : ""
      ].filter(Boolean).join("\n");

      var email = (state.config.contact && state.config.contact.email) || {};
      var isCard = !!chosenMethod() && chosenMethod().id === "card";
      var r = $("#receipt");
      r.textContent = "";
      r.append(
        el("p", { class: "eyebrow", text: "Order reference" }),
        el("p", { class: "ref mono", text: ref }),
        el("pre", { class: "summary mono", text: summary }),
        el("p", { text: p.price == null
          ? "Price isn't set yet, so there's nothing to pay today. Send this summary so your spot is held, and you'll get the final price before paying."
          : chosenMethod() && chosenMethod().id === "card"
            ? "Pay " + total + " by card and Stripe takes you straight to your download page. Use the same email at checkout for your receipt."
            : "Pay " + total + " with " + (chosenMethod() ? chosenMethod().label : "any method shown") + " and put " + ref + " in the payment note. Your download link is emailed to " + $("#o-email").value.trim() + " once the payment comes through." }),
        chosenMethod() ? payNow(chosenMethod()) : null,
        isCard ? null : el("div", { class: "actions" }, [copyButton(summary, "Copy order summary")]),
        !isCard && email.value ? el("p", { class: "fine" }, ["Email it to ", el("span", { class: "mono sel", text: email.value }), " so your order can be matched to your payment. ", placeholderTag(email.placeholder)]) : null
      );
      r.hidden = false;
      f.hidden = true;

      if (state.config.preorderEndpoint) {
        fetch(state.config.preorderEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ref: ref, product: p.slug, qty: qty, total: total, method: chosenMethod() ? chosenMethod().id : "", name: $("#o-name").value, email: $("#o-email").value, note: $("#o-note").value })
        }).then(function (res) {
          r.insertBefore(el("p", { class: res.ok ? "ok" : "form-error", text: res.ok ? "Order received. Your download link will follow by email." : "The order didn't go through automatically. Copy the summary and email it instead." }), r.children[2]);
        }, function () {
          r.insertBefore(el("p", { class: "form-error", text: "The order didn't go through automatically. Copy the summary and email it instead." }), r.children[2]);
        });
      }
    });
  }

  function linkButton(m, cls) {
    return m.link ? el("a", { class: cls, href: m.link, target: "_blank", rel: "noopener", text: m.linkLabel || ("Open " + m.label) }) : null;
  }
  // Small label such as "Test mode" set by "tag" in site.config.js.
  function tagFor(m) { return m.tag ? el("span", { class: "ph", text: m.tag }) : null; }

  function payNow(m) {
    return el("div", { class: "pay-now" }, [
      m.qr ? el("img", { class: "qr", src: m.qr, alt: m.label + " QR code" }) : null,
      el("div", { class: "pay-now-text" }, [
        el("p", { class: "eyebrow", text: "Pay with " + m.label }),
        el("p", { class: "handle " + (m.copy === false ? "" : "mono sel"), text: m.value }),
        el("div", { class: "actions" }, [linkButton(m, "btn primary small"), m.copy === false ? null : copyButton(m.value)]),
        placeholderTag(m.placeholder), tagFor(m)
      ])
    ]);
  }

  function renderPay() {
    var box = $("#pay");
    box.textContent = "";
    (state.config.payments || []).forEach(function (m) {
      box.appendChild(el("div", { class: "pay-card panel" + (m.placeholder ? " is-ph" : ""), "data-method": m.id }, [
        el("div", { class: "pay-head" }, [el("h3", { text: m.label }), placeholderTag(m.placeholder) || tagFor(m)]),
        m.qr ? el("img", { class: "qr", src: m.qr, alt: m.label + " QR code" }) : null,
        el("p", { class: "handle " + (m.copy === false ? "" : "mono sel"), text: m.value }),
        el("div", { class: "actions" }, [linkButton(m, "btn small"), m.copy === false ? null : copyButton(m.value)]),
        m.note ? el("p", { class: "fine", text: m.note }) : null
      ]));
    });
    highlightMethod();
  }

  // Payment method picker on the order form.
  function renderMethods() {
    var box = $("#o-methods");
    box.textContent = "";
    (state.config.payments || []).forEach(function (m, i) {
      var id = "o-pay-" + m.id;
      box.appendChild(el("label", { class: "method", for: id }, [
        el("input", { type: "radio", name: "method", id: id, value: m.id, checked: i === 0 ? "" : null, onchange: highlightMethod }),
        el("span", { text: m.label })
      ]));
    });
  }
  function chosenMethod() {
    var r = document.querySelector('input[name="method"]:checked');
    return (state.config.payments || []).filter(function (m) { return r && m.id === r.value; })[0];
  }
  function highlightMethod() {
    var m = chosenMethod();
    document.querySelectorAll(".pay-card").forEach(function (c) { c.classList.toggle("chosen", !!m && c.getAttribute("data-method") === m.id); });
  }

  function renderContact() {
    var c = state.config.contact || {}, body = $("#contact-body");
    body.textContent = "";
    var rows = [["Email", c.email], ["Instagram", c.instagram], ["YouTube", c.youtube]].filter(function (r) { return r[1] && r[1].value; });
    body.appendChild(el("dl", { class: "contact-list" }, rows.map(function (r) {
      var v = r[1].value;
      var isUrl = /^https?:\/\//.test(v);
      return el("div", null, [
        el("dt", { text: r[0] }),
        el("dd", null, [isUrl ? el("a", { href: v, target: "_blank", rel: "noopener", text: v.replace(/^https?:\/\/(www\.)?/, "") }) : el("span", { class: "mono sel", text: v }), " ", r[0] === "Email" ? copyButton(v) : null, " ", placeholderTag(r[1].placeholder)])
      ]);
    })));
  }

  // ---------- lightbox ----------
  function openLightbox(url, caption) {
    var lb = $("#lightbox");
    $("img", lb).src = url;
    $("img", lb).alt = caption || "";
    $("figcaption", lb).textContent = caption || "";
    lb.hidden = false;
    $(".lb-close", lb).focus();
  }
  function setupLightbox() {
    var lb = $("#lightbox");
    var close = function () { lb.hidden = true; };
    $(".lb-close", lb).addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
})();
