/**
 * FT-WEB-101-Task1: Personal Profile Page
 * Student: Amira | Student ID: 224101396
 * 
 * Script Features:
 * 1. Dark/Light Theme Switching with localStorage & OS Preference
 * 2. Mobile Navigation Drawer & Outside Click Handling
 * 3. Scrollspy Active Navigation Indicator
 * 4. High-Performance Neon Mouse Trail (Smooth Bezier Curve, Auto-pausing, Touch-safe)
 * 5. Accessible Contact Form Validation & Feedback
 */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* ==========================================================================
       1. THEME SWITCHING (Strict Requirements #10 & #11)
       ========================================================================== */
    const themeButton = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const STORAGE_KEY = "amira_portfolio_theme";

    // Detect user preference from localStorage or system theme
    function getPreferredTheme() {
        const storedTheme = localStorage.getItem(STORAGE_KEY);
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    // Apply theme state to DOM
    function applyTheme(theme) {
        const isDark = theme === "dark";
        if (isDark) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }

        if (themeButton) {
            themeButton.setAttribute("aria-pressed", isDark);
            if (themeIcon) {
                themeIcon.textContent = isDark ? "☀️" : "🌙";
            }
        }
    }

    // Initialize theme
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    // Toggle theme on button click
    if (themeButton) {
        themeButton.addEventListener("click", function () {
            // Strict Requirement #10: toggle 'dark' class on body
            document.body.classList.toggle("dark");

            const isDark = document.body.classList.contains("dark");
            const newTheme = isDark ? "dark" : "light";

            localStorage.setItem(STORAGE_KEY, newTheme);

            if (themeIcon) {
                themeIcon.textContent = isDark ? "☀️" : "🌙";
            }
            themeButton.setAttribute("aria-pressed", isDark);
        });
    }

    // Listen for OS theme changes if user hasn't explicitly set a preference
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? "dark" : "light");
        }
    });

    /* ==========================================================================
       2. MOBILE NAVIGATION DRAWER
       ========================================================================== */
    const mobileToggle = document.getElementById("mobile-nav-toggle");
    const navContainer = document.getElementById("nav-container");
    const navLinks = document.querySelectorAll(".nav-link");

    if (mobileToggle && navContainer) {
        mobileToggle.addEventListener("click", function () {
            const isOpen = navContainer.classList.toggle("open");
            mobileToggle.classList.toggle("active", isOpen);
            mobileToggle.setAttribute("aria-expanded", isOpen);
        });

        // Close mobile menu when clicking any nav link
        navLinks.forEach(link => {
            link.addEventListener("click", function () {
                navContainer.classList.remove("open");
                mobileToggle.classList.remove("active");
                mobileToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener("click", function (event) {
            if (!navContainer.contains(event.target) && !mobileToggle.contains(event.target)) {
                navContainer.classList.remove("open");
                mobileToggle.classList.remove("active");
                mobileToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ==========================================================================
       3. SCROLLSPY ACTIVE NAVIGATION INDICATOR
       ========================================================================== */
    const sections = [
        { id: "home", link: document.querySelector('.nav-link[href="#home"]') },
        { id: "about", link: document.querySelector('.nav-link[href="#about"]') },
        { id: "contact", link: document.querySelector('.nav-link[href="#contact"]') }
    ];

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 120;

        for (let i = sections.length - 1; i >= 0; i--) {
            const sectionEl = document.getElementById(sections[i].id);
            if (sectionEl) {
                const sectionTop = sectionEl.offsetTop;
                if (scrollPosition >= sectionTop) {
                    navLinks.forEach(link => link.classList.remove("active"));
                    if (sections[i].link) {
                        sections[i].link.classList.add("active");
                    }
                    break;
                }
            }
        }
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });

    /* ==========================================================================
       4. HIGH-PERFORMANCE NEON MOUSE TRAIL
       ========================================================================== */
    const canvas = document.getElementById("cursor-trail");

    // Only enable mouse trail on non-touch devices with fine pointers and no reduced motion
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches ||
                          ("ontouchstart" in window) ||
                          (navigator.maxTouchPoints > 0);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canvas && !isTouchDevice && !prefersReducedMotion) {
        const ctx = canvas.getContext("2d");
        let points = [];
        let animationFrameId = null;
        let isLoopRunning = false;

        function resizeCanvas() {
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = window.innerWidth * pixelRatio;
            canvas.height = window.innerHeight * pixelRatio;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Track cursor coordinates
        window.addEventListener("mousemove", function (event) {
            points.push({
                x: event.clientX,
                y: event.clientY,
                life: 1.0,
                maxLife: 1.0
            });

            // Keep array size optimal for smooth performance
            if (points.length > 32) {
                points.shift();
            }

            // Wake up animation loop if it was idle
            if (!isLoopRunning) {
                isLoopRunning = true;
                animationFrameId = requestAnimationFrame(renderNeonTrail);
            }
        }, { passive: true });

        // Clean up points if cursor leaves window
        document.addEventListener("mouseleave", function () {
            // Allow remaining trail to fade naturally
        });

        function renderNeonTrail() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const isDark = document.body.classList.contains("dark");

            if (points.length > 2) {
                // Pass 1: Broad, soft luminous neon aura
                for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1];
                    const curr = points[i];
                    const opacity = Math.max(0, curr.life);

                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);

                    ctx.strokeStyle = isDark
                        ? `rgba(56, 189, 248, ${opacity * 0.45})`
                        : `rgba(29, 78, 216, ${opacity * 0.35})`;
                    ctx.lineWidth = 10 * opacity;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    ctx.shadowBlur = isDark ? 22 : 14;
                    ctx.shadowColor = isDark ? "#38bdf8" : "#2563eb";

                    ctx.stroke();
                }

                // Pass 2: High-intensity, silky smooth Bezier neon core
                for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1];
                    const curr = points[i];
                    const opacity = Math.max(0, curr.life);

                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);

                    ctx.strokeStyle = isDark
                        ? `rgba(240, 249, 255, ${opacity * 0.95})`
                        : `rgba(186, 230, 253, ${opacity * 0.95})`;
                    ctx.lineWidth = 3.5 * opacity;
                    ctx.lineCap = "round";
                    ctx.lineJoin = "round";
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = isDark ? "#ffffff" : "#0284c7";

                    ctx.stroke();
                }
            }

            // Fade trail points naturally
            for (let i = 0; i < points.length; i++) {
                points[i].life -= 0.038;
            }

            // Remove expired points
            points = points.filter(p => p.life > 0);

            // Auto-pause loop when no points remain to save 100% CPU when idle
            if (points.length > 0) {
                animationFrameId = requestAnimationFrame(renderNeonTrail);
            } else {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                isLoopRunning = false;
            }
        }
    } else if (canvas) {
        // If on touch device or prefers-reduced-motion, hide canvas completely
        canvas.style.display = "none";
    }

    /* ==========================================================================
       5. ACCESSIBLE CONTACT FORM VALIDATION (Strict Requirements #7 & #8)
       ========================================================================== */
    const contactForm = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const nameHint = document.getElementById("name-hint");
    const emailHint = document.getElementById("email-hint");
    const formFeedback = document.getElementById("form-feedback");

    if (contactForm && nameInput && emailInput) {
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function validateName() {
            const isValid = nameInput.value.trim().length >= 2;
            if (!isValid && nameInput.value.trim().length > 0) {
                nameInput.classList.add("invalid");
                nameInput.classList.remove("valid");
                if (nameHint) nameHint.classList.add("visible");
            } else if (isValid) {
                nameInput.classList.remove("invalid");
                nameInput.classList.add("valid");
                if (nameHint) nameHint.classList.remove("visible");
            } else {
                nameInput.classList.remove("invalid", "valid");
                if (nameHint) nameHint.classList.remove("visible");
            }
            return isValid;
        }

        function validateEmail() {
            const isValid = emailRegex.test(emailInput.value.trim());
            if (!isValid && emailInput.value.trim().length > 0) {
                emailInput.classList.add("invalid");
                emailInput.classList.remove("valid");
                if (emailHint) emailHint.classList.add("visible");
            } else if (isValid) {
                emailInput.classList.remove("invalid");
                emailInput.classList.add("valid");
                if (emailHint) emailHint.classList.remove("visible");
            } else {
                emailInput.classList.remove("invalid", "valid");
                if (emailHint) emailHint.classList.remove("visible");
            }
            return isValid;
        }

        // Live validation listeners on input
        nameInput.addEventListener("input", validateName);
        emailInput.addEventListener("input", validateEmail);

        // Form submission handling
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();

            if (!isNameValid || !isEmailValid) {
                if (!isNameValid && nameHint) nameHint.classList.add("visible");
                if (!isEmailValid && emailHint) emailHint.classList.add("visible");
                return;
            }

            // Display polite success message with student demo disclosure
            const userName = nameInput.value.trim();
            if (formFeedback) {
                formFeedback.className = "form-feedback success";
                formFeedback.innerHTML = `<strong>Thank you, ${escapeHtml(userName)}!</strong> Your message details are valid. <br><span style="font-size: 0.85em; opacity: 0.88;">(Demo Notice: As a frontend demonstration assignment, this verifies client-side interaction without an active backend service.)</span>`;
            }

            // Reset form fields
            contactForm.reset();
            nameInput.classList.remove("valid");
            emailInput.classList.remove("valid");
        });
    }

    // Helper to prevent HTML injection in feedback message
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
});
