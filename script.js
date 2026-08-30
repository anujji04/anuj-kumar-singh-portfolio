// ===== Loading screen =====
const preloader = document.getElementById('preloader');
const loaderLines = document.getElementById('loader-lines');
const loaderBar = document.getElementById('loader-bar');
const loaderPercent = document.getElementById('loader-percent');
const bootMessages = [
  '[ SYSTEM BOOT ] AKS-OS v2.0',
  '$ Initializing Portfolio... OK',
  '$ Loading Programming Modules... OK',
  '$ Establishing Secure Connection... OK',
  '$ Loading Certificates... OK',
  '$ ▶ ACCESS GRANTED'
];
let progress = 0;
bootMessages.forEach((message, index) => {
  setTimeout(() => {
    const line = document.createElement('div');
    line.className = 'loader-line';
    const parts = message.split(' OK');
    line.innerHTML = parts.length > 1 ? `${parts[0]} <b>OK</b>` : message;
    loaderLines.appendChild(line);
  }, index * 210);
});
const progressTimer = setInterval(() => {
  progress = Math.min(100, progress + Math.floor(Math.random() * 10) + 4);
  loaderBar.style.width = `${progress}%`;
  loaderPercent.textContent = `${progress}%`;
  if (progress >= 100) {
    clearInterval(progressTimer);
    setTimeout(() => preloader.classList.add('done'), 350);
  }
}, 110);

// ===== Typewriter =====
const typed = document.getElementById('typed');
const words = ['CSE STUDENT', 'PROGRAMMER', 'PYTHON DEVELOPER', 'WEB DEVELOPER', 'LIFELONG LEARNER'];
let wi = 0, ci = 0, deleting = false;
function typeLoop() {
  const word = words[wi];
  typed.textContent = word.slice(0, ci);
  if (!deleting && ci < word.length) { ci++; setTimeout(typeLoop, 72); }
  else if (!deleting) { deleting = true; setTimeout(typeLoop, 1200); }
  else if (ci > 0) { ci--; setTimeout(typeLoop, 38); }
  else { deleting = false; wi = (wi + 1) % words.length; setTimeout(typeLoop, 280); }
}
typeLoop();

// ===== Mobile navigation + sticky header =====
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('main-nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#main-nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));
const siteNav = document.getElementById('site-nav');
window.addEventListener('scroll', () => siteNav.classList.toggle('scrolled', window.scrollY > 20), { passive: true });

// ===== Active navigation =====
const sectionIds = ['about', 'skills', 'projects', 'education', 'certs', 'terminal', 'contact'];
const navLinks = [...document.querySelectorAll('#main-nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sectionIds.forEach(id => { const el = document.getElementById(id); if (el) sectionObserver.observe(el); });

// ===== Reveal-on-scroll =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Project filters + details =====
const filters = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');
filters.forEach(filter => filter.addEventListener('click', () => {
  filters.forEach(f => f.classList.remove('active'));
  filter.classList.add('active');
  const selected = filter.dataset.filter;
  projectCards.forEach(card => {
    const visible = selected === 'all' || card.dataset.category === selected;
    card.classList.toggle('hidden', !visible);
  });
}));

const projectData = {
  'Student Management System': {
    date: "Jun '26", tech: ['C', 'File Handling', 'CRUD'],
    text: 'Developed a console-based application with CRUD operations and file handling for data persistence. Implemented structured data management features to improve record organization and retrieval.'
  },
  'Calculator Application': {
    date: "Jul '26", tech: ['Python', 'Tkinter', 'GUI'],
    text: 'Built a GUI-based calculator supporting arithmetic and advanced mathematical operations. Designed an interactive interface using Tkinter to improve usability.'
  },
  'Personal Portfolio Website': {
    date: "Aug '26", tech: ['HTML', 'CSS', 'JavaScript'],
    text: 'Created a responsive portfolio website with a modern design. Deployed using GitHub Pages for online accessibility and used it to showcase projects, skills and achievements.'
  }
};
const projectModal = document.getElementById('project-modal');
const projectDetail = document.getElementById('project-detail');
projectCards.forEach(card => {
  const title = card.querySelector('h3')?.textContent.trim();
  card.addEventListener('click', event => {
    if (event.target.closest('a')) return;
    const data = projectData[title];
    if (!data) return;
    projectDetail.innerHTML = `<div class="section-kicker">PROJECT DETAIL</div><h3>${title}</h3><p>${data.text}</p><div class="detail-meta">${data.tech.map(t => `<span>${t}</span>`).join('')}<span>${data.date}</span></div><p style="margin-top:18px"><a class="text-link" href="https://github.com/anujji04" target="_blank" rel="noopener">Open GitHub Profile ↗</a></p>`;
    openModal(projectModal);
  });
});

// ===== Certificate modal =====
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
document.querySelectorAll('[data-cert]').forEach(btn => btn.addEventListener('click', () => {
  modalImg.src = btn.dataset.cert;
  modalCaption.textContent = btn.closest('.cert-card')?.querySelector('h3')?.textContent || 'Certificate Preview';
  openModal(certModal);
}));
function openModal(modal) { modal.classList.add('show'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('modal-open'); }
function closeModal(modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); if (modal === certModal) modalImg.src = ''; }
document.querySelectorAll('.modal').forEach(modal => {
  modal.querySelector('.modal-backdrop')?.addEventListener('click', () => closeModal(modal));
  modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modal));
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.modal.show').forEach(closeModal);
});

// ===== Interactive terminal =====
const out = document.getElementById('terminal-output');
const input = document.getElementById('terminal-input');
const commands = {
  help: 'Available: help, about, skills, projects, certs, education, contact, github, resume, clear',
  about: 'Anuj Kumar Singh — B.Tech Computer Science and Engineering student at Lovely Professional University.',
  skills: 'C, C++, Python, Java, HTML, CSS, VS Code, Git, GitHub, MS Office, MySQL + professional skills.',
  projects: 'Student Management System | Calculator Application | Personal Portfolio Website.',
  certs: '5 certificates: AI Bootcamp, Effective Time Management, Introduction to Python, Mastering DevOps, Computer Programming.',
  education: 'B.Tech CSE (2025–2029), LPU. Senior Secondary 83%. Secondary 89%.',
  contact: 'rjakaj0203@gmail.com | +91 9219851282',
  github: 'https://github.com/anujji04',
  resume: 'Opening Anuj-Kumar-Singh-CV.pdf...'
};
function appendTerminal(command, result) {
  const line = document.createElement('div');
  line.innerHTML = `<span class="cmd">anuj@portfolio:~$ ${escapeHtml(command)}</span><br><span class="result">${escapeHtml(result)}</span>`;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}
function escapeHtml(value) { return value.replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char])); }
input?.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  const raw = input.value.trim();
  if (!raw) return;
  const cmd = raw.toLowerCase();
  if (cmd === 'clear') { out.innerHTML = ''; input.value = ''; return; }
  if (cmd === 'resume') { window.open('Anuj-Kumar-Singh-CV.pdf', '_blank', 'noopener'); }
  appendTerminal(raw, commands[cmd] || `Command not found: ${raw}. Type "help" for available commands.`);
  input.value = '';
});

// ===== Contact form via mail client =====
function sendMail(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const msg = document.getElementById('message').value;
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${msg}`);
  window.location.href = `mailto:rjakaj0203@gmail.com?subject=${subject}&body=${body}`;
  return false;
}
window.sendMail = sendMail;

// ===== Mouse particle glow =====
const glow = document.getElementById('cursor-glow');
window.addEventListener('mousemove', event => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
  glow.style.opacity = '1';
}, { passive: true });
