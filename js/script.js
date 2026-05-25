document.addEventListener('DOMContentLoaded', () => {
    
    
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-up');
    animatedElements.forEach(el => observer.observe(el));

    // Particles Animation
    const particleContainer = document.getElementById('hero-particles');
    if (particleContainer) createParticles(particleContainer, 60);
});

function createParticles(container, count) {
    const particles = [];
    const colors = ['#3b82f6', '#06b6d4', '#ffffff'];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5 + 0.2;
        particle.style.top = Math.random() * 100 + '%';
        particle.style.left = Math.random() * 100 + '%';
        particle.dataset.vx = (Math.random() - 0.5) * 0.5;
        particle.dataset.vy = (Math.random() - 0.5) * 0.5;
        container.appendChild(particle);
        particles.push(particle);
    }

    function animate() {
        particles.forEach(p => {
            let x = parseFloat(p.style.left); let y = parseFloat(p.style.top);
            let vx = parseFloat(p.dataset.vx); let vy = parseFloat(p.dataset.vy);
            x += vx; y += vy;
            if (x < -2) x = 102; if (x > 102) x = -2;
            if (y < -2) y = 102; if (y > 102) y = -2;
            p.style.left = x + '%'; p.style.top = y + '%';
        });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth; const mouseY = e.clientY / window.innerHeight;
        particles.forEach(p => {
            p.style.transform = `translate(${(mouseX - 0.5) * 2}px, ${(mouseY - 0.5) * 2}px)`;
        });
    });
}
