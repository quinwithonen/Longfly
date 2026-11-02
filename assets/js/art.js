/* Artwork section (#art). Settings under "art" in site.config.js: eyebrow, title, lede, folder, and
   images [{ file, alt, caption }]. Remove the "art" block to hide the section and its menu link.
   Tapping a picture opens it full size. You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  function $(id) { return document.getElementById(id); }

  L.renderArt = function (c, h) {
    var section = $("art");
    if (!section) return;
    if (!c || !(c.images || []).length) {
      section.hidden = true;
      var a = document.querySelector('.nav a[href="#art"]'); if (a) a.hidden = true;
      return;
    }
    section.hidden = false;
    // The F-16 page shows the art without its own heading, so these are optional.
    var set = function (id, t) { var n = $(id); if (!n) return; if (t) n.textContent = t; else if (id === "art-lede") n.hidden = true; };
    set("art-eyebrow", c.eyebrow); set("art-title", c.title); set("art-lede", c.lede);
    var base = (c.folder || "").replace(/\/?$/, "/");
    var grid = $("art-grid");
    c.images.forEach(function (im, i) {
      grid.appendChild(h.el("figure", { class: "art-item" + (i === 0 ? " art-main" : "") }, [
        h.el("a", { class: "plate", href: base + im.file, target: "_blank", rel: "noopener" }, [
          h.el("img", { src: base + im.file, alt: im.alt || "", loading: "lazy" })
        ]),
        im.caption ? h.el("figcaption", { class: "fine", text: im.caption }) : null
      ]));
    });
  };
})();
