/* Neo — simplified welcome: short copy, task cards with icon + one-line hint. */
(function () {
  var SUB = {
    "Work the Inbox with me": "Read, check and prepare every new bill",
    "What needs my attention?": "Waiting, blocked and duplicate documents",
    "Find duplicates": "Certain matches, with Delete or Keep",
    "Explain this document": "Why it's flagged and what to do next",
    "Create a sales invoice from a purchase": "Turn a purchase into a sales invoice",
    "Move all Dell India Pvt Ltd bills to Office Expenses": "Re-categorise them in one step"
  };
  var KIND = {
    "Work the Inbox with me": "inbox",
    "What needs my attention?": "attention",
    "Find duplicates": "duplicate",
    "Explain this document": "explain",
    "Create a sales invoice from a purchase": "invoice",
    "Move all Dell India Pvt Ltd bills to Office Expenses": "move"
  };
  function decorate(btn, title) {
    if (btn.dataset.neo) return;
    btn.dataset.neo = KIND[title] || "task";
    var wrap = document.createElement("span");
    wrap.className = "neo-card-text";
    var t = document.createElement("span"); t.className = "neo-card-title"; t.textContent = title;
    wrap.appendChild(t);
    if (SUB[title]) { var s = document.createElement("span"); s.className = "neo-card-sub"; s.textContent = SUB[title]; wrap.appendChild(s); }
    btn.appendChild(wrap);
  }
  function apply() {
    document.querySelectorAll('header button[aria-label="Ask Neo"] > span.sm\\:inline').forEach(function (sp) {
      if (sp.textContent === "Neo") sp.textContent = "Ask Neo";
    });
    var aside = document.querySelector('aside[aria-label="Neo"]');
    if (!aside) return;
    var h = aside.querySelector("p.text-h6");
    if (h && !h.dataset.neo) {
      h.dataset.neo = "1";
      var hr = new Date().getHours();
      h.textContent = (hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening") + ", Soundar.";
      var p = h.nextElementSibling;
      if (p) {
        var m = /(\d+) documents?/.exec(p.textContent);
        p.textContent = (m ? m[1] + " documents are waiting for you. " : "") + "Pick a task below or ask me anything.";
      }
    }
    var live = aside.querySelector("button.rounded-xl.bg-background");
    if (live) { var lt = live.querySelector(".text-label-1"); if (lt) decorate(live, lt.textContent.trim()); }
    aside.querySelectorAll("ul li > button").forEach(function (b) {
      if (b.dataset.neo) return;
      var title = "", raw = [];
      b.childNodes.forEach(function (n) { if (n.nodeType === 3) { title += n.textContent; raw.push(n); } });
      title = title.trim();
      if (!title) return;
      // keep React's text node alive, just tuck it into a hidden span
      var hid = document.createElement("span"); hid.className = "neo-raw";
      raw.forEach(function (n) { hid.appendChild(n); });
      b.appendChild(hid);
      decorate(b, title);
    });
    var ta = aside.querySelector("#neo-composer");
    if (ta && !ta.parentElement.querySelector(".neo-tools")) buildTools(ta);
    if (ta && ta.placeholder === "Tell Neo what to do") ta.placeholder = "Ask Neo anything";
    // header: conversation title + Beta pill
    var header = aside.querySelector(":scope > header");
    if (header) {
      if (!header.querySelector(".neo-beta")) {
        var beta = document.createElement("span"); beta.className = "neo-beta"; beta.textContent = "Beta";
        var nc = header.querySelector('button[aria-label="New chat"]');
        header.insertBefore(beta, nc || header.lastElementChild);
      }
      var h2 = header.querySelector("h2");
      var first = aside.querySelector(".overflow-y-auto p.self-end");
      if (h2) {
        if (first) { var t = first.textContent.trim(); if (h2.textContent !== t) h2.textContent = t; header.setAttribute("data-neo-chat", "1"); }
        else if (header.hasAttribute("data-neo-chat")) { h2.textContent = "Neo"; header.removeAttribute("data-neo-chat"); }
      }
    }
  }
  function setComposer(ta, text) {
    var set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
    set.call(ta, text);
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    ta.focus();
  }
  function fmtSize(b) { return b < 1024 * 1024 ? Math.max(1, Math.round(b / 1024)) + " KB" : (b / 1048576).toFixed(1) + " MB"; }
  function buildTools(ta) {
    var box = ta.parentElement;
    var chips = document.createElement("div"); chips.className = "neo-chips";
    box.insertBefore(chips, box.firstChild);
    var tools = document.createElement("div"); tools.className = "neo-tools";
    var input = document.createElement("input"); input.type = "file"; input.multiple = true; input.accept = ".pdf,.jpg,.jpeg,.png"; input.hidden = true;
    var attach = document.createElement("button"); attach.type = "button"; attach.className = "neo-tool neo-tool-attach"; attach.title = "Attach invoices or bills"; attach.setAttribute("aria-label", "Attach files");
    var paste = document.createElement("button"); paste.type = "button"; paste.className = "neo-tool neo-tool-paste"; paste.title = "Paste from clipboard"; paste.setAttribute("aria-label", "Paste from clipboard");
    tools.appendChild(attach); tools.appendChild(paste); tools.appendChild(input);
    box.insertBefore(tools, ta.nextElementSibling);
    var files = [];
    function render() {
      chips.innerHTML = "";
      files.forEach(function (f, i) {
        var c = document.createElement("span"); c.className = "neo-chip";
        c.innerHTML = '<span class="neo-chip-name"></span><span class="neo-chip-size"></span><button type="button" class="neo-chip-x" aria-label="Remove">×</button>';
        c.querySelector(".neo-chip-name").textContent = f.name;
        c.querySelector(".neo-chip-size").textContent = fmtSize(f.size);
        c.querySelector(".neo-chip-x").onclick = function () { files.splice(i, 1); render(); };
        chips.appendChild(c);
      });
      chips.style.display = files.length ? "flex" : "none";
      if (files.length) setComposer(ta, "Process " + (files.length === 1 ? "this file" : "these " + files.length + " files") + ": " + files.map(function (f) { return f.name; }).join(", "));
    }
    attach.onclick = function () { input.value = ""; input.click(); };
    input.onchange = function () { Array.prototype.forEach.call(input.files, function (f) { files.push(f); }); render(); };
    paste.onclick = function () {
      if (!navigator.clipboard || !navigator.clipboard.readText) { ta.focus(); return; }
      navigator.clipboard.readText().then(function (t) { if (t) setComposer(ta, (ta.value ? ta.value + " " : "") + t.trim()); }).catch(function () { ta.focus(); });
    };
    // after a message is sent the field is cleared by the app; drop the chips too
    ta.addEventListener("input", function () { if (!ta.value && files.length) { files = []; render(); } });
    render();
  }
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
  apply();
})();
