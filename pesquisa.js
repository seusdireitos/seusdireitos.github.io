/* Interface de gráficos sem dependências externas. */
(function(){
'use strict';
const data=window.PesquisaData;
if(!data)return;
let savedMotion=false;try{savedMotion=localStorage.getItem('salmat_motion_paused')==='true';}catch(e){}
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches||savedMotion;
if(reduced)document.body.classList.add('research-motion-paused');
const number=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1});
const percentage=(count,n)=>number.format(count/n*100)+'%';
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;};
function animateCount(node){const target=Number(node.dataset.count),suffix=node.dataset.suffix||'';if(reduced){node.textContent=number.format(target)+suffix;return;}const start=performance.now();function frame(now){const t=Math.min((now-start)/900,1),ease=1-Math.pow(1-t,3);node.textContent=number.format(Number.isInteger(target)?Math.round(target*ease):Math.round(target*ease*10)/10)+suffix;if(t<1)requestAnimationFrame(frame);}requestAnimationFrame(frame);}
const counters=document.querySelectorAll('[data-count]');if('IntersectionObserver'in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animateCount(entry.target);io.unobserve(entry.target);}}),{threshold:.4});counters.forEach(n=>io.observe(n));}else counters.forEach(animateCount);
const $=id=>document.getElementById(id);if(!$('r-bars'))return;
const colors=['#2089c4','#e1ac2b','#145982','#6babc9','#608a9f','#ba8d36','#7299b6'];
const initial=data.questions.find(q=>q.id===location.hash.slice(1));
const state={group:initial?.group||'conhecimento',question:initial?.id||'conhecimento',unit:'percent',sort:false};
let generation=0;
function groupQuestions(){return data.questions.filter(q=>q.group===state.group);}
function renderNavigation(){const topics=$('r-topics');topics.replaceChildren();data.groups.forEach(([id,label])=>{const b=el('button','',label);b.type='button';b.setAttribute('aria-pressed',String(id===state.group));b.addEventListener('click',()=>{state.group=id;state.question=groupQuestions()[0].id;renderNavigation();renderChart();});topics.append(b);});const select=$('r-question'),list=$('r-question-list');select.replaceChildren();list.replaceChildren();groupQuestions().forEach(q=>{const option=el('option','',q.title);option.value=q.id;option.selected=q.id===state.question;select.append(option);const b=el('button','',q.title);b.type='button';b.setAttribute('aria-pressed',String(q.id===state.question));b.addEventListener('click',()=>chooseQuestion(q.id));list.append(b);});}
function chooseQuestion(id){if(!data.questions.some(q=>q.id===id))return;state.question=id;state.group=data.questions.find(q=>q.id===id).group;renderNavigation();renderChart();}
function renderChart(){const q=data.questions.find(q=>q.id===state.question),version=++generation;
$('r-base').textContent=q.n+' respostas'+(q.multiple?' · múltipla escolha':'');$('r-number').textContent='Pergunta '+(data.questions.indexOf(q)+1)+' de '+data.questions.length;$('r-question-title').textContent=q.title;
$('r-insight').textContent=q.insight||'';$('r-note').textContent=q.note||'';$('r-related').hidden=!q.link;if(q.link){$('r-related').textContent=q.link[0]+' →';$('r-related').href=q.link[1];}
$('r-source-link').href=data.source+'#page='+q.page;$('r-source-link').textContent='conferir a página '+q.page+' do PDF ↗';$('r-caption').textContent=q.title+' — base: '+q.n+' respostas.';
const rows=q.rows.map((r,i)=>({...r,original:i}));if(state.sort)rows.sort((a,b)=>b.count-a.count||a.original-b.original);
const bars=$('r-bars'),table=$('r-table');bars.replaceChildren();table.replaceChildren();$('r-detail').textContent='Toque em uma barra para destacar uma resposta. Escala: 0 a '+(state.unit==='percent'?'100%':q.n+' pessoas')+'.';
rows.forEach(r=>{const p=r.count/q.n*100,b=el('button','r-bar');b.type='button';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',r.label+': '+r.count+' de '+q.n+' pessoas, '+percentage(r.count,q.n));b.title=r.count+' de '+q.n+' pessoas ('+percentage(r.count,q.n)+')';const line=el('span','r-bar-label'),label=el('span','',r.label),value=el('span','r-bar-value',state.unit==='percent'?percentage(r.count,q.n):String(r.count));line.append(label,value);const track=el('span','r-bar-track'),fill=el('span','r-bar-fill');track.setAttribute('aria-hidden','true');fill.style.setProperty('--bar-color',colors[r.original%colors.length]);track.append(fill);b.append(line,track);b.addEventListener('click',()=>{bars.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('r-detail').textContent=r.label+': '+r.count+' de '+q.n+' pessoas ('+percentage(r.count,q.n)+').'+(q.multiple?' Uma mesma pessoa podia marcar mais de uma alternativa.':'');});bars.append(b);if(reduced)fill.style.width=p+'%';else requestAnimationFrame(()=>requestAnimationFrame(()=>{if(version===generation)fill.style.width=p+'%';}));const tr=el('tr');tr.append(el('td','',r.label),el('td','',r.count),el('td','',percentage(r.count,q.n)));table.append(tr);});
document.querySelectorAll('[data-unit]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.unit===state.unit)));try{history.replaceState(null,'','#'+q.id);}catch(e){}
}
$('r-question').addEventListener('change',e=>chooseQuestion(e.target.value));$('r-sort').addEventListener('change',e=>{state.sort=e.target.checked;renderChart();});document.querySelectorAll('[data-unit]').forEach(b=>b.addEventListener('click',()=>{state.unit=b.dataset.unit;renderChart();}));
$('r-export').addEventListener('click',()=>{const rows=[['Tema','Pergunta','Alternativa','Pessoas','Base de respostas','Percentual','Multipla escolha','Pagina do PDF']];data.questions.forEach(q=>q.rows.forEach(r=>rows.push([q.group,q.title,r.label,r.count,q.n,number.format(r.count/q.n*100),q.multiple?'Sim':'Nao',q.page])));const csv='\uFEFF'+rows.map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(';')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=el('a');a.href=url;a.download='pesquisa-salario-maternidade.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
data.comments.forEach((comment,i)=>{const fig=el('figure','r-quote');fig.append(el('figcaption','',(i+1).toString().padStart(2,'0')+' · '+comment.theme),el('blockquote','','“'+comment.text+'”'));$('r-comments').append(fig);});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(id!==state.question&&data.questions.some(q=>q.id===id))chooseQuestion(id);});
renderNavigation();renderChart();
})();
