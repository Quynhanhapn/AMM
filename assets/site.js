const header=document.querySelector('.header-inner');
document.querySelector('.menu-toggle')?.addEventListener('click',()=>header.classList.toggle('open'));
document.querySelectorAll('.nav-item').forEach(item=>item.addEventListener('click',()=>{if(innerWidth<1100)item.classList.toggle('open')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal, .motion').forEach(el=>observer.observe(el));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
