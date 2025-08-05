// Scroll-funksjonalitet
class CardScroller {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.dots = document.querySelectorAll('.dot');
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDots();
        this.positionSections();
    }
    
    setupEventListeners() {
        // Mus-scroll
        document.addEventListener('wheel', (e) => {
            // Sjekk om modal er åpen
            const aboutModal = document.getElementById('about-modal');
            if (aboutModal && aboutModal.classList.contains('active')) {
                return; // Ikke scroll når modal er åpen
            }
            
            e.preventDefault();
            if (!this.isScrolling) {
                if (e.deltaY > 0) {
                    this.nextSection();
                } else {
                    this.previousSection();
                }
            }
        }, { passive: false });
        
        // Tastatur
        document.addEventListener('keydown', (e) => {
            // Sjekk om modal er åpen
            const aboutModal = document.getElementById('about-modal');
            if (aboutModal && aboutModal.classList.contains('active')) {
                return; // Ikke tastatur når modal er åpen
            }
            
            if (!this.isScrolling) {
                if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    e.preventDefault();
                    this.nextSection();
                } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                    e.preventDefault();
                    this.previousSection();
                }
            }
        });
        
        // Touch for mobil
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            // Check if modal is open
            const aboutModal = document.getElementById('about-modal');
            if (aboutModal && aboutModal.classList.contains('active')) {
                return; // Don't handle touch when modal is open
            }
            
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            // Check if modal is open
            const aboutModal = document.getElementById('about-modal');
            if (aboutModal && aboutModal.classList.contains('active')) {
                return; // Don't handle touch when modal is open
            }
            
            touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50 && !this.isScrolling) {
                if (diff > 0) {
                    this.nextSection();
                } else {
                    this.previousSection();
                }
            }
        }, { passive: true });
        
        // Prikk-navigasjon
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSection(index);
            });
        });
        
        // Hovedmeny
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                const targetIndex = Array.from(this.sections).findIndex(section => section.id === target);
                if (targetIndex !== -1) {
                    this.goToSection(targetIndex);
                }
            });
        });
    }
    
    positionSections() {
        this.sections.forEach((section, index) => {
            if (index === 0) {
                section.classList.add('active');
                section.classList.remove('next', 'prev');
            } else {
                section.classList.add('next');
                section.classList.remove('active', 'prev');
            }
        });
    }
    
    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.goToSection(this.currentSection + 1);
        }
    }
    
    previousSection() {
        if (this.currentSection > 0) {
            this.goToSection(this.currentSection - 1);
        }
    }
    
    goToSection(index) {
        console.log('goToSection called with index:', index, 'currentSection:', this.currentSection);
        if (this.isScrolling || index === this.currentSection) return;
        
        this.isScrolling = true;
        this.currentSection = index;
        
        console.log('Updating section classes...');
        // Oppdater seksjoner
        this.sections.forEach((section, i) => {
            section.classList.remove('active', 'next', 'prev');
            
            if (i === index) {
                section.classList.add('active');
                console.log('Section', i, 'set to active');
            } else if (i > index) {
                section.classList.add('next');
                console.log('Section', i, 'set to next');
            } else {
                section.classList.add('prev');
                console.log('Section', i, 'set to prev');
            }
        });
        
        // Oppdater prikker
        this.updateDots();
        
        // Vis/skjul scroll-indikator
        this.updateScrollIndicator();
        
        // Oppdater URL
        const targetSection = this.sections[index];
        history.pushState(null, null, `#${targetSection.id}`);
        
        // Start animasjoner
        this.animateSection(targetSection);
        
        // Reset scroll-flag
        setTimeout(() => {
            this.isScrolling = false;
        }, 800);
    }
    
    updateScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            if (this.currentSection === 0) {
                // Vis på hero
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.visibility = 'visible';
            } else {
                // Skjul på andre
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.visibility = 'hidden';
            }
        }
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
        });
    }
    
    animateSection(section) {
        // Start inngangs-animasjoner
        const animatedElements = section.querySelectorAll('.project-card, .skill-item, .contact-item');
        
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Start scroll-system
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing CardScroller...');
    const cardScroller = new CardScroller();
    console.log('CardScroller initialized with sections:', cardScroller.sections.length);
});

    // Mobil-meny
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Lukk meny ved klikk
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Navbar bakgrunn
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Bakgrunns-animasjoner
function animateBackgroundElements() {
    const elements = document.querySelectorAll('.element');
    
    elements.forEach((element, index) => {
        const delay = index * 0.5;
        element.style.animation = `float 6s ease-in-out ${delay}s infinite`;
    });
}

        // Legg til flyte-animasjon
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Start bakgrunns-animasjoner
document.addEventListener('DOMContentLoaded', animateBackgroundElements);

// Skrive-effekt
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Alternativ skrive-effekt
function typeWriterLines() {
    const titleLines = document.querySelectorAll('.title-line');
    let currentLine = 0;
    let currentChar = 0;
    
    function typeNextChar() {
        if (currentLine < titleLines.length) {
            const line = titleLines[currentLine];
            const text = line.textContent;
            
            if (currentChar < text.length) {
                line.textContent = text.substring(0, currentChar + 1);
                currentChar++;
                setTimeout(typeNextChar, 100);
            } else {
                currentLine++;
                currentChar = 0;
                setTimeout(typeNextChar, 200);
            }
        }
    }
    
            // Reset alle linjer
    titleLines.forEach(line => {
        line.textContent = '';
    });
    
    typeNextChar();
}

// Hero-animasjoner
class HeroAnimations {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.heroContent = document.querySelector('.hero-content');
        this.titleLines = document.querySelectorAll('.title-line');
        this.subtitle = document.querySelector('.hero-subtitle');
        this.heroTag = document.querySelector('.hero-tag');
        this.backgroundElements = document.querySelectorAll('.element');
        
        this.init();
    }
    
    init() {
        this.setupInitialState();
        this.startLoadingAnimations();
        this.setupScrollEffects();
        this.setupParallaxEffects();
    }
    
    setupInitialState() {
        // Sett start-tilstand
        this.titleLines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-100px)';
        });
        
        if (this.subtitle) {
            this.subtitle.style.opacity = '0';
            this.subtitle.style.transform = 'translateY(30px)';
        }
        
        if (this.heroTag) {
            this.heroTag.style.opacity = '0';
            this.heroTag.style.transform = 'scale(0.8)';
        }
        
        this.backgroundElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(100px)';
        });
    }
    
    startLoadingAnimations() {
        // Tittel-animasjoner
        this.titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 400);
        });
        
        // Undertittel
        setTimeout(() => {
            if (this.subtitle) {
                this.subtitle.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.subtitle.style.opacity = '1';
                this.subtitle.style.transform = 'translateY(0)';
            }
        }, 1000);
        
        // Hero-knapp
        setTimeout(() => {
            if (this.heroTag) {
                this.heroTag.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.heroTag.style.opacity = '1';
                this.heroTag.style.transform = 'scale(1)';
            }
        }, 1200);
        
        // Bakgrunnselementer
        this.backgroundElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '0.1';
                element.style.transform = 'translateY(0)';
            }, 1400 + (index * 200));
        });
    }
    

    
    setupScrollEffects() {
        // Scroll-animasjoner
        window.addEventListener('scroll', () => {
            if (this.heroSection) {
                const rect = this.heroSection.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    this.animateOnScroll();
                }
            }
        });
    }
    
    animateOnScroll() {
        // Subtile animasjoner
        if (this.heroContent) {
            this.heroContent.style.transform = 'translateY(-10px)';
            this.heroContent.style.transition = 'transform 0.3s ease';
        }
        
        // Bakgrunn på scroll
        this.backgroundElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transform = 'translateY(-20px) scale(1.1)';
                element.style.transition = 'transform 0.5s ease';
            }, index * 100);
        });
        
        // Tekst-effekter
        this.titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animation = 'textGlow 2s ease-in-out infinite';
                setTimeout(() => {
                    line.style.animation = '';
                }, 2000);
            }, index * 200);
        });
        
        // Pulse-effekt
        if (this.subtitle) {
            this.subtitle.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                this.subtitle.style.animation = '';
            }, 1000);
        }
        
        // Bounce-effekt
        if (this.heroTag) {
            this.heroTag.style.animation = 'floatUp 1s ease-in-out';
            setTimeout(() => {
                this.heroTag.style.animation = '';
            }, 1000);
        }
    }
    
    setupParallaxEffects() {
        // Parallax-effekt
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            this.backgroundElements.forEach((element, index) => {
                const speed = element.dataset.speed || 0.5;
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }
}

        // Start loading-effekt
window.addEventListener('load', () => {
    new HeroAnimations();
});

// "Vis mer" knapper
document.querySelectorAll('.show-more').forEach(button => {
    button.addEventListener('click', function() {
        const section = this.closest('section');
        const hiddenContent = section.querySelector('.hidden-content');
        
        if (hiddenContent) {
            if (hiddenContent.style.display === 'none' || hiddenContent.style.display === '') {
                hiddenContent.style.display = 'block';
                this.querySelector('span').textContent = 'Show less';
            } else {
                hiddenContent.style.display = 'none';
                this.querySelector('span').textContent = 'Show me more';
            }
        }
    });
});

// Prosjekt-kort hover
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Ferdigheter hover
document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.05)';
        this.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.3)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    });
});

// Om meg Modal
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Modal
    const aboutModal = document.getElementById('about-modal');
    const heroTag = document.querySelector('.hero-tag');
    const closeContact = document.querySelector('.close-contact');
    
    // Åpne modal
    if (heroTag) {
        heroTag.addEventListener('click', () => {
            aboutModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stopp bakgrunns-scroll
        });
    }
    
    // Lukk modal
    if (closeContact) {
        closeContact.addEventListener('click', () => {
            aboutModal.classList.remove('active');
            document.body.style.overflow = ''; // Gjenopprett scroll
        });
    }
    
    // Lukk ved klikk utenfor
    aboutModal.addEventListener('click', (e) => {
        if (e.target === aboutModal) {
            aboutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Lukk med Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && aboutModal.classList.contains('active')) {
            aboutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Skjema-validering
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.querySelector('.submit-button');
    const inputs = document.querySelectorAll('.input input, .input textarea');
    
    function validateForm() {
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
            }
        });
        
        if (submitButton) {
            submitButton.disabled = !isValid;
        }
    }
    
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
        input.addEventListener('blur', validateForm);
    });
    
    // Skjema-innsending
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Her ville du normalt sende skjema-data
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
            validateForm();
        });
    }
}); 