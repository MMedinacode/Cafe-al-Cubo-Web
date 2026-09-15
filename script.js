// ===== Loader breve =====
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hide'), 350);
});

// ===== Navegación por pestañas =====
const tabLinks = document.querySelectorAll('[data-tab-link]');
const tabSections = document.querySelectorAll('.tab-section');
const navLinksEls = document.querySelectorAll('.nav-link[data-tab-link]');

function goToTab(tabId){
  tabSections.forEach(s => s.classList.toggle('active', s.dataset.tab === tabId));
  navLinksEls.forEach(n => n.classList.toggle('active', n.dataset.tabLink === tabId));
  window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
  closeMenu();
  runScrollReveal();
}

tabLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goToTab(link.dataset.tabLink);
  });
});

// ===== Carta por secciones (pestañas) =====
const menuTabs = document.querySelectorAll('.menu-tab');
const menuCats = document.querySelectorAll('.menu-cat');
menuTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    menuTabs.forEach(t => t.classList.toggle('active', t === tab));
    menuCats.forEach(c => {
      const activo = c.dataset.cat === tab.dataset.cat;
      c.classList.toggle('active', activo);
      if (activo) c.classList.add('revealed');
    });
  });
});

// ===== Menú hamburguesa mobile =====
const hamburger = document.getElementById('hamburger');
const navLinksWrap = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu(){
  hamburger.classList.add('open');
  navLinksWrap.classList.add('open');
  navOverlay.classList.add('show');
  hamburger.setAttribute('aria-expanded','true');
}
function closeMenu(){
  hamburger.classList.remove('open');
  navLinksWrap.classList.remove('open');
  navOverlay.classList.remove('show');
  hamburger.setAttribute('aria-expanded','false');
}
hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});
navOverlay.addEventListener('click', closeMenu);

// ===== Scroll reveal (con red de seguridad por si IntersectionObserver no dispara a tiempo) =====
function runScrollReveal(){
  const items = document.querySelectorAll('.tab-section.active .reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  items.forEach(el => io.observe(el));

  // Red de seguridad: si algo queda sin revelar pasado 1.2s, se muestra igual
  setTimeout(() => {
    document.querySelectorAll('.tab-section.active .reveal:not(.revealed)').forEach(el => {
      el.classList.add('revealed');
    });
  }, 1200);
}
document.addEventListener('DOMContentLoaded', runScrollReveal);

// ===== Horario en vivo =====
function updateSchedule(){
  const now = new Date();
  const day = now.getDay(); // 0 domingo ... 6 sábado
  const hour = now.getHours() + now.getMinutes()/60;

  document.querySelectorAll('#hoursList li').forEach(li => {
    li.classList.toggle('today', Number(li.dataset.day) === day);
  });

  let open = false;
  if(day >= 1 && day <= 5){
    open = hour >= 8 && hour < 19.5;
  } else {
    open = hour >= 9 && hour < 14;
  }

  const statusEl = document.getElementById('openStatus');
  if(statusEl){
    statusEl.textContent = open ? 'Abierto ahora' : 'Cerrado ahora';
    statusEl.classList.toggle('open', open);
    statusEl.classList.toggle('closed', !open);
  }
}
updateSchedule();
