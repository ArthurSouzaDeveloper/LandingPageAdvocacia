(function () {
  "use strict";
  var SITE = window.SITE || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Links de contato a partir da configuração ------------------------ */
  var waUrl = "https://wa.me/" + SITE.whatsappNumber + "?text=" + encodeURIComponent(SITE.whatsappMessage);
  $$("[data-wa]").forEach(function (a) { a.href = waUrl; });
  $$("[data-mail]").forEach(function (a) { a.href = "mailto:" + SITE.email; });

  /* ---- Menu móvel -------------------------------------------------------- */
  var toggle = $(".menu-toggle"), nav = $("#nav-list");
  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    nav.classList.toggle("is-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
    $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function () { setMenu(false); });
  }

  /* ---- Item de menu ativo ------------------------------------------------ */
  if ("IntersectionObserver" in window) {
    var links = {};
    $$(".nav-list a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
          links[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });

    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); rev.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$(".reveal").forEach(function (el) { rev.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Conteúdos jurídicos (data/articles.json) ------------------------- */
  var grid = $("#articles-grid");
  if (grid) {
    fetch("data/articles.json").then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (data) {
      var blog = data.blogUrl;
      var more = $("#articles-more");
      if (more && blog) more.href = blog;
      grid.textContent = "";
      data.articles.forEach(function (a) {
        var href = a.url || blog;
        var card = document.createElement("article");
        card.className = "article-card";
        var cover = document.createElement("div"); cover.className = "cover";
        var img = document.createElement("img");
        img.src = a.image; img.alt = a.alt || ""; img.loading = "lazy"; img.width = 238; img.height = 238;
        cover.appendChild(img); card.appendChild(cover);
        if (a.date) {
          var t = document.createElement("time"); t.dateTime = a.date;
          t.textContent = new Date(a.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
          card.appendChild(t);
        }
        var h = document.createElement("h3"); h.textContent = a.title; card.appendChild(h);
        var p = document.createElement("p"); p.textContent = a.summary; card.appendChild(p);
        var l = document.createElement("a"); l.className = "area-link"; l.href = href;
        l.rel = "noopener"; l.target = "_blank";
        l.textContent = "Ler no site do escritório";
        var sr = document.createElement("span"); sr.className = "sr-only"; sr.textContent = ": " + a.title;
        l.appendChild(sr); card.appendChild(l);
        grid.appendChild(card);
      });
    }).catch(function () {
      grid.innerHTML = '<p>Não foi possível carregar os conteúdos agora. Acesse o <a class="area-link" href="https://schiavoniadvogados.com.br/blog/" rel="noopener">blog do escritório</a>.</p>';
    });
  }

  /* ---- Pré-seleção da área no formulário -------------------------------- */
  $$("[data-area]").forEach(function (a) {
    a.addEventListener("click", function () {
      var sel = $("#area"); if (sel) sel.value = a.getAttribute("data-area");
    });
  });

  /* ---- Formulário -------------------------------------------------------- */
  var form = $("#contact-form");
  if (!form) return;
  var status = $("#form-status");
  var btn = $("button[type=submit]", form);

  function show(type, html) {
    status.className = "form-status is-visible is-" + type;
    status.innerHTML = html;
    status.focus();
  }
  function fieldError(el, msg) {
    var err = document.getElementById(el.id + "-error");
    if (msg) { el.setAttribute("aria-invalid", "true"); err.textContent = msg; }
    else { el.removeAttribute("aria-invalid"); err.textContent = ""; }
    return !msg;
  }
  var rules = {
    name: function (v) { return v.trim().length < 3 ? "Informe seu nome completo." : ""; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Informe um e-mail válido."; },
    phone: function (v) { var d = v.replace(/\D/g, ""); return d.length < 10 || d.length > 13 ? "Informe um telefone com DDD." : ""; },
    area: function (v) { return v ? "" : "Selecione uma área."; },
    message: function (v) { return v.trim().length < 10 ? "Descreva brevemente sua solicitação (mín. 10 caracteres)." : ""; }
  };
  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("blur", function () { fieldError(el, rules[id](el.value)); });
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid")) fieldError(el, rules[id](el.value)); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    var firstBad = null;
    Object.keys(rules).forEach(function (id) {
      var el = document.getElementById(id);
      if (!fieldError(el, rules[id](el.value)) && !firstBad) firstBad = el;
    });
    var consent = $("#consent"), cErr = $("#consent-error");
    cErr.textContent = consent.checked ? "" : "É necessário concordar para enviar a mensagem.";
    if (!consent.checked && !firstBad) firstBad = consent;
    if (firstBad) { firstBad.focus(); return; }
    if (form.elements.website.value) return; // honeypot

    var alt = 'Se preferir, escreva para <a href="mailto:' + SITE.email + '">' + SITE.email + '</a> ou use o <a href="' + waUrl + '" rel="noopener">WhatsApp</a>.';
    if (!SITE.formEndpoint) {
      show("error", "<strong>O envio por formulário ainda não está ativado neste site.</strong> Sua mensagem não foi enviada. " + alt);
      return;
    }

    var payload = {
      nome: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      telefone: form.elements.phone.value.trim(),
      area: form.elements.area.value,
      mensagem: form.elements.message.value.trim(),
      consentimento_lgpd: "sim"
    };
    if (SITE.formAccessKey) payload.access_key = SITE.formAccessKey;

    btn.disabled = true; btn.textContent = "Enviando…";
    fetch(SITE.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || j.success === false || j.ok === false) throw new Error("fail");
      });
    }).then(function () {
      form.reset();
      show("success", "<strong>Mensagem enviada.</strong> Recebemos seu contato e retornaremos assim que possível. Este envio não constitui contratação de serviços.");
    }).catch(function () {
      show("error", "<strong>Não foi possível enviar a mensagem.</strong> " + alt);
    }).then(function () {
      btn.disabled = false; btn.textContent = "Enviar mensagem";
    });
  });
})();
