# Site Salário-Maternidade — Duda

Abra index.html ou publique esta pasta inteira na hospedagem atual. Não precisa de npm, servidor de aplicação, API ou chave de IA. Ao atualizar, mantenha assets ao lado de index.html.

## Arquivos

- index.html: conteúdo, navegação e estrutura.
- assets/css/site.css: aparência original do portal.
- assets/css/duda.css: aparência e responsividade do chat.
- assets/js/site.js: calculadora, checklist, quiz e ferramentas originais.
- assets/js/duda-engine.js: interpretação de frases, contexto, confirmação, classificação e recuperação de trechos.
- assets/js/duda-ui.js: mensagens, campo de texto, favoritos, voz e integração com a página.

O HTML recebido fazia referência a fundo.png e 120X30.png, que não foram anexados. Preserve esses dois arquivos na raiz da hospedagem atual: os caminhos foram ajustados para continuar usando os originais. O mapa, fontes, ícones e VLibras dependem de conexão externa; a lógica do chat é local.

## Como a Duda responde

A Duda pesquisa os cards e textos da página em tempo de execução. Mudanças nesses textos entram automaticamente na pesquisa ao recarregar. Não usa IA generativa e não entende toda frase possível: usa sinônimos, comparação aproximada e pontuação de relevância. Quando há ambiguidade, apresenta assuntos; quando não encontra informação, informa o limite.

O contexto fica na memória da página. Favoritos guardam apenas identificadores de assuntos no localStorage. Mensagens não são enviadas a uma IA nem persistidas. Não peça CPF, senhas ou dados bancários pelo chat. A ocultação automática de dados pessoais cobre alguns padrões comuns, não todas as formas possíveis.

A calculadora continua sendo uma estimativa educativa por faixas, sem determinar a data exata de perda da qualidade de segurada. Triagem e resumos não confirmam concessão de benefício.

Ubá e arredores, as duas orientadoras e a identidade azul/amarela foram mantidos. O botão flutuante fica fora dos contêineres de conteúdo e o aviso fica fora da área rolável de mensagens. O acionador próprio do VLibras fica oculto, com acesso pelo controle de acessibilidade existente.

## Validação realizada

- Sintaxe dos três arquivos JavaScript verificada com node --check.
- Testes do interpretador: confirmação de desemprego/parto/oito meses, negação de gravidez, temas fora do site, dados pessoais, violência, CNIS com erro de digitação, documentos, duração e endereço.
- Referências locais de HTML/CSS revisadas, com ressalva dos dois arquivos de imagem originais não anexados.
- Não foi possível executar a inspeção visual no navegador: a instalação do navegador automatizado falhou no ambiente. Recomenda-se conferir o layout no celular e no navegador usado na hospedagem antes de substituir a versão pública.

## Fontes consultadas em 30/09/2026

- https://www.gov.br/inss/pt-br/direitos-e-deveres/salario-maternidade/salario-maternidade
- https://www.gov.br/inss/pt-br/saiba-mais/seus-direitos-e-deveres/qualidade-de-segurado

Foram ajustados textos sobre carência, qualidade de segurada e estimativas de período de graça. Esta entrega não equivale a auditoria integral de todas as hipóteses jurídicas do portal.
