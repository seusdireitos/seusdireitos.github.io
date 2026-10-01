(function () {
  "use strict";
  const $ = (id) => document.getElementById(id),
    panel = $("duda-panel"),
    log = $("duda-messages");
  function clean(el) {
    const c = el.cloneNode(true);
    c.querySelectorAll(
      'button,script,style,.tooltip-box,.sr-only,[id^="tts-"],iframe',
    ).forEach((x) => x.remove());
    return c.textContent.replace(/\s+/g, " ").trim();
  }
  const docs = [];
  document.querySelectorAll("section[id]:not([data-no-duda])").forEach((section) => {
    const cards = section.querySelectorAll(
      ".accordion-item,.faq-item,.who-card,.men-card,.glossary-card,.grace-block,.myth-card,.step-card,.inss-box,.timeline-item,.info-card",
    );
    if (cards.length)
      cards.forEach((card, i) => {
        if (!card.id) card.id = "duda-" + section.id + "-" + i;
        const title = clean(
          card.querySelector(
            "h3,h4,.accordion-header,.faq-q,.glossary-term,.myth-statement",
          ) || card,
        ).slice(0, 150);
        const text = clean(card);
        if (text.length > 25)
          docs.push({ id: card.id, section: section.id, title, text });
      });
    else if (!["calculadora", "quiz", "compartilhar"].includes(section.id)) {
      const text = clean(section);
      if (text.length > 25)
        docs.push({
          id: section.id,
          section: section.id,
          title: clean(section.querySelector("h2") || section).slice(0, 120),
          text,
        });
    }
  });
  document
    .querySelectorAll("#como-pedir,#periodo-graca,#quem-tem-direito")
    .forEach((s) =>
      docs.push({
        id: s.id,
        section: s.id,
        title: clean(s.querySelector("h2")),
        text: clean(s),
      }),
    );
  // Checklist is a tool: do not return an unrelated full section as a legal answer.
  if (typeof itensPorPerfil !== "undefined")
    Object.entries(itensPorPerfil).forEach(([profile, items]) =>
      docs.push({
        id: "checklist",
        section: "checklist",
        title: "Documentos para " + profile,
        text: (Array.isArray(items) ? items : items.itens || []).map((i) => i.label).join("\n"),
      }),
    );
  const engine = new DudaEngine.Engine(docs);
  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem("duda-favorites-v2") || "[]");
    if (!Array.isArray(favorites)) favorites = [];
  } catch (e) {}
  const source =
    "https://www.gov.br/inss/pt-br/direitos-e-deveres/salario-maternidade/salario-maternidade";
  function button(label, fn, parent) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.addEventListener("click", fn);
    parent.append(b);
    return b;
  }
  function context() {
    $("duda-context").textContent = engine.describe().replace(/\n/g, " · ");
  }
  function openTarget(href) {
    if (
      href === "#checklist" &&
      engine.context.profile &&
      typeof selecionarPerfilChecklist === "function"
    ) {
      const profile =
        engine.context.event === "adoção" ? "adocao" : engine.context.profile;
      const b = document.querySelector(
        '.checklist-perfil-btn[data-perfil="' + profile + '"]',
      );
      if (b) selecionarPerfilChecklist(profile, b);
    }
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) {
        el.closest(".accordion-item")?.classList.add("open");
        el.closest(".faq-item")?.classList.add("open");
        if (
          el.classList.contains("myth-card") &&
          typeof revealMyth === "function"
        )
          revealMyth(el);
        if (window.SiteVisual) window.SiteVisual.revealSection(el);
        el.scrollIntoView({ behavior: document.body.classList.contains("motion-paused") ? "auto" : "smooth", block: "center" });
        setOpen(false);
      }
    } else location.href = href;
  }
  function tools(text, parent, doc) {
    const row = document.createElement("div");
    row.className = "duda-tools";
    button(
      "🔊 Ouvir",
      () => {
        if (!window.speechSynthesis) {
          notice("A leitura em voz alta não está disponível neste navegador.");
          return;
        }
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "pt-BR";
        speechSynthesis.speak(u);
      },
      row,
    );
    button(
      "Explicar mais simples",
      () =>
        render({
          text: text
            .replace(/qualidade de segurada/gi, "proteção pelo INSS")
            .replace(/fato gerador/gi, "parto, adoção ou outro evento")
            .replace(/carência/gi, "número mínimo de contribuições")
            .replace(
              /período de graça/gi,
              "tempo de proteção mesmo após parar de pagar",
            ),
        }),
      row,
    );
    if (doc)
      button(
        "☆ Favoritar",
        () => {
          if (!favorites.includes(doc.id)) favorites.push(doc.id);
          try {
            localStorage.setItem(
              "duda-favorites-v2",
              JSON.stringify(favorites),
            );
            notice("Assunto salvo nos favoritos deste aparelho.");
          } catch (e) {
            notice("Não foi possível guardar favoritos neste navegador.");
          }
        },
        row,
      );
    parent.append(row);
  }
  function notice(text) {
    render({ text });
  }
  function docCard(doc, parent) {
    const title = document.createElement("strong");
    title.textContent = doc.title;
    parent.append(title);
    const p = document.createElement("p");
    p.textContent =
      doc.text.length > 700 ? doc.text.slice(0, 700) + "…" : doc.text;
    parent.append(p);
    const row = document.createElement("div");
    row.className = "duda-actions";
    button("Ver texto completo no site", () => openTarget("#" + doc.id), row);
    parent.append(row);
    const a = document.createElement("a");
    a.className = "duda-source";
    a.href = source;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = "Consultar regras oficiais do INSS";
    parent.append(a);
    tools(doc.text, parent, doc);
  }
  function render(answer) {
    const box = document.createElement("div");
    box.className = "duda-message";
    if (answer.text) {
      const p = document.createElement("p");
      p.textContent = answer.text;
      box.append(p);
    }
    if (answer.docs) answer.docs.forEach((d) => docCard(d, box));
    const actions = document.createElement("div");
    actions.className = "duda-actions";
    (answer.suggest || []).forEach((s) => button(s, () => send(s), actions));
    (answer.choices || []).forEach((d) =>
      button(d.title, () => render({ docs: [d] }), actions),
    );
    (answer.links || []).forEach(([label, url]) => {
      const a = document.createElement("a");
      a.textContent = label;
      a.href = url;
      if (url.startsWith("#"))
        a.addEventListener("click", (e) => {
          e.preventDefault();
          openTarget(url);
        });
      actions.append(a);
    });
    if (actions.children.length) box.append(actions);
    if (answer.related?.length) {
      const det = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Outros trechos relacionados";
      det.append(summary);
      answer.related.forEach((d) =>
        button(d.title, () => render({ docs: [d] }), det),
      );
      box.append(det);
    }
    if (!answer.docs) tools(answer.text || "", box);
    log.append(box);
    while (log.children.length > 100) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
    context();
  }
  function send(text) {
    text = text.trim().slice(0, 1000);
    if (!text) return;
    const normalized = DudaEngine.normalize(text);
    const sensitive =
      /\b\d{11}\b|\b\d{3} \d{3} \d{3} \d{2}\b|minha senha|meu cpf/.test(
        normalized,
      );
    const b = document.createElement("div");
    b.className = "duda-message user";
    b.textContent = sensitive ? "[Mensagem com dados pessoais ocultada]" : text;
    log.append(b);
    render(engine.ask(text));
    $("duda-input").value = "";
    $("duda-input").focus();
  }
  function setOpen(value) {
    panel.hidden = !value;
    $("duda-toggle").setAttribute("aria-expanded", String(value));
    if (value) $("duda-input").focus();
    else $("duda-toggle").focus();
  }
  $("duda-toggle").addEventListener("click", () => setOpen(panel.hidden));
  $("duda-close").addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) setOpen(false);
  });
  $("duda-form").addEventListener("submit", (e) => {
    e.preventDefault();
    send($("duda-input").value);
  });
  $("duda-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      send(e.target.value);
    }
  });
  $("duda-reset").addEventListener("click", () => {
    engine.reset();
    log.replaceChildren();
    if (window.speechSynthesis) speechSynthesis.cancel();
    welcome();
  });
  $("duda-summary").addEventListener("click", () =>
    render({
      text:
        "O que você me contou:\n" +
        engine.describe() +
        "\n\nConfira sua situação e documentos com o INSS. Nenhuma mensagem é armazenada após recarregar esta página.",
      links: [
        ["Abrir meu checklist", "#checklist"],
        ["Como pedir", "#como-pedir"],
        ["Atendimento em Ubá", "#localizador"],
      ],
    }),
  );
  $("duda-save").addEventListener("click", () => {
    const saved = docs.filter((d) => favorites.includes(d.id));
    render(
      saved.length
        ? { text: "Seus assuntos favoritos:", choices: saved }
        : { text: "Nenhum favorito ainda. Use “Favoritar” em uma resposta." },
    );
  });
  $("duda-clear").addEventListener("click", () => {
    favorites = [];
    try {
      localStorage.removeItem("duda-favorites-v2");
    } catch (e) {}
    notice("Favoritos apagados.");
  });
  function welcome() {
    render({
      text: "Olá! Sou a Duda, ajuda automática deste site. Pode escrever sua dúvida do seu jeito. Consulto os textos do site e posso ajudar a encontrar documentos, regras e atendimento em Ubá.",
      suggest: [
        "Estou desempregada",
        "Sou MEI",
        "Como pedir?",
        "Quais documentos?",
      ],
    });
  }
  welcome();
  window.Duda = { engine, docs, send };
})();
