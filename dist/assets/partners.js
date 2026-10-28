(()=>{
 const block=document.querySelector('.partners-block');if(!block)return;
 const list=block.querySelector('.partners-list'),controls=block.querySelector('.partner-controls'),bar=block.querySelector('.partner-progress');
 const data=window.HALLOWEEN_PARTNERS;
 function entry(p){
  const li=document.createElement('li');li.className='partner-entry';
  const a=document.createElement(p.href?'a':'div');a.className='partner-card';
  if(p.href){a.href=p.href;if(!p.href.startsWith('#')){a.target='_blank';a.rel='noopener noreferrer';}}
  const logo=document.createElement('span');logo.className='partner-logo'+(p.logoSurface==='light'?' partner-logo-surface':'');
  if(p.logo){const img=document.createElement('img');img.src=p.logo;img.className=p.logoClass||'';img.alt='';img.loading='lazy';img.decoding='async';img.draggable=false;logo.append(img);img.addEventListener('error',()=>{img.remove();logo.textContent=p.wordmark||p.name;logo.classList.add('partner-wordmark');},{once:true});}
  else if(p.emblem==='event'){logo.innerHTML='<svg class="event-emblem" viewBox="0 0 60 60" aria-hidden="true"><use href="#pumpkin-mark"/></svg>';}
  else{const word=document.createElement('span');word.className='partner-wordmark';word.textContent=p.wordmark||p.name;word.setAttribute('aria-hidden','true');logo.append(word);}
  const name=document.createElement('span');name.className='partner-name'+(p.kind==='department'?' department':'');name.textContent=p.name;if(p.hideName||(!p.logo&&p.wordmark&&p.wordmark.toLowerCase()===p.name.toLowerCase()))name.classList.add('sr-only');
  a.append(logo,name);const corner=document.createElement('span');corner.className='partner-decoration';corner.innerHTML='<svg class="partner-corner" viewBox="0 0 40 40" aria-hidden="true"><path d="M40 0H0M40 0L0 20M40 0L20 40M40 0V40M27 0Q29 10 40 13M14 0Q20 21 40 26M9 16Q20 21 23 34"/></svg>';a.append(corner);
  const arrow=document.createElement('span');arrow.className='partner-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');a.append(arrow);li.append(a);return li;
 }
 function setup(){const count=list.children.length;block.style.setProperty('--partner-columns',Math.max(1,Math.min(count,6)));block.closest('section').hidden=count===0;block.classList.toggle('is-carousel',count>6);controls.hidden=count<=6;bar.hidden=count<=6;list.setAttribute('aria-label','Організатори та партнери');}
 if(Array.isArray(data)){list.replaceChildren(...data.map(entry));}setup();
 const reduced=()=>document.documentElement.dataset.motion==='off';
 function move(dir){const card=list.querySelector('.partner-entry');if(!card)return;const gap=parseFloat(getComputedStyle(list).columnGap)||16;list.scrollBy({left:dir*(card.getBoundingClientRect().width+gap),behavior:reduced()?'instant':'smooth'});}
 block.querySelector('[data-partner-prev]').addEventListener('click',()=>move(-1));block.querySelector('[data-partner-next]').addEventListener('click',()=>move(1));
 list.addEventListener('keydown',e=>{if(!block.classList.contains('is-carousel')||e.target!==list)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();list.scrollTo({left:e.key==='Home'?0:list.scrollWidth,behavior:reduced()?'instant':'smooth'});}});
 function progress(){const max=list.scrollWidth-list.clientWidth;block.style.setProperty('--partner-progress',max>0?Math.max(8,list.scrollLeft/max*100)+'%':'100%');}
 list.addEventListener('scroll',progress,{passive:true});if('ResizeObserver'in window)new ResizeObserver(progress).observe(list);else addEventListener('resize',progress);progress();
})();
