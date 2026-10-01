/* Interpretador local e recuperação de trechos. Sem API e sem texto jurídico gerado. */
(function (root) {
  "use strict";
  const normalize = (s) =>
    String(s)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const stop = new Set(
    "a o os as um uma de da do dos das em no na nos nas e eu voce me meu minha tem tenho que qual quais como por para pelo pela estou to ta foi ser isso esse essa quero saber sobre direito salario maternidade posso receber preciso".split(
      " ",
    ),
  );
  const synonyms = {
    documentos: ["documento", "papeis", "papel", "preciso levar", "certidao"],
    valor: [
      "quanto recebo",
      "quanto vou receber",
      "dinheiro",
      "pagamento",
      "valor",
    ],
    duracao: ["quanto tempo dura", "quantos dias", "duracao", "120 dias"],
    pedido: [
      "como pedir",
      "como solicitar",
      "dar entrada",
      "requerer",
      "solicitar",
      "pedido",
    ],
    graca: [
      "parei de pagar",
      "parei de contribuir",
      "sem contribuir",
      "demitida",
      "mandaram embora",
      "desempregada",
      "periodo de graca",
    ],
    mei: ["mei", "autonoma", "das", "conta propria"],
    rural: ["rural", "roca", "campo", "agricultora"],
    adocao: ["adotei", "adotar", "adocao", "guarda"],
    estabilidade: [
      "demissao",
      "demitida gravida",
      "estabilidade",
      "mandou embora gravida",
    ],
    localizador: [
      "uba",
      "agencia",
      "endereco",
      "onde fica",
      "atendimento presencial",
    ],
    carencia: [
      "carencia",
      "quantas contribuicoes",
      "10 meses",
      "uma contribuicao",
    ],
    homens: ["pai", "paternidade", "homem", "homens", "homoafetivo", "trans"],
    empresa: ["empresa cidada", "180 dias"],
    negativa: ["negou", "negado", "indeferido", "recurso", "nao recebi"],
    perda: ["aborto", "natimorto", "perdi meu bebe"],
    glossario: ["significa", "cnis"],
  };
  function tokens(s) {
    let n = normalize(s);
    for (const [key, alts] of Object.entries(synonyms))
      if (alts.some((a) => n.includes(a))) n += " " + key;
    return [
      ...new Set(n.split(" ").filter((w) => w.length > 2 && !stop.has(w))),
    ];
  }
  function distance(a, b) {
    let row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const next = [i];
      for (let j = 1; j <= b.length; j++)
        next[j] = Math.min(
          next[j - 1] + 1,
          row[j] + 1,
          row[j - 1] + (a[i - 1] !== b[j - 1]),
        );
      row = next;
    }
    return row[b.length];
  }
  function rank(query, docs, profile) {
    const q = tokens(query),
      N = docs.length;
    return docs
      .map((d) => {
        const dt = tokens(d.title + " " + d.text),
          title = tokens(d.title);
        let hits = 0,
          score = 0;
        for (const t of q) {
          let match = dt.includes(t);
          if (!match && t.length >= 4)
            match = dt.some(
              (w) =>
                w.length >= 4 &&
                Math.abs(w.length - t.length) <= 1 &&
                distance(t, w) <= 1,
            );
          if (match) {
            hits++;
            const df = docs.filter((x) =>
              tokens(x.title + " " + x.text).includes(t),
            ).length;
            score +=
              Math.log(1 + (N - df + 0.5) / (df + 0.5)) *
              (title.includes(t) ? 2.4 : 1);
          }
        }
        const n = normalize(query);
        if (
          /como (pedir|solicitar)|dar entrada/.test(n) &&
          d.id === "como-pedir"
        )
          score += 10;
        if (
          /adotei|adocao|adotar/.test(n) &&
          /adot|adoc/.test(normalize(d.title))
        )
          score += 5;
        if (/document/.test(n) && d.id === "acc3") score += 8;
        if (/empresa cidada/.test(n) && d.id === "acc5") score += 7;
        if (/document/.test(n) && /document/.test(normalize(d.title)))
          score += 3;
        if (profile && normalize(d.title).includes(profile)) score += 0.3;
        return { ...d, score, hits, coverage: q.length ? hits / q.length : 0 };
      })
      .filter((x) => x.hits > 0)
      .sort((a, b) => b.score - a.score);
  }
  const numbers = {
    um: 1,
    uma: 1,
    dois: 2,
    duas: 2,
    tres: 3,
    quatro: 4,
    cinco: 5,
    seis: 6,
    sete: 7,
    oito: 8,
    nove: 9,
    dez: 10,
    onze: 11,
    doze: 12,
  };
  function facts(input) {
    const n = normalize(input),
      f = {};
    if (
      /\b(mei|autonoma|conta propria)\b/.test(n) &&
      !/nao sou (mei|autonoma)/.test(n)
    )
      f.profile = "mei";
    if (/\b(rural|roca|agricultora|campo)\b/.test(n)) f.profile = "rural";
    if (
      /carteira assinada|\bclt\b|empregada registrada/.test(n) &&
      !/sem carteira|nao tenho carteira/.test(n)
    )
      f.profile = "clt";
    if (
      /desempregad|demitid|mandar\w* embora|sem emprego/.test(n) &&
      !/nao (estou|sou) desempregada/.test(n)
    )
      f.profile = "desempregada";
    if (/gravid|gestante/.test(n) && !/nao (estou|to|sou) gravida/.test(n))
      f.event = "gravidez";
    if (/bebe nasceu|filh[oa] nasceu|ja nasceu|dei a luz/.test(n))
      f.event = "parto";
    if (/adotei|adocao|guarda para/.test(n)) f.event = "adoção";
    if (/parei.*(pagar|contribuir)|nao pago|nao contribuo/.test(n))
      f.contributing = false;
    else if (/pago.*(das|inss)|contribuo|pagando/.test(n))
      f.contributing = true;
    const m =
      n.match(
        /(?:faz|ha|uns|cerca de|parei|demitida)\s*(\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze)\s*(mes|meses|ano|anos)/,
      ) ||
      n.match(
        /^(\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze)\s*(mes|meses|ano|anos)$/,
      );
    if (
      m &&
      (/demit|sem emprego|parei|sem contribuir/.test(n) ||
        /^\w+ (mes|meses|ano|anos)$/.test(n))
    )
      f.months =
        (numbers[m[1]] || Number(m[1])) * (m[2].startsWith("ano") ? 12 : 1);
    return f;
  }
  function sensitive(s) {
    const n = normalize(s);
    if (/violencia|agredid|ameaca|apanh|perigo agora/.test(n))
      return "violencia";
    if (/perdi (meu|o) bebe|aborto|natimorto/.test(n)) return "perda";
    if (
      /negou|negado|indeferid|discrimin|nao tenho dinheiro.*advog|empresa fechou|demitida.*gravid|mand.*embora.*gravid/.test(
        n,
      )
    )
      return "atendimento";
    return null;
  }
  class Engine {
    constructor(docs) {
      this.docs = docs;
      this.context = {};
      this.pending = null;
      this.lastQuery = "";
      this.lastResults = [];
    }
    reset() {
      this.context = {};
      this.pending = null;
      this.lastQuery = "";
      this.lastResults = [];
      this.waiting = null;
    }
    ask(input) {
      const n = normalize(input);
      if (!n) return { text: "Escreva sua dúvida ou escolha um assunto." };
      if (/\b\d{11}\b|\b\d{3} \d{3} \d{3} \d{2}\b|minha senha|meu cpf/.test(n))
        return {
          text: "Não preciso de CPF, senha ou dados bancários. Faça sua pergunta sem esses dados.",
        };
      if (/^(reiniciar|recomecar|nova conversa|limpar)$/.test(n)) {
        this.reset();
        return {
          text: "Vamos começar de novo. Qual é a sua dúvida?",
          suggest: ["Tenho direito?", "Como pedir?", "Quais documentos?"],
        };
      }
      const risk = sensitive(input);
      if (risk)
        return {
          text:
            risk === "violencia"
              ? "Sua segurança vem primeiro. Em perigo imediato, ligue 190. Para orientação sobre violência contra a mulher, ligue 180."
              : risk === "perda"
                ? "Sinto muito pela sua perda. Há regras diferentes para aborto não criminoso e natimorto. Você pode consultar a explicação do site e confirmar os documentos com o INSS."
                : "Essa situação precisa de análise individual. Separe a decisão do INSS ou os documentos da empresa. O 135 orienta sobre benefícios; para questões trabalhistas ou discriminação, procure orientação jurídica.",
          links:
            risk === "violencia"
              ? [
                  ["Ligar 190", "tel:190"],
                  ["Ligar 180", "tel:180"],
                ]
              : [
                  ["INSS — 135", "tel:135"],
                  ["Atendimento em Ubá", "#localizador"],
                  [
                    "Orientação jurídica gratuita",
                    "https://www.defensoria.mg.def.br/",
                  ],
                ],
          suggest: [
            "E em caso de aborto ou natimorto?",
            "Como fazer o pedido?",
          ],
        };
      if (this.pending) {
        if (/^(sim|isso|correto|confirmo|certo)$/.test(n)) {
          Object.assign(this.context, this.pending);
          this.pending = null;
          return this.next();
        }
        if (/^(nao|corrigir|errado)$/.test(n)) {
          this.pending = null;
          return {
            text: "Conte novamente sua situação, indicando o que precisa corrigir.",
          };
        }
        this.pending = null;
      }
      let f = facts(input);
    if (this.waiting === "contributing" && n === "nao sei") return { text: "Você pode conferir os pagamentos no CNIS ou perguntar ao INSS pelo 135. Para continuar, escolha o assunto que deseja consultar.", suggest: ["Documentos", "Como pedir?"], links: [["Meu INSS", "https://meu.inss.gov.br/"], ["INSS — 135", "tel:135"]] };
    if (this.waiting === "contributing" && /^(sim|pago|estou pagando)$/.test(n)) f.contributing = true;
    if (this.waiting === "contributing" && /^(nao|parei|nao pago)$/.test(n)) f.contributing = false;
      if (this.waiting === "months" && !("months" in f)) {
        const m = n.match(/^(\d+)$/);
        if (m) f.months = Number(m[1]);
      }
      if (Object.keys(f).length >= 2) {
        this.pending = f;
        this.lastQuery = input;
        return {
          text:
            "Só para confirmar o que entendi:\n" +
            this.describe(f) +
            "\nEstá correto? Os tempos são aproximados e não calculam a data de perda da proteção.",
          suggest: ["Sim", "Corrigir"],
        };
      }
      Object.assign(this.context, f);
      if (
        /^(tenho direito|tenho direito ao beneficio|posso receber salario maternidade)$/.test(
          n,
        )
      )
        return this.next();
      if (/^(oi|ola|bom dia|boa tarde|boa noite)$/.test(n))
        return {
          text: "Olá! Sou a Duda, ajuda automática do site. Pode escrever sua pergunta do seu jeito.",
          suggest: [
            "Estou desempregada",
            "Sou MEI",
            "Como pedir?",
            "Quais documentos?",
          ],
        };
      if (/obrigad/.test(n))
        return {
          text: "Por nada! Você pode continuar perguntando ou abrir seu resumo.",
        };
      if (/nao entendi|mais simples|complicado/.test(n))
        return {
          text: "Vamos por partes. O benefício ajuda quem precisa se afastar por nascimento, adoção ou outras situações previstas. Precisamos conferir a proteção do INSS na data do evento. Você trabalha com carteira, é MEI, trabalha no campo ou está desempregada?",
          suggest: [
            "Carteira assinada",
            "Sou MEI",
            "Trabalho na roça",
            "Estou desempregada",
          ],
        };
      if (
        Object.keys(f).length &&
        !/\?|direito|posso|quanto|document|como|receber/.test(n) &&
        tokens(input).filter(
          (x) =>
            ![
              "mei",
              "graca",
              "rural",
              "gravida",
              "demitida",
              "desempregada",
              "meses",
              "anos",
            ].includes(x),
        ).length < 4
      )
        return this.next();
      const follow =
        /^(e )?(o valor|quanto|documentos|quais documentos|como pedir|e depois|mais detalhes)\b/.test(
          n,
        );
      const query =
        input +
        (follow && this.context.profile ? " " + this.context.profile : "");
      const results = rank(query, this.docs, this.context.profile);
      this.lastQuery = query;
      this.lastResults = results;
      if (!results.length || results[0].coverage < 0.34)
        return {
          text: "Não encontrei uma resposta segura para essa pergunta no site. Tente indicar o assunto ou escolha uma opção. Não consigo responder sobre temas que o site não aborda.",
          suggest: [
            "Tenho direito?",
            "Documentos",
            "Como pedir?",
            "Atendimento em Ubá",
          ],
        };
      if (
        results[1] &&
        results[0].score - results[1].score < 0.7 &&
        results[0].section !== results[1].section
      )
        return {
          text: "Encontrei mais de um assunto possível. Qual deles você quer consultar?",
          choices: results.slice(0, 3),
        };
      return {
        text: "Encontrei esta informação no site:",
        docs: results.slice(0, 1),
        related: results.slice(1, 3),
      };
    }
    describe(c = this.context) {
      return (
        [
          c.profile && "Situação: " + c.profile,
          c.event && "Evento: " + c.event,
          c.months != null &&
            "Tempo informado sem trabalhar/contribuir: aproximadamente " +
              c.months +
              " meses",
          c.contributing != null &&
            "Contribui atualmente: " + (c.contributing ? "sim" : "não"),
        ]
          .filter(Boolean)
          .join("\n") || "Você ainda não informou sua situação."
      );
    }
    next() {
      const c = this.context;
      if (!c.profile)
        return {
          text: "Qual é sua situação de trabalho?",
          suggest: [
            "Carteira assinada",
            "Sou MEI",
            "Trabalho na roça",
            "Estou desempregada",
          ],
        };
      if (c.profile === "mei" && c.contributing == null) { this.waiting = "contributing"; return { text: "Você está pagando o DAS ou contribuindo para o INSS atualmente?", suggest: ["Sim", "Não", "Não sei"] }; }
      if (
        (c.profile === "desempregada" || c.contributing === false) &&
        c.months == null
      ) {
        this.waiting = "months";
        return {
          text: "Há quanto tempo você parou de trabalhar ou contribuir? Pode escrever “8 meses”, por exemplo.",
        };
      }
      this.waiting = null;
      if (!c.event)
        return {
          text: "Você está grávida, seu bebê já nasceu ou é uma adoção?",
          suggest: ["Estou grávida", "Meu bebê já nasceu", "Adoção"],
        };
      return {
        text:
          "O que você contou:\n" +
          this.describe() +
          "\n\nIsso serve para orientar a consulta, sem confirmar o benefício. A qualidade de segurada precisa ser verificada na data do evento; tempo aproximado não substitui CNIS e datas exatas.",
        suggest: [
          "Quais documentos?",
          "Como pedir?",
          "Período de graça",
          "Quanto vou receber?",
        ],
        links: [
          ["Abrir meu checklist", "#checklist"],
          ["Usar calculadora", "#calculadora"],
          ["Confirmar com INSS — 135", "tel:135"],
        ],
      };
    }
  }
  root.DudaEngine = { Engine, normalize, tokens, rank, facts, sensitive };
  if (typeof module !== "undefined") module.exports = root.DudaEngine;
})(typeof window !== "undefined" ? window : globalThis);
