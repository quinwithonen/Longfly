/* Free downloads section (#downloads). Settings under "downloads" in site.config.js.
   Shows a rotatable 3D model, a short description, the STL files and a "Tip me" PayPal button.
   PostHog events: download_file { file }, tip_click.
   You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  function $(id) { return document.getElementById(id); }

  L.renderDownloads = function (c, h) {
    var section = $("downloads");
    if (!section) return;
    if (!c || !(c.files || []).length) {
      section.hidden = true;
      var a = document.querySelector('.nav a[href="#downloads"]'); if (a) a.hidden = true;
      return;
    }
    section.hidden = false;
    var base = (c.folder || "downloads").replace(/\/?$/, "/");
    if (c.title) $("dl-title").textContent = c.title;

    if (c.model) $("dl-media").appendChild(h.viewer({ base: base, model: c.model, modelUp: c.modelUp, modelColor: c.modelColor, modelFit: c.modelFit }));

    var desc = $("dl-desc");
    [].concat(c.description || []).forEach(function (t) { desc.appendChild(h.el("li", { text: t })); });

    function link(a, file) {
      a.setAttribute("download", "");
      a.addEventListener("click", function () { L.track("download_file", { file: file }); });
    }
    if (c.zip) {
      var z = $("dl-zip"); z.href = base + c.zip.file; z.textContent = c.zip.label || "Download all"; z.hidden = false;
      link(z, c.zip.file);
    }
    var list = $("dl-list");
    c.files.forEach(function (f) {
      var name = f.file.split("/").pop();
      var a = h.el("a", { href: base + f.file }, [h.el("span", { text: f.label || name }), h.el("span", { class: "mono", text: name })]);
      link(a, name);
      list.appendChild(h.el("li", {}, [a]));
    });

    if (c.tip && c.tip.link) {
      var t = $("dl-tip-go"); t.href = c.tip.link; t.textContent = c.tip.label || "Tip me";
      $("dl-tip-text").textContent = c.tip.text || "";
      t.addEventListener("click", function () { L.track("tip_click", {}); });
      $("dl-tip").hidden = false;
    }
  };
})();
