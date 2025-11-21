if (window.gsap && window.ScrollToPlugin) {
    gsap.registerPlugin(ScrollToPlugin);
}

const controller = new ScrollMagic.Controller();

/* Smooth scroll with GSAP */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', event => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        event.preventDefault();
        gsap.to(window, {
            duration: 1.1,
            scrollTo: { y: target, offsetY: 80 },
            ease: 'power3.inOut'
            });
    });
});

/* Hero timeline */
const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTimeline
    .from('.site-nav', { y: -40, opacity: 0, duration: 0.6 })
    .from('.hero-copy .eyebrow', { y: 40, opacity: 0, duration: 0.5 })
    .from('.hero-copy h1', { y: 40, opacity: 0, duration: 0.7 }, '-=0.3')
    .from('.hero-lede', { y: 30, opacity: 0, duration: 0.5 }, '-=0.5')
    .from('.hero-actions', { y: 30, opacity: 0, duration: 0.4 }, '-=0.4')
    .from('.hero-orbit', { scale: 0.7, opacity: 0, duration: 0.8 }, '-=0.6');

/* Hero orbit pulse with Velocity */
const heroOrbit = document.querySelector('.hero-orbit');
if (heroOrbit) {
    const pulse = () => {
        Velocity(heroOrbit, { scale: 1.04 }, {
            duration: 1600,
            easing: 'easeInOutSine',
            complete: () => {
                Velocity(heroOrbit, { scale: 1 }, {
                    duration: 1600,
                    easing: 'easeInOutSine',
                    complete: pulse
                });
            }
        });
    };
    pulse();
}

/* Panel reveals */
document.querySelectorAll('.panel').forEach(panel => {
    const heading = panel.querySelector('.panel-heading');
    if (heading) {
        const tween = gsap.from(heading, { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' });
        new ScrollMagic.Scene({
            triggerElement: panel,
            triggerHook: 0.85,
            reverse: false
        }).setTween(tween).addTo(controller);
    }
});

/* Card grids */
const cascadeReveal = (selector) => {
    document.querySelectorAll(selector).forEach(card => card.style.opacity = 0);
    document.querySelectorAll(selector).forEach((card, index) => {
        const tween = gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.08,
            ease: 'power2.out',
            paused: true
        });
        new ScrollMagic.Scene({
            triggerElement: card,
            triggerHook: 0.9,
            reverse: false
        }).on('enter', () => tween.play()).addTo(controller);
    });
};

['.overview-card', '.valence-card', '.metric-card', '.chem-card', '.use-card', '.insight-card']
    .forEach(selector => cascadeReveal(selector));

/* Valence chip burst using Velocity */
const fireValenceChips = () => {
    document.querySelectorAll('.element-row span').forEach((chip, idx) => {
        Velocity(chip, { translateY: [0, 20], opacity: [1, 0] }, { delay: idx * 80, duration: 500, easing: 'easeOutQuart' });
    });
};

new ScrollMagic.Scene({
    triggerElement: '#valence',
    triggerHook: 0.6,
    reverse: false
}).on('enter', fireValenceChips).addTo(controller);

/* density bar animation */
document.querySelectorAll('.density-line div div').forEach(bar => {
    const width = bar.style.width;
    gsap.set(bar, { width: 0 });
    new ScrollMagic.Scene({
        triggerElement: bar,
        triggerHook: 0.7,
        reverse: false
    }).setTween(gsap.to(bar, { width, duration: 1, ease: 'power2.out' }))
      .addTo(controller);
});

/* Scroll-driven parallax for hero copy/orbit */
new ScrollMagic.Scene({
    triggerElement: '.hero-stage',
    triggerHook: 0,
    duration: '80%'
}).setTween(gsap.to('.hero-copy', { yPercent: 10, ease: 'none' }))
  .addTo(controller);

new ScrollMagic.Scene({
    triggerElement: '.hero-stage',
    triggerHook: 0,
    duration: '80%'
}).setTween(gsap.to('.hero-orbit', { rotationY: 15, rotationX: -10, ease: 'none' }))
  .addTo(controller);

/* Magnetic hover using Velocity */
document.querySelectorAll('.valence-card, .use-card, .insight-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        Velocity(card, { scale: 1.02 }, { duration: 200, easing: 'easeOutQuad' });
    });
    card.addEventListener('mouseleave', () => {
        Velocity(card, { scale: 1 }, { duration: 200, easing: 'easeOutQuad' });
    });
});

/* Scroll progress indicator */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 2px;
    z-index: 999;
    background: linear-gradient(90deg, #5ec6ff, #9f7bff);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
});

/* Floating particles via Velocity */
const particleLayer = document.createElement('div');
particleLayer.className = 'particle-layer';
document.body.appendChild(particleLayer);

for (let i = 0; i < 18; i++) {
    const dot = document.createElement('span');
    dot.className = 'particle';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    particleLayer.appendChild(dot);
    const drift = () => {
        Velocity(dot, {
            translateY: [ -80 - Math.random() * 40, 0 ],
            opacity: [0, 0.4],
            translateX: [ (Math.random() * 40) - 20, 0 ]
        }, {
            duration: 4000 + Math.random() * 2000,
            easing: 'easeInOutSine',
            complete: () => {
                Velocity(dot, { translateY: 0, opacity: 0 }, {
                    duration: 0,
                    delay: 400,
                    complete: drift
                });
            }
        });
    };
    drift();
}
