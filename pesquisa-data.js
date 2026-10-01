/* Transcrição agregada conferida com as páginas 1–5 do PDF fornecido.
 * Contagens das pizzas reconstruídas a partir do total e dos percentuais.
 * Não contém microdados e não permite cruzar perfis entre perguntas. */
(function(root){
  const question=(id,group,title,n,page,rows,extra={})=>({id,group,title,n,page,rows:rows.map(([label,count])=>({label,count})),...extra});
  const data={total:17,source:'assets/docs/pesquisa-campo.pdf',groups:[['conhecimento','Conhecimento'],['perfil','Quem respondeu'],['experiencia','Experiências'],['opiniao','Opiniões']],questions:[
    question('conhecimento','conhecimento','Você já ouviu falar sobre o salário-maternidade?',17,2,[['Sim, conheço bem',4],['Sim, já ouvi falar, mas sei pouco',7],['Já ouvi, mas não sei o que é',4],['Não, nunca ouvi falar',2]],{insight:'13 de 17 participantes não disseram conhecer bem o benefício. Esse resultado reforça a importância de explicar o assunto de forma acessível.'}),
    question('direito','conhecimento','Na sua opinião, quem tem direito ao salário-maternidade?',17,3,[['Empregada com carteira…',12],['Trabalhadora rural',7],['Pai ou responsável adota…',5],['Trabalhadora autônoma o…',6],['Mulher desempregada (e…',8],['Somente mães biológicas',3],['Não sei',2]],{multiple:true,insight:'A opção referente à empregada com carteira foi a mais lembrada: 12 marcações. Os demais perfis receberam menos marcações.',note:'Era possível marcar várias opções: são 43 marcações de 17 pessoas. Cada percentual usa 17 como base; a soma pode ultrapassar 100%. Alguns rótulos foram cortados no PDF e estão reproduzidos com reticências. São opiniões dos participantes, não uma lista de requisitos legais.'}),
    question('duracao','conhecimento','Por quantos dias dura o salário-maternidade no prazo padrão?',17,3,[['30 dias (1 mês)',2],['60 dias (2 meses)',1],['120 dias (4 meses)',5],['180 dias (6 meses)',4],['Não sei',5]],{insight:'5 de 17 pessoas marcaram 120 dias. Outras 5 escolheram “Não sei”. Veja a explicação sobre duração na seção de regras.',link:['Ver as regras','index.html#regras']}),
    question('demissao','conhecimento','Se uma mulher é demitida durante a gravidez, ela perde imediatamente o direito ao benefício?',17,3,[['Sim, perde na hora da demissão',4],['Depende do motivo da demissão',4],['Não — há um prazo de proteção de até 3 anos',6],['Não sei',3]],{insight:'6 de 17 participantes escolheram a alternativa que menciona um prazo de proteção. Esse prazo depende da categoria e do histórico de contribuições.',note:'A alternativa “até 3 anos” é a redação do formulário. Não significa que todas as pessoas tenham 36 meses de proteção.',link:['Entender o período de graça','index.html#periodo-graca']}),
    question('idade','perfil','Faixa etária',17,1,[['Até 17 anos',0],['18–25 anos',5],['26–35 anos',3],['36–45 anos',4],['46–55 anos',2],['56 anos ou mais',3]]),
    question('sexo','perfil','Sexo',17,1,[['Feminino',13],['Masculino',4],['Outro / Prefere não dizer',0]]),
    question('escolaridade','perfil','Escolaridade',16,2,[['Fundamental',4],['Médio',6],['Superior',3],['Pós-graduação',3]],{note:'Esta pergunta teve 16 respostas: uma pessoa não respondeu.'}),
    question('ocupacao','perfil','Ocupação',17,2,[['Empregado(a) CLT',12],['Autônomo(a) / MEI',2],['Desempregado(a)',0],['Aposentado(a)',3]],{insight:'12 de 17 respondentes eram empregados CLT. Não houve resposta na opção “Desempregado(a)”, o que limita o alcance da pesquisa para esse público.'}),
    question('recebeu','experiencia','Você ou alguém próximo já recebeu o salário-maternidade?',17,4,[['Sim, eu mesma recebi',3],['Sim, alguém que conheço recebeu',2],['Não',10],['Não sei dizer',2]],{insight:'5 pessoas relataram experiência própria ou de alguém próximo com o benefício.'}),
    question('processo','experiencia','Como foi o processo de solicitação?',15,4,[['Fácil — consegui sem dificuldade',3],['Difícil — encontrei muitos obstáculos',0],['A empresa/INSS dificultou ou negou',1],['Não sei responder / Não se aplica',11]],{note:'A pergunta era destinada a quem respondeu “Sim” na anterior (5 pessoas), mas recebeu 15 respostas. Dessas, 11 foram “Não sei responder / Não se aplica”. Os resultados são exibidos como registrados; não representam uma taxa de dificuldade entre solicitantes.',insight:'3 respostas indicaram facilidade e 1 indicou dificuldade ou negativa da empresa/INSS. A inconsistência do encaminhamento exige cautela.'}),
    question('protecao','opiniao','O salário-maternidade é suficiente para garantir proteção à família nesse período?',16,5,[['Sim, é suficiente',1],['Parcialmente — poderia ser melhor',5],['Não, o valor e/ou prazo são insuficientes',2],['Não sei opinar',8]],{insight:'Metade das 16 pessoas que responderam não soube opinar. Outras 5 consideraram a proteção parcial.',note:'Esta pergunta teve 16 respostas: uma pessoa não respondeu.'})
  ],comments:[
    {theme:'Prazo e valor',text:'Aumentaria o prazo(sobre aumentar o valor nem coloco pois o salario minimo brasileiro nao e suficiente para uma familia se prover ai entraria em outra seara essa questão)'},
    {theme:'Mais informação',text:'Que seja disponibilizado mais informações sobre'},
    {theme:'Valor',text:'Aumentar o valor'},
    {theme:'Não se aplica',text:'Nao se allica'},
    {theme:'Mais informação',text:'Ser te ampla divulgação'},
    {theme:'Mais informação',text:'Divulgaria mais'}
  ]};
  root.PesquisaData=data;
  if(typeof module!=='undefined')module.exports=data;
})(typeof window!=='undefined'?window:globalThis);
