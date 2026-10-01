if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");

/* ========== ACESSIBILIDADE ========== */
let fontSize = 16;
function changeFontSize(dir) {
  if (dir === 0) fontSize = 16;
  else fontSize = Math.min(22, Math.max(13, fontSize + dir * 2));
  document.documentElement.style.setProperty(
    "--font-size-base",
    fontSize + "px",
  );
}
function toggleContrast() {
  document.body.classList.toggle("high-contrast");
  document.getElementById("contrastBtn").classList.toggle("active");
}

/* ========== TEXT-TO-SPEECH ========== */
let ttsAtual = null;
let ttsUtterance = null;
let ttsGlobalAtivo = false;

function lerSecao(idTexto, btn) {
  const synth = window.speechSynthesis;
  if (!synth) {
    alert("Seu navegador não suporta leitura de texto em voz alta.");
    return;
  }

  // Se já está lendo essa mesma seção, parar
  if (ttsAtual === idTexto && synth.speaking) {
    synth.cancel();
    ttsAtual = null;
    if (btn) btn.classList.remove("playing");
    return;
  }

  // Parar qualquer leitura anterior
  synth.cancel();
  document
    .querySelectorAll(".tts-btn")
    .forEach((b) => b.classList.remove("playing"));
  document.getElementById("ttsGlobalBtn").classList.remove("active");
  ttsGlobalAtivo = false;

  const el = document.getElementById(idTexto);
  if (!el) return;
  const texto = el.textContent.trim();
  if (!texto) return;

  ttsAtual = idTexto;
  if (btn) btn.classList.add("playing");

  ttsUtterance = new SpeechSynthesisUtterance(texto);
  ttsUtterance.lang = "pt-BR";
  ttsUtterance.rate = 0.92;
  ttsUtterance.pitch = 1;

  ttsUtterance.onend = () => {
    ttsAtual = null;
    if (btn) btn.classList.remove("playing");
  };
  ttsUtterance.onerror = () => {
    ttsAtual = null;
    if (btn) btn.classList.remove("playing");
  };

  synth.speak(ttsUtterance);
}

function toggleTTSGlobal() {
  const synth = window.speechSynthesis;
  if (!synth) {
    alert("Seu navegador não suporta leitura de texto em voz alta.");
    return;
  }

  if (ttsGlobalAtivo || synth.speaking) {
    synth.cancel();
    ttsGlobalAtivo = false;
    ttsAtual = null;
    document.getElementById("ttsGlobalBtn").classList.remove("active");
    document
      .querySelectorAll(".tts-btn")
      .forEach((b) => b.classList.remove("playing"));
    return;
  }

  // Ler toda a página sequencialmente
  const secoes = [
    "tts-quem-tem-direito",
    "tts-numeros",
    "tts-regras",
    "tts-graca",
    "tts-homens",
    "tts-como-pedir",
    "tts-faq",
    "tts-glossario",
    "tts-timeline",
    "tts-mitos",
  ];

  ttsGlobalAtivo = true;
  document.getElementById("ttsGlobalBtn").classList.add("active");

  let textoCompleto = "Guia completo sobre Salário-Maternidade. ";
  secoes.forEach((id) => {
    const el = document.getElementById(id);
    if (el) textoCompleto += el.textContent.trim() + ". ";
  });

  ttsUtterance = new SpeechSynthesisUtterance(textoCompleto);
  ttsUtterance.lang = "pt-BR";
  ttsUtterance.rate = 0.92;
  ttsUtterance.pitch = 1;
  ttsUtterance.onend = () => {
    ttsGlobalAtivo = false;
    document.getElementById("ttsGlobalBtn").classList.remove("active");
  };
  ttsUtterance.onerror = () => {
    ttsGlobalAtivo = false;
    document.getElementById("ttsGlobalBtn").classList.remove("active");
  };
  synth.speak(ttsUtterance);
}

/* ========== MENU MOBILE ========== */
function toggleMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const hambBtn = document.getElementById("hambBtn");
  if (!mobileMenu || !hambBtn) return;
  const isOpen = mobileMenu.classList.toggle("open");
  hambBtn.classList.toggle("open", isOpen);
  hambBtn.setAttribute("aria-expanded", isOpen);
}
document.addEventListener("DOMContentLoaded", function () {
  const hambBtn = document.getElementById("hambBtn");
  if (hambBtn) hambBtn.addEventListener("click", toggleMenu);
});
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.getElementById("mobileMenu")?.classList.remove("open");
    document.getElementById("hambBtn")?.classList.remove("open");
    document.getElementById("hambBtn")?.setAttribute("aria-expanded", "false");
  });
});

/* ========== HEADER + SCROLL SPY ========== */
/* ========== SCROLL (unificado — sem duplicar) ========== */
window.addEventListener("scroll", () => {
  // Header scroll
  const header = document.getElementById("mainHeader");
  if (header) header.classList.toggle("scrolled", window.scrollY > 50);

  // Botão back to top
  const backTop = document.getElementById("backTop");
  if (backTop) backTop.classList.toggle("visible", window.scrollY > 400);

  // Barra de progresso de leitura
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const total = doc.scrollHeight - doc.clientHeight;
  const pct = total > 0 ? (scrolled / total) * 100 : 0;
  const bar = document.getElementById("reading-progress");
  if (bar) bar.style.width = pct + "%";

  // Scroll spy
  updateScrollSpy();
});
function updateScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  let current = "";
  sections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) current = sec.id;
  });
  navLinks.forEach((a) => {
    a.classList.remove("active");
    if (a.getAttribute("href") === "#" + current) a.classList.add("active");
  });
}

/* ========== ACCORDION ========== */
function toggleAcc(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const wasOpen = item.classList.contains("open");
  document
    .querySelectorAll(".accordion-item")
    .forEach((i) => i.classList.remove("open"));
  if (!wasOpen) item.classList.add("open");
}

/* ========== FAQ ========== */
function toggleFaq(id) {
  document.getElementById(id)?.classList.toggle("open");
}

/* ========== MITOS ========== */
function revealMyth(card) {
  card.classList.toggle("revealed");
}

/* ========== PDF ========== */
function savePDF() {
  // Força os contadores a mostrarem o valor final instantaneamente antes de gerar o PDF
  document.querySelectorAll("[data-target]").forEach((el) => {
    const target = el.dataset.target;
    const prefix = el.dataset.prefix || "";
    el.textContent =
      prefix +
      (prefix === "R$ " ? parseInt(target).toLocaleString("pt-BR") : target);
  });

  // Chama a tela de impressão
  window.print();
}

/* ========== CONTADORES ========== */
let countersStarted = false;
function animateCounters() {
  document.querySelectorAll("[data-target]").forEach((el) => {
    const target = parseInt(el.dataset.target);
    const prefix = el.dataset.prefix || "";
    let current = 0;
    const step = target / (1800 / 16);
    const t = setInterval(() => {
      current = Math.min(current + step, target);
      const val = Math.round(current);
      el.textContent =
        prefix + (prefix === "R$ " ? val.toLocaleString("pt-BR") : val);
      if (current >= target) clearInterval(t);
    }, 16);
  });
}

/* ========== CALCULADORA REDESENHADA ========== */
// Estado da calculadora
let calcEstado = {
  etapa: 1,
  perfil: null, // 'clt' | 'autonoma' | 'desempregada' | 'rural'
  // CLT
  clt_empregada: null, // 'sim' | 'nao'
  clt_tempo_desempregada: null, // 'menos12' | 'entre12_24' | 'mais24'
  clt_dez_anos: null, // 'sim' | 'nao'
  clt_comprova_desemprego: null, // 'sim' | 'nao'
  // Autônoma/MEI
  auto_contribuiu: null, // 'sim' | 'nao'
  auto_contribuindo: null, // 'sim' | 'nao'
  auto_tempo_parada: null, // 'menos12' | 'entre12_24' | 'mais24'
  auto_dez_anos: null, // 'sim' | 'nao'
  auto_comprova: null, // 'sim' | 'nao'
  // Desempregada
  des_tempo_parada: null, // 'menos12' | 'entre12_24' | 'mais24'
  des_dez_anos: null, // 'sim' | 'nao'
  des_comprova: null, // 'sim' | 'nao'
  // Rural
  rural_atividade: null, // 'sim' | 'nao'
};

function calcAtualizarIndicador(etapa) {
  [1, 2, 3].forEach((i) => {
    const dot = document.getElementById("dot-" + i);
    if (!dot) return;
    dot.classList.remove("active", "done");
    if (i < etapa) dot.classList.add("done");
    else if (i === etapa) dot.classList.add("active");
  });
  [1, 2].forEach((i) => {
    const line = document.getElementById("line-" + i + "-" + (i + 1));
    if (!line) return;
    line.classList.toggle("done", i < etapa);
  });
}

function calcProxEtapa(etapaAtual) {
  if (etapaAtual === 1) {
    const sel = document.querySelector('input[name="e1_perfil"]:checked');
    if (!sel) {
      calcMostrarErro(
        "etapa-1",
        "Por favor, selecione sua situação antes de continuar.",
      );
      return;
    }
    calcLimparErro("etapa-1");
    calcEstado.perfil = sel.value;
    calcEstado.etapa = 2;
    calcMontarEtapa2();
    calcMostrarEtapa(2);
    calcAtualizarIndicador(2);
    document
      .getElementById("calcBoxPrincipal")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (etapaAtual === 2) {
    if (!calcValidarEtapa2()) return;

    // Pular etapa 3 se já tivermos o resultado direto na etapa 2
    const pulaEtapa3 =
      (calcEstado.perfil === "clt" && calcEstado.clt_empregada === "sim") ||
      (calcEstado.perfil === "rural" && calcEstado.rural_atividade === "sim") ||
      (calcEstado.perfil === "rural" && calcEstado.rural_atividade === "nao") ||
      (calcEstado.perfil === "autonoma" &&
        calcEstado.auto_contribuiu === "sim" &&
        calcEstado.auto_contribuindo === "sim") ||
      (calcEstado.perfil === "autonoma" &&
        calcEstado.auto_contribuiu === "nao");

    if (pulaEtapa3) {
      calcEstado.etapa = 3;
      calcAtualizarIndicador(3);
      const resultado = calcLogica();
      calcExibirResultado(resultado);
    } else {
      calcEstado.etapa = 3;
      calcMontarEtapa3();
      calcMostrarEtapa(3);
      calcAtualizarIndicador(3);
      document
        .getElementById("calcBoxPrincipal")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function calcVoltarEtapa(etapaAtual) {
  const anterior = etapaAtual - 1;
  calcMostrarEtapa(anterior);
  calcAtualizarIndicador(anterior);
  calcEstado.etapa = anterior;
}

function calcMostrarEtapa(n) {
  document
    .querySelectorAll(".calc-step-panel")
    .forEach((p) => p.classList.remove("active"));
  const panel = document.getElementById("etapa-" + n);
  if (panel) panel.classList.add("active");
  document.getElementById("calcResultadoFinal").classList.remove("show");
}

function calcMostrarErro(panelId, msg) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  let err = panel.querySelector(".calc-erro");
  if (!err) {
    err = document.createElement("div");
    err.className = "calc-erro";
    err.style.cssText =
      "background:rgba(239,68,68,0.2);border:2px solid #ef4444;border-radius:12px;padding:12px 16px;font-weight:800;font-size:0.9rem;margin-bottom:16px;";
    panel.insertBefore(
      err,
      panel.querySelector(".calc-nav") || panel.lastChild,
    );
  }
  err.textContent = "⚠️ " + msg;
  err.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function calcLimparErro(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  const err = panel.querySelector(".calc-erro");
  if (err) err.remove();
}

function calcMontarEtapa2() {
  const container = document.getElementById("etapa2-conteudo");
  const p = calcEstado.perfil;
  let html = "";

  if (p === "clt") {
    html = `
      <h3>📋 Etapa 2 de 3 — Situação do emprego</h3>
      <p style="font-size:0.92rem;opacity:0.85;margin-bottom:20px;line-height:1.6;text-align:justify;">Você com carteira assinada — responda sobre seu emprego atual:</p>
      <div class="calc-group">
        <label>Você ainda está trabalhando com carteira assinada hoje?</label>
        <span class="calc-hint">Ou seja, seu vínculo empregatício ainda está ativo?</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_clt_emp" value="sim">
            <div><strong>✅ Sim, estou empregada normalmente</strong>
            <div style="font-size:0.8rem;opacity:0.75;margin-top:3px;">Meu emprego está ativo, recebo salário regularmente</div></div>
          </label>
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_clt_emp" value="nao">
            <div><strong>❌ Não, fui demitida recentemente</strong>
            <div style="font-size:0.8rem;opacity:0.75;margin-top:3px;">Perdi o emprego ou saí da empresa</div></div>
          </label>
        </div>
      </div>
    `;
  } else if (p === "autonoma") {
    html = `
      <h3>📋 Etapa 2 de 3 — Suas contribuições</h3>
      <p style="font-size:0.92rem;opacity:0.85;margin-bottom:20px;line-height:1.6;text-align:justify;">O STF derrubou a carência de 10 meses para MEI e Autônomas, mas é preciso confirmar sua qualidade de segurada.</p>
      <div class="calc-group">
        <label>Você pagou pelo menos UMA guia do INSS (DAS) em dia ANTES do parto/gravidez?</label>
        <span class="calc-hint">A qualidade de segurada é analisada na data do evento. Pagamentos e filiação precisam ser conferidos; não há garantia automática.</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_auto_contribuiu" value="sim">
            <div><strong>✅ Sim, paguei em dia antes</strong></div>
          </label>
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_auto_contribuiu" value="nao">
            <div><strong>❌ Não, nunca paguei ou paguei atrasado</strong></div>
          </label>
        </div>
      </div>
      <div class="calc-group">
        <label>Você continua pagando o carnê do INSS hoje?</label>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_auto_cont" value="sim">
            <div><strong>✅ Sim, continuo pagando</strong></div>
          </label>
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_auto_cont" value="nao">
            <div><strong>❌ Não, parei de pagar faz tempo</strong></div>
          </label>
        </div>
      </div>
    `;
  } else if (p === "desempregada") {
    html = `
      <h3>📋 Etapa 2 de 3 — Há quanto tempo você parou?</h3>
      <p style="font-size:0.92rem;opacity:0.85;margin-bottom:20px;line-height:1.6;text-align:justify;">A proteção continua por um tempo mesmo após você parar de contribuir. Vamos descobrir sua situação.</p>
      <div class="calc-group">
        <label>Há quanto tempo você foi demitida ou parou de pagar o INSS?</label>
        <span class="calc-hint">Pense no mês do último pagamento ao INSS ou da demissão com baixa na carteira.</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_des_tempo" value="menos12">
            <div><strong>🟢 Menos de 1 ano (até 12 meses)</strong>
            <div style="font-size:0.8rem;opacity:0.75;margin-top:3px;">Parei faz menos de 1 ano</div></div>
          </label>
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_des_tempo" value="entre12_24">
            <div><strong>🟡 Entre 1 e 2 anos (12 a 24 meses)</strong>
            <div style="font-size:0.8rem;opacity:0.75;margin-top:3px;">Parei há mais de 1 ano mas menos de 2 anos</div></div>
          </label>
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_des_tempo" value="mais24">
            <div><strong>🔴 Mais de 2 anos</strong>
            <div style="font-size:0.8rem;opacity:0.75;margin-top:3px;">Parei há mais de 2 anos</div></div>
          </label>
        </div>
      </div>
    `;
  } else if (p === "rural") {
    html = `
      <h3>📋 Etapa 2 de 3 — Sua atividade rural</h3>
      <p style="font-size:0.92rem;opacity:0.85;margin-bottom:20px;line-height:1.6;text-align:justify;">Trabalhadora rural tem regras especiais e mais simples. Só precisamos confirmar uma coisa:</p>
      <div class="calc-group">
        <label>Você exerce atividade rural de forma regular para o sustento da sua família?</label>
        <span class="calc-hint">Por exemplo: plantação, horta, roça, criação de animais para consumo familiar ou venda em pequena escala.</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_rural_atv" value="sim">
            <div><strong>✅ Sim, trabalho na roça / agricultura familiar</strong>
            <div style="font-size:0.8rem;opacity:0.75;margin-top:3px;">Tenho documentos que comprovam (declaração de sindicato rural, nota fiscal, etc.)</div></div>
          </label>
          <label class="calc-radio calc-radio-full">
            <input type="radio" name="e2_rural_atv" value="nao">
            <div><strong>❌ Não, minha situação é diferente</strong>
            <div style="font-size:0.8rem;opacity:0.75;margin-top:3px;">Não tenho como comprovar atividade rural</div></div>
          </label>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function calcValidarEtapa2() {
  const p = calcEstado.perfil;
  calcLimparErro("etapa-2");

  if (p === "clt") {
    const emp = document.querySelector('input[name="e2_clt_emp"]:checked');
    if (!emp) {
      calcMostrarErro(
        "etapa-2",
        "Responda se você ainda está empregada ou não.",
      );
      return false;
    }
    calcEstado.clt_empregada = emp.value;
  } else if (p === "autonoma") {
    const contribuiu = document.querySelector(
      'input[name="e2_auto_contribuiu"]:checked',
    );
    const cont = document.querySelector('input[name="e2_auto_cont"]:checked');
    if (!contribuiu || !cont) {
      calcMostrarErro(
        "etapa-2",
        "Responda todas as perguntas antes de continuar.",
      );
      return false;
    }
    calcEstado.auto_contribuiu = contribuiu.value;
    calcEstado.auto_contribuindo = cont.value;
  } else if (p === "desempregada") {
    const tempo = document.querySelector('input[name="e2_des_tempo"]:checked');
    if (!tempo) {
      calcMostrarErro(
        "etapa-2",
        "Selecione há quanto tempo você parou de contribuir.",
      );
      return false;
    }
    calcEstado.des_tempo_parada = tempo.value;
  } else if (p === "rural") {
    const atv = document.querySelector('input[name="e2_rural_atv"]:checked');
    if (!atv) {
      calcMostrarErro("etapa-2", "Responda sobre sua atividade rural.");
      return false;
    }
    calcEstado.rural_atividade = atv.value;
  }
  return true;
}

function calcMontarEtapa3() {
  const container = document.getElementById("etapa3-conteudo");
  const p = calcEstado.perfil;
  let html = "<h3>📋 Etapa 3 de 3 — Últimas perguntas</h3>";

  if (p === "clt" && calcEstado.clt_empregada === "nao") {
    html += `
      <p style="font-size:0.92rem;opacity:0.85;margin-bottom:20px;line-height:1.6;text-align:justify;">Você foi demitida. Vamos verificar se você ainda está protegida pelo Período de Graça:</p>
      <div class="calc-group">
        <label>Você tem mais de 120 contribuições mensais sem interrupção que tenha causado perda da qualidade de segurada?</label>
        <span class="calc-hint">Confira no CNIS: o requisito não é apenas somar 10 anos ao longo da vida.</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_dez" value="sim"><strong>✅ Sim, tenho mais de 120 contribuições sem perda da qualidade</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_dez" value="nao"><strong>❌ Não, tenho menos de 10 anos</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_dez" value="nao_sei"><strong>🤔 Não sei / não tenho certeza</strong></label>
        </div>
      </div>
      <div class="calc-group">
        <label>Você tem algum documento que comprove que está desempregada?</label>
        <span class="calc-hint">Exemplos: baixa na carteira de trabalho, seguro-desemprego, rescisão de contrato.</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_comp" value="sim"><strong>✅ Sim, tenho documentos de demissão</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_comp" value="nao"><strong>❌ Não tenho ou não sei onde estão</strong></label>
        </div>
      </div>
      <div class="calc-group">
        <label>Há quanto tempo você foi demitida?</label>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_tempo" value="menos12"><strong>🟢 Menos de 1 ano</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_tempo" value="entre12_24"><strong>🟡 Entre 1 e 2 anos</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_clt_tempo" value="mais24"><strong>🔴 Mais de 2 anos</strong></label>
        </div>
      </div>
    `;
  } else if (p === "clt" && calcEstado.clt_empregada === "sim") {
    html += `<p style="font-size:1rem;margin-bottom:20px;text-align:center;"><strong>✅ Ótima notícia!</strong> Estando empregada com carteira assinada, você já tem indicação de possível direito! Clique em "Ver meu resultado" para confirmar.</p>`;
  } else if (p === "autonoma" && calcEstado.auto_contribuindo === "nao") {
    html += `
      <p style="font-size:0.92rem;opacity:0.85;margin-bottom:20px;line-height:1.6;text-align:justify;">Você parou de contribuir. Vamos verificar se ainda está protegida pelo Período de Graça:</p>
      <div class="calc-group">
        <label>Há quanto tempo você parou de pagar o carnê do INSS (DAS)?</label>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_auto_tempo" value="menos12"><strong>🟢 Menos de 1 ano</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_auto_tempo" value="entre12_24"><strong>🟡 Entre 1 e 2 anos</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_auto_tempo" value="mais24"><strong>🔴 Mais de 2 anos</strong></label>
        </div>
      </div>
      <div class="calc-group">
        <label>Você tem mais de 120 contribuições sem interrupção que cause perda da qualidade de segurada?</label>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_auto_dez" value="sim"><strong>✅ Sim, mais de 120 contribuições sem perda da qualidade</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_auto_dez" value="nao"><strong>❌ Não, menos de 10 anos</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_auto_dez" value="nao_sei"><strong>🤔 Não sei ao certo</strong></label>
        </div>
      </div>
    `;
  } else if (p === "desempregada") {
    html += `
      <p style="font-size:0.92rem;opacity:0.85;margin-bottom:20px;line-height:1.6;text-align:justify;">Para verificar o tamanho do seu período de proteção, precisamos de mais duas informações:</p>
      <div class="calc-group">
        <label>Você tem mais de 120 contribuições sem interrupção que cause perda da qualidade de segurada?</label>
        <span class="calc-hint">O requisito é mais de 120 contribuições sem interrupção que cause perda da qualidade.</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_des_dez" value="sim"><strong>✅ Sim, tenho mais de 120 contribuições sem perda da qualidade</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_des_dez" value="nao"><strong>❌ Não, tenho menos de 10 anos</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_des_dez" value="nao_sei"><strong>🤔 Não tenho certeza</strong></label>
        </div>
      </div>
      <div class="calc-group">
        <label>Você tem algum documento que comprove que está desempregada ou sem renda?</label>
        <span class="calc-hint">Exemplos: baixa na carteira de trabalho, seguro-desemprego, rescisão de contrato assinada.</span>
        <div class="calc-radio-group" style="flex-direction:column;gap:10px;">
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_des_comp" value="sim"><strong>✅ Sim, tenho documentos de demissão ou desemprego</strong></label>
          <label class="calc-radio calc-radio-full"><input type="radio" name="e3_des_comp" value="nao"><strong>❌ Não tenho / saí voluntariamente</strong></label>
        </div>
      </div>
    `;
  } else if (p === "rural") {
    html += `<p style="font-size:1rem;margin-bottom:20px;text-align:center;"><strong>Quase lá!</strong> Baseado nas suas respostas, vamos agora verificar seu direito. Clique em "Ver meu resultado".</p>`;
  }
  container.innerHTML = html;
}

function calcularResultado() {
  calcLimparErro("etapa-3");
  const p = calcEstado.perfil;

  // Coletar dados da etapa 3
  if (p === "clt" && calcEstado.clt_empregada === "nao") {
    const dez = document.querySelector('input[name="e3_clt_dez"]:checked');
    const comp = document.querySelector('input[name="e3_clt_comp"]:checked');
    const tempo = document.querySelector('input[name="e3_clt_tempo"]:checked');
    if (!dez || !comp || !tempo) {
      calcMostrarErro("etapa-3", "Por favor, responda todas as perguntas.");
      return;
    }
    calcEstado.clt_dez_anos = dez.value;
    calcEstado.clt_comprova_desemprego = comp.value;
    calcEstado.clt_tempo_desempregada = tempo.value;
  } else if (p === "autonoma" && calcEstado.auto_contribuindo === "nao") {
    const tempo = document.querySelector('input[name="e3_auto_tempo"]:checked');
    const dez = document.querySelector('input[name="e3_auto_dez"]:checked');
    if (!tempo || !dez) {
      calcMostrarErro("etapa-3", "Por favor, responda todas as perguntas.");
      return;
    }
    calcEstado.auto_tempo_parada = tempo.value;
    calcEstado.auto_dez_anos = dez.value;
  } else if (p === "desempregada") {
    const dez = document.querySelector('input[name="e3_des_dez"]:checked');
    const comp = document.querySelector('input[name="e3_des_comp"]:checked');
    if (!dez || !comp) {
      calcMostrarErro("etapa-3", "Por favor, responda todas as perguntas.");
      return;
    }
    calcEstado.des_dez_anos = dez.value;
    calcEstado.des_comprova = comp.value;
  }

  // Calcular resultado
  let resultado = calcLogica();
  calcExibirResultado(resultado);
}

function calcLogica() {
  const p = calcEstado.perfil;

  /* ─── Helper: nota do 15º dia ─── */
  const notaDia15 = `<br><br>📅 A calculadora usa faixas aproximadas. A data exata de perda da qualidade depende do histórico e das regras de vencimento das contribuições; confira no INSS.`;

  /* ─── Helper: link CNIS para quem não sabe os 10 anos ─── */
  const linkCNIS = `<br><br>🔍 <strong>Não tem certeza se tem 10 anos?</strong> Baixe seu <strong>Extrato CNIS</strong> gratuitamente no <a href="https://meu.inss.gov.br/#/login" target="_blank" rel="noopener noreferrer" style="color:var(--yellow);font-weight:900;">app Meu INSS</a>. Se confirmar mais de 120 contribuições sem perda da qualidade, sua proteção pode ser ampliada em <strong>12 meses</strong> — podendo chegar a 36 meses no total!`;

  // ==== CLT ====
  if (p === "clt") {
    if (calcEstado.clt_empregada === "sim") {
      return {
        tipo: "tem-direito",
        emoji: "✅",
        titulo: "Há indicação de possível direito ao benefício.",
        desc: "Como empregada com carteira assinada, você tem indicação de possível direito aos <strong>120 dias de benefício</strong>, sem precisar de carência mínima de INSS.",
        detalhe:
          "💡 O benefício é pago pela sua empresa — avise o RH assim que tiver a certidão de nascimento ou antes do parto. Pergunte também se a empresa participa do <strong>Programa Empresa Cidadã</strong> (até 180 dias). Documentos necessários: RG, CPF, certidão de nascimento e carteira de trabalho.",
      };
    }
    // CLT demitida
    const temDezAnos = calcEstado.clt_dez_anos === "sim";
    const naoSabeDez = calcEstado.clt_dez_anos === "nao_sei";
    const comprova = calcEstado.clt_comprova_desemprego === "sim";
    const tempo = calcEstado.clt_tempo_desempregada;

    // nao_sei: tratar como "não" para ser conservador
    let prazoMax = 12;
    if (temDezAnos) prazoMax = 24;
    if (temDezAnos && comprova) prazoMax = 36;

    const dentroDoGraça =
      tempo === "menos12" ||
      (tempo === "entre12_24" && prazoMax >= 24) ||
      (tempo === "mais24" && prazoMax >= 36);

    if (dentroDoGraça) {
      return {
        tipo: "periodo-graca",
        emoji: "⏳",
        titulo: "Você pode ter direito — está no Período de Graça!",
        desc: `Mesmo demitida, você ainda está protegida. Seu período de graça é de até <strong>${prazoMax} meses</strong> após a demissão. Se o bebê nascer dentro desse prazo, o <strong>INSS paga o benefício</strong>.`,
        detalhe: `👩‍⚖️ Ligue gratuitamente para o <strong>135</strong> ou vá a uma agência do INSS com sua carteira de trabalho e rescisão.${naoSabeDez ? linkCNIS : ""}${notaDia15}`,
      };
    } else {
      return {
        tipo: "nao-tem-direito",
        emoji: "❌",
        titulo: "O prazo de proteção pode ter expirado.",
        desc: "Com base nas informações fornecidas, o período de graça pode ter se encerrado. Mas <strong>não desista sem confirmar com o INSS</strong> — o cálculo exato depende do seu histórico completo.",
        detalhe: `👩‍⚖️ Ligue gratuitamente para o <strong>135</strong> ou vá a uma agência do INSS com sua carteira de trabalho e rescisão.${naoSabeDez ? " Se tiver mais de 10 anos de contribuição, o prazo pode ser maior do que estimamos." : ""}`,
      };
    }
  }

  // ==== AUTÔNOMA / MEI ====
  if (p === "autonoma") {
    // Se nunca pagou em dia ANTES do evento
    if (calcEstado.auto_contribuiu === "nao") {
      return {
        tipo: "nao-tem-direito",
        emoji: "❌",
        titulo: "É necessário verificar sua cobertura com o INSS.",
        desc: 'O STF derrubou a exigência de 10 meses, mas <strong>é necessário verificar a filiação e a qualidade de segurada na data do evento</strong> para ser considerada "segurada" do INSS.',
        detalhe:
          "💡 Pagamentos em atraso exigem análise da filiação, da atividade e da data do evento; não conte com concessão automática. Para gestação futura: mantenha o DAS pago em dia para garantir a proteção. Ligue para o 135 para verificar se há alternativas.",
      };
    }

    // Contribuiu antes e continua contribuindo
    if (
      calcEstado.auto_contribuiu === "sim" &&
      calcEstado.auto_contribuindo === "sim"
    ) {
      return {
        tipo: "tem-direito",
        emoji: "✅",
        titulo: "Há indicação de possível direito ao benefício.",
        desc: "Excelente! Como você contribuiu antes do parto e se mantém ativa, a qualidade de segurada deve ser conferida no CNIS e na data do evento, graças à nova regra aprovada pelo STF.",
        detalhe:
          "📱 Solicite pelo app Meu INSS ou ligue para o 135. O INSS pagará o benefício diretamente a você. O valor para MEI é de 1 salário mínimo.",
      };
    }

    // Contribuiu antes, mas parou
    const tempoPar = calcEstado.auto_tempo_parada;
    const dezAnos = calcEstado.auto_dez_anos === "sim";
    const naoSabeDez = calcEstado.auto_dez_anos === "nao_sei";

    let prazoMax = 12;
    if (dezAnos) prazoMax = 24;
    // A ampliação por desemprego exige comprovação; não é presumida para autônoma.

    const dentroDoGraça =
      tempoPar === "menos12" ||
      (tempoPar === "entre12_24" && prazoMax >= 24) ||
      (tempoPar === "mais24" && prazoMax >= 36);

    if (dentroDoGraça) {
      return {
        tipo: "periodo-graca",
        emoji: "⏳",
        titulo: "Você pode ter direito — está no Período de Graça!",
        desc: `Mesmo sem contribuir atualmente, você ainda pode estar protegida por até <strong>${prazoMax} meses</strong> após a última contribuição. Se o evento ocorrer dentro desse prazo, pode haver proteção; confirme o histórico e as datas com o INSS.`,
        detalhe: `📱 Solicite pelo app Meu INSS ou ligue para o 135. Documentos necessários: RG, CPF, certidão de nascimento e comprovantes de pagamento do DAS.${naoSabeDez ? linkCNIS : ""}${notaDia15}`,
      };
    } else {
      return {
        tipo: "nao-tem-direito",
        emoji: "❌",
        titulo: "O prazo de proteção pode ter expirado.",
        desc: "Com base nas informações, seu período de graça pode ter se encerrado. <strong>Confirme com o INSS antes de desistir</strong> — o cálculo exato depende do seu histórico.",
        detalhe: `📞 Ligue gratuitamente para o <strong>135</strong> ou vá a uma agência do INSS com seus comprovantes de pagamento do DAS.${naoSabeDez ? linkCNIS : ""}`,
      };
    }
  }

  // ==== DESEMPREGADA ====
  if (p === "desempregada") {
    const tempo = calcEstado.des_tempo_parada;
    const temDezExato = calcEstado.des_dez_anos === "sim";
    const naoSabeDez = calcEstado.des_dez_anos === "nao_sei";
    const comprova = calcEstado.des_comprova === "sim";

    let prazoMax = 12;
    if (temDezExato) prazoMax = 24;
    if (temDezExato && comprova) prazoMax = 36;

    const dentroDoGraça =
      tempo === "menos12" ||
      (tempo === "entre12_24" && prazoMax >= 24) ||
      (tempo === "mais24" && prazoMax >= 36);

    if (dentroDoGraça) {
      return {
        tipo: "periodo-graca",
        emoji: "⏳",
        titulo: "Você pode ter direito — está no Período de Graça!",
        desc: `Você ainda está dentro do prazo de proteção (Período de Graça) de <strong>${prazoMax} meses</strong>. Se o parto acontecer antes desse prazo vencer, o <strong>INSS paga o benefício</strong>.`,
        detalhe: `📞 Acesse o app Meu INSS ou ligue para o 135 para solicitar. Documentos necessários: RG, CPF, certidão de nascimento, carteira de trabalho com a baixa e rescisão de contrato.${!comprova ? " ⚠️ Reúna documentos de demissão — eles podem ampliar sua proteção." : ""}${naoSabeDez ? linkCNIS : ""}${notaDia15}`,
      };
    } else {
      return {
        tipo: "nao-tem-direito",
        emoji: "❌",
        titulo: "O prazo de proteção pode ter expirado.",
        desc: "Com base nas suas respostas, o período de graça pode ter encerrado. Porém, <strong>confirme com o INSS antes de desistir</strong> — o cálculo exato depende do seu histórico completo.",
        detalhe: `📞 Ligue gratuitamente para o <strong>135</strong> ou vá a uma agência do INSS com seus documentos.${naoSabeDez ? " " + linkCNIS : ""} Um advogado previdenciário pode analisar seu caso com mais detalhes.`,
      };
    }
  }

  // ==== RURAL ====
  if (p === "rural") {
    if (calcEstado.rural_atividade === "sim") {
      return {
        tipo: "tem-direito",
        emoji: "✅",
        titulo: "Há indicação de possível direito ao benefício.",
        desc: "Como <strong>trabalhadora rural segurada especial</strong>, você tem direito ao salário-maternidade de <strong>1 salário mínimo por mês durante 120 dias</strong>, sem precisar pagar contribuição mensal ao INSS.",
        detalhe:
          "📋 Documentos necessários: RG, CPF, certidão de nascimento e <strong>comprovação da atividade rural</strong> (declaração do sindicato dos trabalhadores rurais, nota de produtor rural, contrato de arrendamento ou comprovante de residência rural). Solicite pelo app Meu INSS ou ligue para o 135.",
      };
    } else {
      return {
        tipo: "nao-tem-direito",
        emoji: "❌",
        titulo: "Não é possível confirmar o direito como segurada especial.",
        desc: "Para ter direito como trabalhadora rural segurada especial, é necessário comprovar o exercício de atividade rural para subsistência da família.",
        detalhe:
          "💡 Se você trabalha informalmente na roça mas não tem documentos, procure o sindicato de trabalhadores rurais do seu município — ele pode emitir uma declaração gratuitamente. Se sua situação for CLT, MEI ou outra, volte e selecione a categoria correta. Dúvidas: ligue para o 135.",
      };
    }
  }

  return {
    tipo: "nao-tem-direito",
    emoji: "🤔",
    titulo: "Não foi possível calcular.",
    desc: "Tente reiniciar e responder todas as perguntas novamente.",
    detalhe: "Se a dúvida persistir, ligue para o INSS pelo 135 — é gratuito.",
  };
}

function calcExibirResultado(res) {
  // Esconder painéis de etapas
  document
    .querySelectorAll(".calc-step-panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("calcStepsIndicator").style.display = "none";

  const box = document.getElementById("calcResultadoFinal");
  box.className = "calc-result-box show " + res.tipo;
  document.getElementById("calcEmoji").textContent = res.emoji;
  document.getElementById("calcTitulo").textContent = res.titulo;
  document.getElementById("calcDesc").innerHTML = res.desc;
  document.getElementById("calcDetalhe").innerHTML = res.detalhe;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function calcReiniciar() {
  calcEstado = {
    etapa: 1,
    perfil: null,
    clt_empregada: null,
    clt_tempo_desempregada: null,
    clt_dez_anos: null,
    clt_comprova_desemprego: null,
    auto_contribuiu: null,
    auto_contribuindo: null,
    auto_tempo_parada: null,
    auto_dez_anos: null,
    auto_comprova: null,
    des_tempo_parada: null,
    des_dez_anos: null,
    des_comprova: null,
    rural_atividade: null,
  };
  // Limpa resultado
  document.getElementById("calcResultadoFinal").classList.remove("show");
  document.getElementById("calcResultadoFinal").className = "calc-result-box";
  // Restaura indicador de etapas
  document.getElementById("calcStepsIndicator").style.display = "flex";
  // Limpa seleções da etapa 1
  document
    .querySelectorAll('input[name="e1_perfil"]')
    .forEach((r) => (r.checked = false));
  // Limpa conteúdo gerado das etapas 2 e 3
  const e2 = document.getElementById("etapa2-conteudo");
  const e3 = document.getElementById("etapa3-conteudo");
  if (e2) e2.innerHTML = "";
  if (e3) e3.innerHTML = "";
  // Limpa erros
  calcLimparErro("etapa-1");
  calcLimparErro("etapa-2");
  calcLimparErro("etapa-3");
  // Volta para etapa 1
  calcMostrarEtapa(1);
  calcAtualizarIndicador(1);
  // Scroll suave ao topo da calculadora
  document
    .getElementById("calculadora")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ========== COMPARTILHAR ========== */
function updateShareLinks() {
  const urlFixo = "https://seusdireitos.github.io/";
  const url = encodeURIComponent(urlFixo);
  const text = encodeURIComponent(
    "Descubra seus direitos ao Salário-Maternidade! 🍼",
  );

  const waBtn = document.querySelector(".share-btn.wa");
  const fbBtn = document.querySelector(".share-btn.fb");
  const twBtn = document.querySelector(".share-btn.tw");

  if (waBtn) waBtn.href = `https://wa.me/?text=${text}%20${url}`;
  if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  if (twBtn) twBtn.href = `https://x.com/intent/tweet?text=${text}&url=${url}`;
}

function copyLink() {
  const urlFixo = "https://seusdireitos.github.io/";
  if (navigator.clipboard) {
    navigator.clipboard.writeText(urlFixo);
  } else {
    const el = document.createElement("input");
    el.value = urlFixo;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
  mostrarToast("🔗 Link copiado com sucesso!");
}

/* ========== QUIZ ========== */
const allQuizData = [
  {
    q: "Uma trabalhadora CLT foi contratada hoje. Se tiver bebê amanhã, tem direito ao salário-maternidade?",
    opts: [
      "Sim, sem carência mínima",
      "Não, precisa de 6 meses de emprego",
      "Não, precisa ter contribuído antes",
    ],
    correct: 0,
    explain:
      "Trabalhadora CLT não precisa de carência! O benefício é garantido desde o primeiro dia de emprego.",
  },
  {
    q: "Quantos dias dura o salário-maternidade no prazo padrão?",
    opts: ["60 dias", "90 dias", "120 dias", "180 dias"],
    correct: 2,
    explain:
      "120 dias (4 meses) é o prazo padrão. Com o Programa Empresa Cidadã pode ser 180 dias!",
  },
  {
    q: "Com a queda da carência no STF, uma MEI precisa pagar o INSS por quantos meses antes do parto?",
    opts: [
      "Não há carência mínima; exige qualidade de segurada",
      "5 meses",
      "10 meses",
      "12 meses",
    ],
    correct: 0,
    explain:
      "Graças ao STF, não há mais exigência de 10 meses. A carência mínima foi afastada, mas é preciso comprovar a qualidade de segurada na data do evento.",
  },
  {
    q: "O pai pode receber o salário-maternidade?",
    opts: [
      "Nunca",
      "Sim, sempre que quiser",
      "Sim, em adoção ou falecimento da mãe",
    ],
    correct: 2,
    explain:
      "O pai tem direito em adoção (homem solteiro) e se a mãe falecer durante ou após o parto.",
  },
  {
    q: "Qual o prazo máximo do Período de Graça com +10 anos de INSS e comprovação de desemprego?",
    opts: ["12 meses", "24 meses", "36 meses, conforme os requisitos"],
    correct: 2,
    explain:
      "Até 36 meses (3 anos) de proteção principal, A data exata de perda da qualidade depende das regras legais de contagem e vencimento da contribuição; confirme com o INSS.",
  },
  {
    q: "O que acontece em caso de natimorto (bebê que nasce sem vida)?",
    opts: [
      "Nenhum benefício",
      "2 semanas de repouso",
      "120 dias de benefício completo",
    ],
    correct: 2,
    explain:
      "A lei garante os 120 dias completos em caso de natimorto. Exige atestado médico.",
  },
  {
    q: "Quem paga o salário-maternidade para uma trabalhadora CLT?",
    opts: [
      "O INSS diretamente",
      "A empresa (que depois desconta do INSS)",
      "O sindicato da categoria",
    ],
    correct: 1,
    explain:
      "A empresa paga e depois desconta do INSS. O pedido é feito diretamente no RH.",
  },
  {
    q: "Uma grávida pode ser demitida durante a gestação?",
    opts: [
      "Sim, a qualquer momento",
      "Não, há estabilidade da gravidez até 5 meses após o parto",
      "Apenas por justa causa",
    ],
    correct: 1,
    explain:
      "A gestante tem estabilidade desde a confirmação da gravidez até 5 meses após o parto!",
  },
  {
    q: "Qual o prazo máximo que a lei dá para você pedir o benefício após o nascimento?",
    opts: ["Até 120 dias", "Até 1 ano", "Até 5 anos (prescrição quinquenal)"],
    correct: 2,
    explain:
      "A lei prevê que o benefício pode ser solicitado até 5 anos após a data do parto ou adoção.",
  },
  {
    q: "Trabalhadora rural (segurada especial) recebe quanto de benefício?",
    opts: [
      "R$ 500 fixos mensais",
      "Um salário mínimo por mês",
      "Calculado pela média das contribuições",
    ],
    correct: 1,
    explain:
      "A trabalhadora rural segurada especial recebe um salário mínimo por mês durante os 120 dias.",
  },
];
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
let quizData = [],
  qCurrent = 0,
  qScore = 0,
  qAnswered = false;
function initQuiz() {
  quizData = shuffle(allQuizData).slice(0, 10);
  qCurrent = 0;
  qScore = 0;
}
function renderQuiz() {
  const q = quizData[qCurrent];
  qAnswered = false;
  document.getElementById("quizCounter").textContent =
    `Pergunta ${qCurrent + 1} de ${quizData.length}`;
  document.getElementById("quizScoreLive").textContent =
    `⭐ ${qScore}/${quizData.length}`;
  document.getElementById("quizFill").style.width =
    `${(qCurrent / quizData.length) * 100}%`;
  document.getElementById("quizQ").textContent = q.q;
  const letters = ["A", "B", "C", "D"];
  document.getElementById("quizOpts").innerHTML = q.opts
    .map(
      (o, i) =>
        `<button type="button" class="quiz-btn" onclick="qAnswer(${i})" id="qbtn${i}"><span class="q-letter">${letters[i]}</span>${o}</button>`,
    )
    .join("");
  document.getElementById("quizResult").className = "quiz-result";
  document.getElementById("quizResult").textContent = "";
  document.getElementById("quizNav").innerHTML =
    `<button type="button" class="btn-secondary" id="qnextBtn" onclick="${qCurrent < quizData.length - 1 ? "qNext()" : "qShowResult()"}" style="display:none">${qCurrent < quizData.length - 1 ? "Próxima ➜" : "Ver resultado 🎉"}</button>`;
}
function qAnswer(idx) {
  if (qAnswered) return;
  qAnswered = true;
  const q = quizData[qCurrent];
  document.querySelectorAll(".quiz-btn").forEach((b) => (b.disabled = true));
  document.getElementById(`qbtn${q.correct}`).classList.add("correct");
  if (idx !== q.correct)
    document.getElementById(`qbtn${idx}`).classList.add("wrong");
  else qScore++;
  document.getElementById("quizScoreLive").textContent =
    `⭐ ${qScore}/${quizData.length}`;
  const resultDiv = document.getElementById("quizResult");
  resultDiv.textContent = (idx === q.correct ? "✅ " : "❌ ") + q.explain;
  resultDiv.className = `quiz-result show ${idx === q.correct ? "ok" : "fail"}`;
  document.getElementById("qnextBtn").style.display = "inline-flex";
}
function qNext() {
  qCurrent++;
  renderQuiz();
}
function qShowResult() {
  const medals = [
    "😢",
    "😕",
    "🙂",
    "😊",
    "😎",
    "🥇",
    "🏆",
    "🌟",
    "🎖️",
    "🏅",
    "👑",
  ];
  const msg =
    qScore === 10
      ? "Perfeito! Você é especialista em direitos previdenciários!"
      : qScore >= 7
        ? "Excelente! Você conhece muito bem seus direitos!"
        : qScore >= 5
          ? "Bom trabalho! Vale reler alguns tópicos."
          : "📚 Que tal reler o conteúdo? Você vai melhorar!";

  const urlFixo = "https://seusdireitos.github.io/";
  const textoQuiz = encodeURIComponent(
    `Fiz o quiz sobre Direitos Previdenciários e acertei ${qScore} de 10! Teste também acessando o link: `,
  );

  document.getElementById("quizBox").innerHTML =
    `<div style="text-align:center"><div class="quiz-medal">${medals[qScore] || "👑"}</div><div class="quiz-score-big">${qScore}<span style="font-size:2rem;opacity:0.6"> / 10</span></div><p style="font-size:1.15rem;font-weight:800;margin:10px 0 8px">${msg}</p><p style="opacity:0.75;font-size:0.9rem;margin-bottom:24px">Você acertou ${Math.round((qScore / 10) * 100)}% das perguntas!</p><p style="opacity:0.6;font-size:0.8rem;margin-bottom:20px">🔀 As perguntas são embaralhadas a cada tentativa!</p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button type="button" class="btn-primary" onclick="qRestart()">🔄 Tentar novamente</button><a class="btn-secondary" href="https://wa.me/?text=${textoQuiz}${urlFixo}" target="_blank" rel="noopener noreferrer">💬 Compartilhar</a></div></div>`;
}
function qRestart() {
  initQuiz();
  document.getElementById("quizBox").innerHTML =
    `<div class="quiz-header"><div class="quiz-counter" id="quizCounter"></div><div class="quiz-score-live" id="quizScoreLive"></div></div><div class="quiz-progress-bar"><div class="quiz-progress-fill" id="quizFill" style="width:0%"></div></div><p style="text-align:center;font-size:0.78rem;opacity:0.55;margin-bottom:16px;">🔀 Perguntas embaralhadas!</p><div class="quiz-question" id="quizQ"></div><div class="quiz-options" id="quizOpts"></div><div class="quiz-result" id="quizResult"></div><div class="quiz-nav" id="quizNav"></div>`;
  renderQuiz();
}

/* ========== SCROLL ANIMATIONS + COUNTERS ========== */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        if (
          !countersStarted &&
          e.target.closest &&
          e.target.closest(".stats-bar")
        ) {
          countersStarted = true;
          animateCounters();
        }
      }
    });
  },
  { threshold: 0.08 },
);
document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
setTimeout(() => {
  const stats = document.querySelector(".stats-bar");
  if (
    stats &&
    stats.getBoundingClientRect().top < window.innerHeight &&
    !countersStarted
  ) {
    countersStarted = true;
    animateCounters();
  }
}, 500);

updateShareLinks();
initQuiz();
renderQuiz();

/* ========== LGPD ========== */
function fecharLGPD(aceito) {
  const banner = document.getElementById("lgpd-banner");
  if (banner) {
    banner.style.animation = "none";
    banner.style.transition = "opacity 0.4s, transform 0.4s";
    banner.style.opacity = "0";
    banner.style.transform = "translateY(100%)";
    setTimeout(() => banner.remove(), 400);
  }
  if (aceito) mostrarToast("✅ Preferências salvas. Obrigado!");
  try {
    localStorage.setItem("lgpd_ok", "1");
  } catch (e) {}
}

/* Oculta banner se já aceito */
(function () {
  try {
    if (localStorage.getItem("lgpd_ok")) {
      const b = document.getElementById("lgpd-banner");
      if (b) b.remove();
    }
  } catch (e) {}
})();

/* ========== TOAST ========== */
let toastTimer = null;
function mostrarToast(msg, dur = 3000) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), dur);
}

/* ========== CHECKLIST POR PERFIL ========== */
const CHECKLIST_KEY = "salmat_checklist_v2";

// Itens comuns a todos os perfis
const itensComuns = [
  { id: "c0", label: "🪪 RG e CPF em mãos (originais e uma cópia)" },
  {
    id: "c1",
    label:
      "📄 Certidão de Nascimento do bebê — necessária após o parto (ou Termo de Adoção / Guarda para adoção)",
  },
  {
    id: "c2",
    label: "📱 App Meu INSS instalado e login com conta gov.br funcionando",
  },
  {
    id: "c3",
    label:
      "🧮 Calculadora desta página preenchida — sei se tenho direito e meu prazo",
  },
  {
    id: "c4",
    label: "📞 Confirmei minha situação pelo 135 ou pelo app Meu INSS",
  },
  {
    id: "c5",
    label:
      "🗂️ Protocolo de solicitação gerado e salvo (printscreen ou impressão)",
  },
];

// Itens específicos por perfil
const itensPorPerfil = {
  clt: {
    desc: "✅ Mostrando checklist para <strong>empregada CLT</strong> — sem carência, benefício pago pela empresa. Itens exclusivos para CLT + itens comuns abaixo.",
    itens: [
      {
        id: "clt0",
        label: "👩‍💼 Carteira de Trabalho (CTPS) — original e cópia",
      },
      {
        id: "clt1",
        label:
          "📃 Último contracheque ou holerite (comprova o salário que você vai receber)",
      },
      {
        id: "clt2",
        label:
          "🏢 Avisei o RH da empresa sobre a licença-maternidade antes ou logo após o parto",
      },
    ],
  },
  mei: {
    desc: "✅ Mostrando checklist para <strong>MEI / Autônoma</strong> — benefício pago pelo INSS. Itens exclusivos para MEI + itens comuns abaixo.",
    itens: [
      {
        id: "mei0",
        label:
          "🧾 Comprovante de pagamento do DAS/Guia do INSS (para conferir a situação contributiva no evento)",
      },
      {
        id: "mei1",
        label:
          "📊 Extrato CNIS no app Meu INSS para confirmar a contribuição ativa",
      },
      {
        id: "mei2",
        label: "💳 CNPJ MEI ativo (verifique no Portal do Empreendedor)",
      },
    ],
  },
  rural: {
    desc: "✅ Mostrando checklist para <strong>trabalhadora rural (segurada especial)</strong> — sem carência mensal, benefício de 1 salário mínimo. Itens exclusivos para rural + itens comuns abaixo.",
    itens: [
      {
        id: "rur0",
        label:
          "🌾 Declaração de atividade rural emitida pelo Sindicato dos Trabalhadores Rurais (gratuita)",
      },
      {
        id: "rur1",
        label:
          "📋 Nota fiscal de produtor rural, contrato de arrendamento ou comprovante de vínculo rural (qualquer um que comprove a atividade)",
      },
      {
        id: "rur2",
        label:
          "🏡 Comprovante de endereço rural (conta de luz, água ou declaração de residência)",
      },
    ],
  },
  desempregada: {
    desc: "✅ Mostrando checklist para <strong>desempregada (período de graça)</strong> — verifique seu prazo antes de solicitar. Itens exclusivos + itens comuns abaixo.",
    itens: [
      {
        id: "des0",
        label:
          "📅 Calculadora preenchida — confirmei que ainda estou dentro do período de graça",
      },
      {
        id: "des1",
        label:
          "📃 Carteira de Trabalho (CTPS) com a baixa (anotação da demissão) — obrigatória",
      },
      {
        id: "des2",
        label:
          "📝 Rescisão de contrato assinada (Termo de Rescisão ou TRCT) — obrigatória",
      },
      {
        id: "des3",
        label:
          "💰 Documentos do Seguro-Desemprego, se tiver recebido (ampliam o período base de proteção para até 36 meses, mais 1 mês e 15 dias de tolerância)",
      },
      {
        id: "des4",
        label:
          "📊 Extrato CNIS no app Meu INSS — comprova o histórico de contribuições para o INSS calcular o prazo correto",
      },
    ],
  },
  adocao: {
    desc: "✅ Mostrando checklist para <strong>adoção / guarda judicial</strong> — válido para qualquer configuração familiar. Itens exclusivos + itens comuns abaixo.",
    itens: [
      {
        id: "ado0",
        label:
          "⚖️ Termo de Guarda Judicial para fins de adoção OU Termo de Adoção — emitido pela Vara da Infância e Juventude (obrigatório)",
      },
      {
        id: "ado1",
        label:
          "🏛️ Decisão/Sentença judicial que concedeu a guarda (geralmente acompanha o Termo)",
      },
      {
        id: "ado2",
        label:
          "📄 Certidão de nascimento do(a) adotado(a) (original ou cópia autenticada)",
      },
      {
        id: "ado3",
        label:
          "👨‍👧 Em casal (qualquer configuração): decidimos qual dos responsáveis vai solicitar os 120 dias — apenas um pode pedir",
      },
      {
        id: "ado4",
        label:
          "🏳️‍🌈 Em casal homoafetivo ou família trans: consultei a Defensoria Pública ou advogado em caso de dificuldades com o INSS",
      },
    ],
  },
};

let perfilChecklist = "clt";

function selecionarPerfilChecklist(perfil, btn) {
  perfilChecklist = perfil;
  // Atualiza botões ativos
  document
    .querySelectorAll(".checklist-perfil-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  // Salva perfil escolhido
  try {
    localStorage.setItem("salmat_perfil_checklist", perfil);
  } catch (e) {}
  renderChecklist();
}

function renderChecklist() {
  const container = document.getElementById("checklistItems");
  const desc = document.getElementById("checklist-perfil-desc");
  if (!container) return;

  const cfg = itensPorPerfil[perfilChecklist] || itensPorPerfil.clt;
  if (desc) desc.innerHTML = cfg.desc;

  // Carrega marcações salvas
  let saved = [];
  try {
    saved = JSON.parse(
      localStorage.getItem(CHECKLIST_KEY + "_" + perfilChecklist) || "[]",
    );
  } catch (e) {}

  const todosItens = [...cfg.itens, ...itensComuns];
  container.innerHTML =
    '<p style="font-size:0.78rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;opacity:0.55;margin-bottom:8px;">📌 Documentos específicos do seu perfil</p>' +
    cfg.itens
      .map((item) => {
        const checked = saved.includes(item.id);
        return `<div class="check-item${checked ? " checked" : ""}" data-id="${item.id}" onclick="toggleCheck(this)">
        <div class="check-box">${checked ? "✓" : ""}</div>
        <span class="check-label">${item.label}</span>
      </div>`;
      })
      .join("") +
    '<p style="font-size:0.78rem;font-weight:800;letter-spacing:1px;text-transform:uppercase;opacity:0.55;margin:16px 0 8px;">📋 Documentos comuns a todos os perfis</p>' +
    itensComuns
      .map((item) => {
        const checked = saved.includes(item.id);
        return `<div class="check-item${checked ? " checked" : ""}" data-id="${item.id}" onclick="toggleCheck(this)">
        <div class="check-box">${checked ? "✓" : ""}</div>
        <span class="check-label">${item.label}</span>
      </div>`;
      })
      .join("");

  atualizarProgressoChecklist();
}

function salvarChecklist() {
  try {
    const checked = [...document.querySelectorAll(".check-item.checked")].map(
      (el) => el.dataset.id,
    );
    localStorage.setItem(
      CHECKLIST_KEY + "_" + perfilChecklist,
      JSON.stringify(checked),
    );
  } catch (e) {}
}

function toggleCheck(el) {
  el.classList.toggle("checked");
  const cb = el.querySelector(".check-box");
  if (cb) cb.textContent = el.classList.contains("checked") ? "✓" : "";
  salvarChecklist();
  atualizarProgressoChecklist();
}

function atualizarProgressoChecklist() {
  const total = document.querySelectorAll(".check-item").length;
  const done = document.querySelectorAll(".check-item.checked").length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const bar = document.getElementById("checklistBar");
  const pctEl = document.getElementById("checklistPct");
  if (bar) bar.style.width = pct + "%";
  if (pctEl) pctEl.textContent = pct + "%";
  if (pct === 100)
    mostrarToast("🎉 Checklist 100%! Você está pronta para solicitar!", 4000);
}

function resetChecklist() {
  document.querySelectorAll(".check-item").forEach((el) => {
    el.classList.remove("checked");
    const cb = el.querySelector(".check-box");
    if (cb) cb.textContent = "";
  });
  try {
    localStorage.removeItem(CHECKLIST_KEY + "_" + perfilChecklist);
  } catch (e) {}
  atualizarProgressoChecklist();
  mostrarToast("↺ Marcações limpas.");
}

// Inicializa: restaura perfil salvo e renderiza
(function inicializarChecklist() {
  try {
    const salvo = localStorage.getItem("salmat_perfil_checklist");
    if (salvo && itensPorPerfil[salvo]) {
      perfilChecklist = salvo;
      const btn = document.querySelector(
        `.checklist-perfil-btn[data-perfil="${salvo}"]`,
      );
      document
        .querySelectorAll(".checklist-perfil-btn")
        .forEach((b) => b.classList.remove("active"));
      if (btn) btn.classList.add("active");
    }
  } catch (e) {}
  renderChecklist();
})();

/* ========== VLIBRAS ========== */
let vlibrasAtivo = false;

/* Observa quando o painel do VLibras abre e o reposiciona para o canto inferior direito */
function observarPainelVLibras() {
  const config = {
    attributes: true,
    attributeFilter: ["class", "style"],
    subtree: true,
  };
  const obs = new MutationObserver(() => {
    const wrapper =
      document.querySelector("[vw-plugin-wrapper]") ||
      document.querySelector(".vw-plugin-wrapper");
    if (!wrapper) return;

    const setWidgetStyle = (name, value, priority) => {
      if (
        wrapper.style.getPropertyValue(name) !== value ||
        wrapper.style.getPropertyPriority(name) !== priority
      )
        wrapper.style.setProperty(name, value, priority);
    };
    /* Quando o painel está visível (VLibras adiciona classe ativa), reposiciona */
    setWidgetStyle("position", "fixed", "important");
    setWidgetStyle("bottom", "0", "important");
    setWidgetStyle("right", "0", "important");
    setWidgetStyle("left", "auto", "important");
    setWidgetStyle("top", "auto", "important");
    setWidgetStyle("transform", "none", "important");
    setWidgetStyle("z-index", "9000", "important");
    setWidgetStyle("max-width", "100vw", "important");
  });

  const root = document.querySelector("[vw]");
  if (root) obs.observe(root, config);
}
observarPainelVLibras();

function ativarVLibras() {
  const btn = document.querySelector("[vw-access-button]");
  if (!btn) {
    mostrarToast("⚠️ VLibras ainda carregando. Aguarde um instante.");
    return;
  }
  /* Torna clicável momentaneamente fora da área visível */
  btn.style.cssText =
    "display:block!important;visibility:visible!important;opacity:0!important;position:fixed!important;top:-9999px!important;left:-9999px!important;";
  btn.click();
  setTimeout(() => {
    btn.style.cssText =
      "display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;";
  }, 150);
  vlibrasAtivo = !vlibrasAtivo;
  const a11yBtn = document.querySelector('.a11y-btn[onclick*="ativarVLibras"]');
  if (a11yBtn) a11yBtn.classList.toggle("active", vlibrasAtivo);
  mostrarToast(vlibrasAtivo ? "🤟 VLibras ativado!" : "🤟 VLibras desativado.");
}
