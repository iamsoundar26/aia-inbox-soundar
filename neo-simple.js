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
      h.textContent = "How can I help with your books?";
      var p = h.nextElementSibling;
      if (p) p.textContent = "Pick a task or ask me anything. Nothing posts until you approve it.";
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
  new MutationObserver(apply).observe(document.documentElement, { childList: true, subtree: true });
  apply();
})();
