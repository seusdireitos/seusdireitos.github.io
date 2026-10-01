/* Navegação e movimento do refinamento visual; sem dependências externas. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const preference = (key) => {
    try {
      return localStorage.getItem(key) === "true";
    } catch {
      return false;
    }
  };
  const save = (key, value) => {
    try {
      localStorage.setItem(key, String(value));
    } catch {}
  };
  let simple = preference("salmat_simple");
  let motionPaused = preference("salmat_motion_paused");
  function applySimple(value, persist = true) {
    simple = value;
    document.body.classList.toggle("simple-mode", value);
    $("simple-status").hidden = !value;
    document.querySelectorAll(".simple-toggle").forEach((button) => {
      button.setAttribute("aria-pressed", String(value));
      button.textContent = value ? "Ver tudo" : "Modo simples";
      if (button.closest("#simple-status"))
        button.textContent = "Ver conteúdo completo";
    });
    if (persist) save("salmat_simple", value);
  }
  function revealSection(target) {
    if (simple && target?.closest("[data-advanced]")) applySimple(false);
    target?.closest(".fade-in")?.classList.add("visible");
  }
  window.SiteVisual = { revealSection };
  document
    .querySelectorAll(".simple-toggle")
    .forEach((button) =>
      button.addEventListener("click", () => applySimple(!simple)),
    );
  applySimple(simple, false);
  const accessibilityButton = $("a11y-toggle");
  const accessibilityPanel = $("a11y-tools");
  function accessibility(open, restoreFocus = false) {
    accessibilityPanel.hidden = !open;
    accessibilityButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("a11y-open", open);
    if (restoreFocus) accessibilityButton.focus();
  }
  accessibilityButton.addEventListener("click", () =>
    accessibility(accessibilityPanel.hidden),
  );
  const motionButton = document.createElement("button");
  motionButton.type = "button";
  motionButton.className = "a11y-btn";
  motionButton.id = "motion-toggle";
  motionButton.textContent = "Ⅱ";
  accessibilityPanel.append(motionButton);
  function applyMotion() {
    const paused = motionPaused || motionQuery.matches;
    document.body.classList.toggle("motion-paused", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.setAttribute(
      "aria-label",
      paused ? "Animações pausadas" : "Pausar animações",
    );
    motionButton.title = paused ? "Animações pausadas" : "Pausar animações";
    motionButton.textContent = paused ? "▶" : "Ⅱ";
    if (paused)
      document.querySelectorAll("[data-target]").forEach((node) => {
        const value = Number(node.dataset.target);
        node.textContent =
          (node.dataset.prefix || "") +
          (node.dataset.prefix ? value.toLocaleString("pt-BR") : value);
      });
  }
  motionButton.addEventListener("click", () => {
    if (motionQuery.matches) {
      if (typeof mostrarToast === "function")
        mostrarToast("Seu aparelho está configurado para reduzir movimentos.");
      return;
    }
    motionPaused = !motionPaused;
    save("salmat_motion_paused", motionPaused);
    applyMotion();
  });
  motionQuery.addEventListener("change", applyMotion);
  applyMotion();
  document.querySelectorAll(".open-duda").forEach((button) =>
    button.addEventListener("click", () => {
      if ($("duda-panel").hidden) $("duda-toggle").click();
      $("duda-input").focus();
    }),
  );
  const chatObserver = new MutationObserver(() =>
    document.body.classList.toggle("duda-is-open", !$("duda-panel").hidden),
  );
  chatObserver.observe($("duda-panel"), {
    attributes: true,
    attributeFilter: ["hidden"],
  });
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) {
      const target = document.getElementById(
        anchor.getAttribute("href").slice(1),
      );
      if (target) revealSection(target);
      document.querySelector(".nav-more")?.removeAttribute("open");
    }
    if (!event.target.closest(".nav-more"))
      document.querySelector(".nav-more")?.removeAttribute("open");
    if (
      !event.target.closest("#a11y-tools,#a11y-toggle") &&
      !accessibilityPanel.hidden
    )
      accessibility(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!accessibilityPanel.hidden) accessibility(false, true);
      const more = document.querySelector(".nav-more");
      if (more?.open) {
        more.open = false;
        more.querySelector("summary").focus();
      }
    }
    const control = event.target.closest(
      ".accordion-header,.faq-q,.myth-card,.check-item",
    );
    if (control && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      control.click();
    }
  });
  document
    .querySelectorAll(".accordion-header,.faq-q")
    .forEach((control, index) => {
      const item = control.parentElement;
      const content = control.nextElementSibling;
      control.tabIndex = 0;
      control.setAttribute("role", "button");
      if (!content.id) content.id = "expandable-content-" + index;
      control.setAttribute("aria-controls", content.id);
      const sync = () => {
        const open = item.classList.contains("open");
        control.setAttribute("aria-expanded", String(open));
        content.setAttribute("aria-hidden", String(!open));
      };
      sync();
      new MutationObserver(sync).observe(item, {
        attributes: true,
        attributeFilter: ["class"],
      });
      control.addEventListener("click", () => {
        if (
          !document.body.classList.contains("motion-paused") &&
          item.classList.contains("open")
        )
          content.animate(
            [
              { opacity: 0, transform: "translateY(-5px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 240, easing: "ease-out" },
          );
      });
    });
  document.querySelectorAll(".myth-card").forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      (
        card.querySelector(".myth-statement")?.textContent || "Mito ou verdade"
      ).trim(),
    );
    const sync = () =>
      card.setAttribute(
        "aria-expanded",
        String(card.classList.contains("revealed")),
      );
    sync();
    new MutationObserver(sync).observe(card, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });
  function prepareChecks() {
    document.querySelectorAll(".check-item").forEach((item) => {
      item.tabIndex = 0;
      item.setAttribute("role", "checkbox");
      item.setAttribute(
        "aria-checked",
        String(item.classList.contains("checked")),
      );
    });
  }
  prepareChecks();
  new MutationObserver(prepareChecks).observe($("checklist"), {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
  const progress = $("reading-progress");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");
  function syncProgress() {
    const height = document.documentElement.scrollHeight - innerHeight;
    progress.setAttribute(
      "aria-valuenow",
      String(Math.round(height > 0 ? (scrollY / height) * 100 : 0)),
    );
  }
  window.addEventListener("scroll", syncProgress, { passive: true });
  syncProgress();
  function fromHash() {
    const id = location.hash.slice(1);
    if (id) revealSection(document.getElementById(id));
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
