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
    if (c.eyebrow) $("art-eyebrow").textContent = c.eyebrow;
    if (c.title) $("art-title").textContent = c.title;
    if (c.lede) $("art-lede").textContent = c.lede; else $("art-lede").hidden = true;
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
