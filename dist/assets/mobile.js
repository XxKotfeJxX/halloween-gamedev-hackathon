(()=>{
 const root=document.documentElement,mobile=matchMedia('(max-width:600px)');
 const hero=document.querySelector('.hero'),art=document.querySelector('.art-stage'),wake=document.querySelector('.pumpkin-touch'),status=document.querySelector('.pumpkin-status');
 const motion=()=>root.dataset.motion!=='off';
 let awakeTimer,pressTimer,batTimer;
 if(wake){wake.hidden=false;wake.addEventListener('click',()=>{
  if(!mobile.matches||hero.classList.contains('is-startled'))return;
  clearTimeout(awakeTimer);clearTimeout(batTimer);hero.classList.remove('is-startled');art.querySelectorAll('.tap-bat').forEach(b=>b.remove());
  status.textContent='Гарбуз прокинувся. На екрані знову привиди.';
  if(!motion())return;
   hero.classList.add('is-startled');
   [[-105,-155,-28],[5,-200,18],[85,-125,35]].forEach(([x,y,rotate],i)=>{
    const bat=document.createElement('span');bat.className='tap-bat';bat.setAttribute('aria-hidden','true');bat.style.setProperty('--bat-x',x+'px');bat.style.setProperty('--bat-y',y+'px');bat.style.setProperty('--bat-rotate',rotate+'deg');bat.style.setProperty('--bat-delay',i*65+'ms');bat.innerHTML='<svg viewBox="0 0 120 64"><use href="#bat"/></svg>';art.append(bat);bat.addEventListener('animationend',()=>bat.remove(),{once:true});
   });
   awakeTimer=setTimeout(()=>hero.classList.remove('is-startled'),850);batTimer=setTimeout(()=>art.querySelectorAll('.tap-bat').forEach(b=>b.remove()),1300);
 });}
 const days=document.querySelector('.days'),controls=document.querySelector('.day-controls');
 if(days&&controls){
  const tickets=[...days.querySelectorAll('.ticket')],prev=controls.querySelector('[data-day-prev]'),next=controls.querySelector('[data-day-next]'),count=controls.querySelector('.day-count');let index=0,scrollTimer;
  controls.hidden=false;
  function current(){const left=days.getBoundingClientRect().left+parseFloat(getComputedStyle(days).paddingLeft);return tickets.reduce((best,t,i)=>Math.abs(t.getBoundingClientRect().left-left)<Math.abs(tickets[best].getBoundingClientRect().left-left)?i:best,0);}
  function update(){index=current();prev.disabled=index===0;next.disabled=index===tickets.length-1;count.innerHTML=String(index+1).padStart(2,'0')+' <i>/ '+String(tickets.length).padStart(2,'0')+'</i>';count.setAttribute('aria-label','День '+(index+1)+' з '+tickets.length);tickets.forEach((t,i)=>t.classList.toggle('is-current',i===index));}
  function go(to){if(!mobile.matches)return;const target=tickets[Math.max(0,Math.min(to,tickets.length-1))];const padding=parseFloat(getComputedStyle(days).paddingLeft);days.scrollTo({left:days.scrollLeft+target.getBoundingClientRect().left-days.getBoundingClientRect().left-padding,behavior:motion()?'smooth':'instant'});}
  prev.addEventListener('click',()=>go(index-1));next.addEventListener('click',()=>go(index+1));
  days.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(update,100);},{passive:true});
  days.addEventListener('keydown',e=>{if(!mobile.matches||e.target!==days)return;if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?tickets.length-1:index+(e.key==='ArrowRight'?1:-1));}});
  addEventListener('resize',update,{passive:true});update();
 }
 const registration=document.querySelector('.final .button');
 const dock=document.createElement('aside');dock.className='mobile-dock';dock.setAttribute('aria-label','Реєстрація на хакатон');dock.hidden=true;
 const date=document.createElement('span');date.className='mobile-dock-date';date.innerHTML='30.10 — 01.11<small>3 дні · геймдев</small>';
 const link=document.createElement('a');link.href=registration.href;link.target='_blank';link.rel='noopener noreferrer';link.innerHTML='Зареєструватися <span aria-hidden="true">↗</span>';dock.append(date,link);document.body.append(dock);
 function dockVisibility(){const final=document.querySelector('.final').getBoundingClientRect();const show=mobile.matches&&hero.getBoundingClientRect().bottom<0&&final.top>=innerHeight;dock.hidden=!mobile.matches;dock.classList.toggle('is-visible',show);dock.inert=!show;dock.setAttribute('aria-hidden',String(!show));}
 let frame=false;
 function scrollFrame(){frame=false;dockVisibility();if(mobile.matches&&motion()){const rect=hero.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight)root.style.setProperty('--hero-drift',Math.min(18,Math.max(0,-rect.top*.055)).toFixed(2));}}
 addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(scrollFrame);}},{passive:true});
 addEventListener('resize',scrollFrame,{passive:true});mobile.addEventListener('change',scrollFrame);scrollFrame();
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add(e.target.matches('.story')?'mobile-seen':'in-view');observer.unobserve(e.target);}}),{threshold:.14});document.querySelectorAll('.story,.fact,.format-card').forEach(el=>{if(!el.matches('.story'))el.classList.add('mobile-stamp');observer.observe(el);});}
 document.addEventListener('pointerdown',e=>{if(!mobile.matches||!motion())return;const card=e.target.closest('.roles li,.fact,.partner-card');if(!card)return;document.querySelectorAll('.touch-pressed').forEach(el=>el.classList.remove('touch-pressed'));clearTimeout(pressTimer);card.classList.add('touch-pressed');pressTimer=setTimeout(()=>card.classList.remove('touch-pressed'),650);},{passive:true});
 document.querySelector('.motion-toggle')?.addEventListener('click',()=>{if(!motion()){hero.classList.remove('is-startled');art.querySelectorAll('.tap-bat').forEach(b=>b.remove());root.style.setProperty('--hero-drift','0');}});
})();
