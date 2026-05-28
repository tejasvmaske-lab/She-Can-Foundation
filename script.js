document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    const themeToggle = document.getElementById('theme-toggle');
    const volunteerForm = document.getElementById('volunteer-form');
    const formSuccessMsg = document.getElementById('form-success-msg');
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            
            const isMenuOpen = navMenu.classList.contains('open');
            const hamburger = mobileToggle.querySelector('.hamburger-icon');
            const close = mobileToggle.querySelector('.close-icon');
            
            if (isMenuOpen) {
                hamburger.style.display = 'none';
                close.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                hamburger.style.display = 'block';
                close.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
                mobileToggle.querySelector('.hamburger-icon').style.display = 'block';
                mobileToggle.querySelector('.close-icon').style.display = 'none';
                document.body.style.overflow = '';
            });
        });
    }

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'light';
            
            if (currentTheme === 'light') {
                newTheme = 'dark';
            }
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    const elementsToReveal = document.querySelectorAll('.scroll-reveal, .reveal-left, .reveal-right, .reveal-up');
    elementsToReveal.forEach(el => revealObserver.observe(el));

    const sections = document.querySelectorAll('section[id]');
    
    const highlightOptions = {
        threshold: 0.35,
        rootMargin: '-10% 0px -40% 0px'
    };

    const navHighlightObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, highlightOptions);

    sections.forEach(section => navHighlightObserver.observe(section));

    const startCountAnimation = (counterElement) => {
        const target = parseInt(counterElement.getAttribute('data-target'), 10);
        const duration = 1500;
        const startTime = performance.now();

        const countStep = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * target);
            
            counterElement.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(countStep);
            } else {
                counterElement.textContent = target;
            }
        };

        requestAnimationFrame(countStep);
    };

    const counterObserverOptions = {
        threshold: 0.8,
        rootMargin: '0px 0px -50px 0px'
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => startCountAnimation(counter));
                observer.unobserve(entry.target);
            }
        });
    }, counterObserverOptions);

    const impactSection = document.getElementById('impact');
    if (impactSection) {
        counterObserver.observe(impactSection);
    }

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const role = document.getElementById('join-role').value;
            
            console.log('Volunteer Application Submitted:', { name, email, role });
            
            volunteerForm.style.display = 'none';
            if (formSuccessMsg) {
                formSuccessMsg.style.display = 'flex';
            }
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('.newsletter-input');
            const email = emailInput.value;
            
            console.log('Newsletter Subscription:', email);
            
            if (newsletterSuccess) {
                newsletterSuccess.style.display = 'block';
                emailInput.value = '';
                
                setTimeout(() => {
                    newsletterSuccess.style.display = 'none';
                }, 4000);
            }
        });
    }
});
