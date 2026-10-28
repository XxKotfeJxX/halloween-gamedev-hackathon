(()=>{
 const root=document.documentElement,button=document.querySelector('.motion-toggle');
 function mode(on){root.dataset.motion=on?'on':'off';if(!on)document.querySelectorAll('.cursor-spark').forEach(s=>s.remove());if(button){button.setAttribute('aria-pressed',String(on));button.setAttribute('aria-label',on?'Вимкнути анімації':'Увімкнути анімації');button.title=on?'Анімації увімкнено':'Анімації вимкнено';}}
 mode(root.dataset.motion!=='off');
 button?.addEventListener('click',()=>{const on=root.dataset.motion!=='on';mode(on);try{localStorage.setItem('halloween-motion',on?'on':'off');}catch{}});
 const rig=document.querySelector('.hero .mascot-rig');
 if(rig){const required=[...rig.querySelectorAll('.rig-layer img, img.rig-layer, .screen-skull')];const check=()=>{if(required.every(i=>i.complete&&i.naturalWidth>0)){rig.classList.add('art-ready');}};required.forEach(i=>{i.addEventListener('load',check,{once:true});});check();}
})();
