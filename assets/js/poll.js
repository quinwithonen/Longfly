/* "Which cockpit would you buy first?" poll. Settings under "poll" in site.config.js.
   One vote per visitor (remembered in the browser). Each vote sends a PostHog event:
     cockpit_poll   { choice: "F-14 Tomcat" | ... | "Other", other: "their text" (only for Other) }
   You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  var KEY = "longfly.pollVote";
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  L.renderPoll = function (c) {
    var section = $("poll");
    if (!section || !c || !(c.options || []).length) return;
    section.hidden = false;
    if (c.question) $("poll-q").textContent = c.question;

    var box = $("poll-options");
    var opts = c.options.slice();
    if (c.allowOther) opts.push("Other");
    opts.forEach(function (o, i) {
      var id = "poll-o" + i;
      var label = document.createElement("label"); label.className = "method poll-opt"; label.htmlFor = id;
      var input = document.createElement("input"); input.type = "radio"; input.name = "choice"; input.value = o; input.id = id;
      input.addEventListener("change", function () {
        var other = o === "Other";
        $("poll-error").hidden = true;
        $("poll-other-wrap").hidden = !other;
        if (other) $("poll-other").focus();
      });
      label.appendChild(input); label.appendChild(document.createTextNode(" " + o));
      box.appendChild(label);
    });

    var prior = store(KEY);
    if (prior) return showDone(prior);

    $("poll-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var picked = box.querySelector("input:checked"), err = $("poll-error");
      if (!picked) { err.textContent = "Pick one first."; err.hidden = false; return; }
      var choice = picked.value, other = choice === "Other" ? $("poll-other").value.trim() : "";
      if (choice === "Other" && !other) { err.textContent = "Type which cockpit you'd want."; err.hidden = false; return; }
      err.hidden = true;
      var props = { choice: choice };
      if (other) props.other = other;
      L.track("cockpit_poll", props);
      var shown = other || choice;
      store(KEY, shown);
      showDone(shown);
    });
  };

  function showDone(choice) {
    $("poll-form").hidden = true;
    $("poll-done").hidden = false;
    $("poll-thanks").textContent = "You voted for the " + choice + ".";
  }
})();
