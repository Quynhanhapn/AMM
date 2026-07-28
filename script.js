const header=document.querySelector('.header-inner');
document.querySelector('.menu-toggle')?.addEventListener('click',()=>header.classList.toggle('open'));
document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>{if(innerWidth<1100)item.classList.toggle('open')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const directionalObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');directionalObserver.unobserve(entry.target)}}),{threshold:.14});
document.querySelectorAll('.reveal-left,.reveal-right,.reveal-up').forEach(el=>directionalObserver.observe(el));
