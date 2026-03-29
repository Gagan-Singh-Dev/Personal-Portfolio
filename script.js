const themeBtn = document.getElementById('theme-toggle');
const htmlTag = document.documentElement;
const themeIcon = themeBtn.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    htmlTag.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeBtn.addEventListener('click', () => {
    let currentTheme = htmlTag.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlTag.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun';
        themeBtn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
        themeIcon.className = 'fa-solid fa-moon';
        themeBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
}

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('nav-active') ? 'true' : 'false');
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinks.classList.contains('nav-active')) {
            navLinks.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });
}

const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
const lowPowerDevice =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 4);
const shouldReduceEffects = prefersReducedMotion || (isTouchDevice && (isSmallScreen || lowPowerDevice));

let sectionMetrics = [];
let activeSectionId = '';
let scrollTicking = false;
let lastNavbarScrolled = false;

function cacheSectionMetrics() {
    sectionMetrics = Array.from(sections).map(section => ({
        id: section.getAttribute('id'),
        top: section.offsetTop,
        height: section.clientHeight
    }));
}

function updateScrollState() {
    if (navbar) {
        const shouldBeScrolled = window.scrollY > 50;
        if (shouldBeScrolled !== lastNavbarScrolled) {
            navbar.classList.toggle('scrolled', shouldBeScrolled);
            lastNavbarScrolled = shouldBeScrolled;
        }
    }

    const y = window.scrollY;
    let current = '';
    sectionMetrics.forEach(section => {
        if (y >= (section.top - section.height / 3)) {
            current = section.id;
        }
    });

    if (current && current !== activeSectionId) {
        activeSectionId = current;
        navLinksItems.forEach(link => {
            const isActive = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', isActive);
        });
    }
}

function handleScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
        updateScrollState();
        scrollTicking = false;
    });
}

cacheSectionMetrics();
updateScrollState();

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', () => {
    cacheSectionMetrics();
    updateScrollState();
});

if (window.Typed) {
    new Typed('.typing', {
        strings: ['AI / ML Learner', 'Problem Solver', 'Tech Enthusiast', 'Engineering Student'],
        typeSpeed: 60,
        backSpeed: 40,
        loop: true,
        backDelay: 1500
    });
}

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

const particlesContainer = document.getElementById('particles-js');
const disableParticles = lowPowerDevice && isTouchDevice;

if (particlesContainer && disableParticles) {
    particlesContainer.style.display = 'none';
}

if (window.particlesJS && particlesContainer && !disableParticles) {
    const particleCount = shouldReduceEffects ? 30 : 80;
    const linkDistance = shouldReduceEffects ? 110 : 150;
    const linkOpacity = shouldReduceEffects ? 0.12 : 0.2;
    const moveSpeed = shouldReduceEffects ? 1 : 1.5;

    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": particleCount,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#3b82f6"
            },
            "shape": {
                "type": "circle",
            },
            "opacity": {
                "value": 0.3,
                "random": false,
            },
            "size": {
                "value": 3,
                "random": true,
            },
            "line_linked": {
                "enable": true,
                "distance": linkDistance,
                "color": "#6b7280",
                "opacity": linkOpacity,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": moveSpeed,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": !shouldReduceEffects,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": !shouldReduceEffects,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 0.8
                    }
                },
                "push": {
                    "particles_nb": 4
                }
            }
        },
        "retina_detect": !shouldReduceEffects
    });
}

const githubUsername = 'Gagan-Singh-Dev';
const projectsContainer = document.getElementById('github-projects');

async function fetchGithubProjects() {
    if (!projectsContainer) return;

    try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=20`);

        if (!response.ok) {
            throw new Error(`GitHub API reacted with status: ${response.status}`);
        }

        const repos = await response.json();
        const profileRepoName = githubUsername.toLowerCase();

        const visibleRepos = repos
            .filter(repo => repo.name.toLowerCase() !== profileRepoName)
            .slice(0, 6);

        projectsContainer.innerHTML = '';

        visibleRepos.forEach(repo => {
            let category = 'other';
            const lang = repo.language ? repo.language.toLowerCase() : '';

            if (['javascript', 'html', 'css', 'typescript', 'vue', 'react'].includes(lang)) {
                category = 'web';
            } else if (['python', 'shell', 'bash', 'ruby', 'c', 'java'].includes(lang)) {
                category = 'script';
            }

            const card = document.createElement('div');
            card.className = 'project-card reveal active';
            card.dataset.category = category;
            card.style.cursor = 'pointer';
            card.onclick = (e) => {
                if (e.target.closest('a')) return;
                window.open(repo.html_url, '_blank', 'noopener,noreferrer');
            };

            const friendlyName = repo.name.replace(/-/g, ' ').replace(/_/g, ' ');

            let description = repo.description || 'No description provided for this repository.';
            if (description.length > 120) {
                description = description.substring(0, 117) + '...';
            }

            const projectHeader = document.createElement('div');
            projectHeader.className = 'project-header';

            const projectIcon = document.createElement('i');
            projectIcon.className = 'fa-regular fa-folder-open project-icon';
            projectHeader.appendChild(projectIcon);

            const projectLinks = document.createElement('div');
            projectLinks.className = 'project-links';

            if (repo.homepage) {
                const homepageLink = document.createElement('a');
                homepageLink.href = repo.homepage;
                homepageLink.target = '_blank';
                homepageLink.rel = 'noopener noreferrer';
                homepageLink.setAttribute('aria-label', 'Live Demo');

                const homepageIcon = document.createElement('i');
                homepageIcon.className = 'fa-solid fa-arrow-up-right-from-square';
                homepageLink.appendChild(homepageIcon);
                projectLinks.appendChild(homepageLink);
            }

            const githubLink = document.createElement('a');
            githubLink.href = repo.html_url;
            githubLink.target = '_blank';
            githubLink.rel = 'noopener noreferrer';
            githubLink.setAttribute('aria-label', 'GitHub Repo');

            const githubIcon = document.createElement('i');
            githubIcon.className = 'fa-brands fa-github';
            githubLink.appendChild(githubIcon);
            projectLinks.appendChild(githubLink);
            projectHeader.appendChild(projectLinks);

            const projectBody = document.createElement('div');
            projectBody.className = 'project-body';

            const projectName = document.createElement('h3');
            projectName.style.textTransform = 'capitalize';
            projectName.textContent = friendlyName;

            const projectDescription = document.createElement('p');
            projectDescription.textContent = description;

            projectBody.appendChild(projectName);
            projectBody.appendChild(projectDescription);

            const projectFooter = document.createElement('div');
            projectFooter.className = 'project-footer';

            const techTags = document.createElement('div');
            techTags.className = 'tech-tags';

            const languageTag = document.createElement('span');
            languageTag.className = 'tech-tag';
            languageTag.textContent = repo.language || 'Documentation';
            techTags.appendChild(languageTag);

            if (repo.stargazers_count > 0) {
                const starsTag = document.createElement('span');
                starsTag.className = 'tech-tag';
                starsTag.innerHTML = `<i class="fa-solid fa-star" style="margin-right:4px;"></i>${repo.stargazers_count}`;
                techTags.appendChild(starsTag);
            }

            if (repo.forks_count > 0) {
                const forksTag = document.createElement('span');
                forksTag.className = 'tech-tag';
                forksTag.innerHTML = `<i class="fa-solid fa-code-fork" style="margin-right:4px;"></i>${repo.forks_count}`;
                techTags.appendChild(forksTag);
            }

            projectFooter.appendChild(techTags);

            card.appendChild(projectHeader);
            card.appendChild(projectBody);
            card.appendChild(projectFooter);

            projectsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--card-bg); border-radius: var(--border-radius-lg); border: 1px solid var(--border-color);">
                <i class="fa-brands fa-github" style="font-size: 3rem; margin-bottom: 1rem; color: var(--text-light);"></i>
                <p style="color: var(--text-color); font-size: 1.1rem;">Failed to load projects from GitHub.</p>
                <p style="color: var(--text-light); font-size: 0.9rem; margin-top: 0.5rem;">Please try refreshing the page or check back later.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchGithubProjects();

    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');
            const projectCards = document.querySelectorAll('.project-card');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        card.style.visibility = 'visible';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.visibility = 'hidden';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

const contactForm = document.getElementById('contact-form');
const formMsg = document.getElementById('form-msg');

if (contactForm && formMsg) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Please fill out all fields before sending.';
            formMsg.className = 'form-msg error';
            return;
        }

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        const formData = new FormData(contactForm);
        formData.set('_subject', `Portfolio Contact: ${name}`);

        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            const response = await fetch('https://formsubmit.co/ajax/gagan.singh.dev@outlook.com', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            const data = await response.json().catch(() => ({}));
            const requestSucceeded = response.ok && (data.success === 'true' || data.success === true || data.message);

            if (!requestSucceeded) {
                throw new Error(data.message || 'Form submission failed');
            }

            contactForm.reset();
            btn.innerHTML = originalText;
            btn.disabled = false;

            formMsg.innerHTML = '<i class="fa-solid fa-circle-check" style="margin-right: 8px;"></i> Message sent successfully! I will get back to you soon.';
            formMsg.className = 'form-msg success';

            setTimeout(() => {
                formMsg.className = 'form-msg';
            }, 6000);
        } catch (error) {
            console.error('Submission Error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;

            const subject = encodeURIComponent('Portfolio Contact from ' + name);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            const fallbackMailto = `mailto:gagan.singh.dev@outlook.com?subject=${subject}&body=${body}`;

            formMsg.innerHTML = `<i class="fa-solid fa-circle-xmark" style="margin-right: 8px;"></i> Form service is unavailable right now. <a href="${fallbackMailto}">Send via email app</a>.`;
            formMsg.className = 'form-msg error';

            setTimeout(() => {
                formMsg.className = 'form-msg';
            }, 6000);
        }
    });
}

const footer = document.getElementById('footer');
if (footer) {
    const count = disableParticles ? 0 : (shouldReduceEffects ? 8 : 18);
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'footer-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = '0';
        p.style.animationDuration = (4 + Math.random() * 6) + 's';
        p.style.animationDelay = (Math.random() * 8) + 's';
        p.style.width = p.style.height = (1 + Math.random() * 2) + 'px';
        p.style.opacity = 0;
        footer.appendChild(p);
    }
}
