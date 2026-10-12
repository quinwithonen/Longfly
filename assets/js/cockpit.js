/* F-14 cockpit section on the home page: render or 3D model, sample video, and the Kickstarter price test.
   Settings live under "cockpit" in site.config.js.

   Price test: each visitor is shown one price picked at random from cockpit.prices, and keeps it on repeat
   visits (stored in the browser) so the counts per price stay honest. Events sent to PostHog:
     cockpit_price_shown     the section came on screen (once per page view)   { price }
     cockpit_interest        they pressed the Kickstarter button                { price }
     cockpit_price_answer    they answered "is this price fair?"                { price, answer: "yes" | "no" }
   You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  var KEY = "longfly.cockpitPrice";

  function pickPrice(prices) {
    var saved = null;
    try { saved = parseInt(localStorage.getItem(KEY), 10); } catch (e) {}
    if (prices.indexOf(saved) !== -1) return saved;
    var p = prices[Math.floor(Math.random() * prices.length)];
    try { localStorage.setItem(KEY, String(p)); } catch (e) {}
    return p;
  }

  L.renderCockpit = function (c, h) {
    var section = document.getElementById("cockpit");
    if (!section) return;
    if (!c) { section.hidden = true; return; }
    section.hidden = false;
    var el = h.el;
    var base = new URL(c.folder.replace(/\/?$/, "/"), document.baseURI).href;
    var item = { base: base, model: c.model, modelUp: c.modelUp, modelColor: c.modelColor || "#9aa1ab", modelFit: c.modelFit };

    // Big picture: the 3D model once there is one, otherwise the render.
    var media = document.getElementById("cockpit-media");
    if (c.model) media.appendChild(h.viewer(item));
    else if (c.image) media.appendChild(el("div", { class: "plate" }, [el("img", { src: base + c.image, alt: c.imageAlt || "F-14 cockpit render", loading: "lazy" })]));

    var video = document.getElementById("cockpit-video");
    if (c.video) {
      video.src = base + c.video;
      if (c.videoPoster) video.poster = base + c.videoPoster;
      video.muted = true;
    } else video.closest("figure").hidden = true;
    if (c.videoCredit) document.getElementById("cockpit-credit").textContent = " " + c.videoCredit;
    var reddit = document.getElementById("cockpit-reddit");
    if (c.reddit) reddit.href = c.reddit; else document.getElementById("cockpit-reddit-wrap").hidden = true;

    // Price test.
    var prices = (c.prices || [100, 200, 300, 400, 500]).map(Number);
    var price = pickPrice(prices);
    var label = "$" + price;
    var vote = document.getElementById("vote");
    var shown = false;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting && !shown) { shown = true; io.disconnect(); L.track("cockpit_price_shown", { price: price }); }
      }, { threshold: 0.3 });
      io.observe(vote);
    }

    function done(answer) {
      L.track("cockpit_price_answer", { price: price, answer: answer });
      vote.textContent = "";
      vote.appendChild(el("p", { class: "vote-q", text: "Thanks, that really helps." }));
      vote.appendChild(el("p", { class: "fine", text: answer === "yes"
        ? "I'll post here when the Kickstarter goes live."
        : "Good to know. I'll use this to decide what the kit should include and cost." }));
    }

    document.getElementById("vote-go").addEventListener("click", function () {
      L.track("cockpit_interest", { price: price });
      vote.textContent = "";
      vote.appendChild(el("p", { class: "vote-q", text: "Would " + label + " be a fair price for the cockpit kit?" }));
      vote.appendChild(el("div", { class: "vote-row" }, [
        el("button", { type: "button", class: "btn primary", text: "Yes, " + label + " is fair", onclick: function () { done("yes"); } }),
        el("button", { type: "button", class: "btn", text: "No, that's too much", onclick: function () { done("no"); } })
      ]));
    });
  };
})();
