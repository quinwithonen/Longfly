/* "Which cockpit would you buy first?" poll. Settings under "poll" in site.config.js.
   One vote per visitor (remembered in the browser). Each vote sends a PostHog event:
     cockpit_poll   { poll: <poll.id>, choice: <option label> | "Other", other: "their text" (only for Other) }
   Options can be plain text or { label, note }. Changing poll.id lets everyone vote again.
   You should not need to edit this file. */
(function () {
  "use strict";
  var L = window.Longfly;
  var KEY = "longfly.pollVote";   // + poll id
  function $(id) { return document.getElementById(id); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  L.renderPoll = function (c) {
    var section = $("poll");
    if (!section || !c || !(c.options || []).length) return;
    section.hidden = false;
    if (c.question) $("poll-q").textContent = c.question;
    var pollId = c.id || "v1";
    if (c.id) KEY = "longfly.pollVote." + c.id;

    var box = $("poll-options");
    var opts = c.options.map(function (o) { return typeof o === "string" ? { label: o } : o; });
    if (c.allowOther) opts.push({ label: "Other" });
    if (opts.some(function (o) { return o.note; })) box.classList.add("has-notes");
    opts.forEach(function (opt, i) {
      var o = opt.label, id = "poll-o" + i;
      var label = document.createElement("label"); label.className = "method poll-opt"; label.htmlFor = id;
      var input = document.createElement("input"); input.type = "radio"; input.name = "choice"; input.value = o; input.id = id;
      input.addEventListener("change", function () {
        var other = o === "Other";
        $("poll-error").hidden = true;
        $("poll-other-wrap").hidden = !other;
        if (other) $("poll-other").focus();
      });
      var text = document.createElement("span"); text.className = "poll-text";
      var name = document.createElement("span"); name.className = "poll-name"; name.textContent = o; text.appendChild(name);
      if (opt.note) { var n = document.createElement("span"); n.className = "poll-note"; n.textContent = opt.note; text.appendChild(n); }
      label.appendChild(input); label.appendChild(text);
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
      var props = { poll: pollId, choice: choice };
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
    $("poll-thanks").textContent = "You voted for: " + choice + ".";
  }
})();
