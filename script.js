const header = document.querySelector('[data-header]');
const nav = document.querySelector('#primary-nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = [...document.querySelectorAll('.primary-nav a')];

const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

navToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  },
  { rootMargin: '-22% 0px -60% 0px', threshold: [0.05, 0.2, 0.5] }
);

['overview', 'abstract', 'pipeline', 'robocasa365', 'results', 'citation'].forEach((id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;
    try {
      await navigator.clipboard.writeText(source.textContent.trim());
      const original = button.textContent;
      button.textContent = 'Copied';
      window.setTimeout(() => { button.textContent = original; }, 1500);
    } catch {
      button.textContent = 'Select and copy';
    }
  });
});

const chartSets = {
  'rc365-splits': [
    ['Atomic SR', ['78.5', '77.5', '81.8']],
    ['Composite-S SR', ['57.9', '63.3', '68.7']],
    ['Composite-U SR', ['60.0', '62.2', '64.7']],
    ['Average SR', ['65.9', '68.0', '72.1']],
  ],
  'rc365-seen': [
    ['SR', ['57.91', '63.33', '68.75']],
    ['MC@25', ['90.83', '90.62', '94.79']],
    ['MC@50', ['84.37', '85.00', '89.16']],
    ['MC@75', ['70.41', '73.95', '80.20']],
    ['MP', ['79.48', '81.68', '85.88']],
    ['PPL', ['63.55', '65.06', '68.50']],
    ['OPS', ['74.83', '76.67', '82.09']],
    ['UPS', ['84.56', '86.82', '89.37']],
  ],
  'rc365-unseen': [
    ['SR', ['60.00', '62.29', '64.79']],
    ['MC@25', ['95.41', '97.50', '96.45']],
    ['MC@50', ['87.50', '88.95', '90.20']],
    ['MC@75', ['73.75', '74.79', '76.25']],
    ['MP', ['82.03', '83.39', '84.66']],
    ['PPL', ['64.54', '67.16', '68.38']],
    ['OPS', ['76.70', '78.10', '79.71']],
    ['UPS', ['88.12', '89.23', '89.13']],
  ],
  'rc-long': [
    ['SR', ['0.00', '0.00', '6.66']],
    ['MC@25', ['47.77', '62.22', '66.66']],
    ['MC@50', ['3.33', '20.00', '34.44']],
    ['MC@75', ['0.00', '0.00', '14.44']],
    ['MP', ['20.83', '28.75', '42.22']],
    ['PPL', ['11.91', '17.82', '33.03']],
    ['OPS', ['14.92', '22.71', '38.77']],
    ['UPS', ['30.55', '46.16', '76.17']],
  ],
  'real-world': [
    ['SR', ['6.66', '36.66', '43.33']],
    ['MC@25', ['73.33', '76.66', '90.00']],
    ['MC@50', ['53.33', '56.66', '80.00']],
    ['MC@75', ['30.00', '46.66', '63.33']],
    ['MP', ['50.15', '59.01', '75.58']],
    ['PPL', ['46.83', '56.31', '73.09']],
  ],
};

const methodLabels = ['XR-1', 'Raw', 'MOST'];

document.querySelectorAll('[data-chart-set]').forEach((container) => {
  const metrics = chartSets[container.dataset.chartSet] || [];
  container.innerHTML = metrics.map(([label, values]) => `
    <article class="metric-chart" aria-label="${label}: XR-1 ${values[0]}, MOST-Raw ${values[1]}, MOST ${values[2]}">
      <h5>${label}</h5>
      <div class="chart-bars">
        ${values.map((value, index) => `
          <div class="chart-bar method-${index}">
            <span>${methodLabels[index]}</span>
            <i><b style="--bar:${Number(value)}%"></b></i>
            <strong>${value}</strong>
          </div>
        `).join('')}
      </div>
    </article>
  `).join('');
});

const loopingDemoVideos = [...document.querySelectorAll('.demo-video-card video')];

loopingDemoVideos.forEach((video) => {
  video.controls = false;
  video.muted = true;
  video.defaultMuted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
});

if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: '180px 0px', threshold: 0.01 }
  );

  loopingDemoVideos.forEach((video) => videoObserver.observe(video));
} else {
  loopingDemoVideos.forEach((video) => video.play().catch(() => {}));
}
