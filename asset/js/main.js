/* ============================================================
   Portafolio — Aldayan A. Avila Dotel
   Interactividad: menú móvil, scroll-reveal, nav activa,
   botón subir, validación del formulario y tema claro/oscuro.
   ============================================================ */
(function () {
    "use strict";

    /* Marks that JS is active (to enable scroll-reveal in CSS
       without hiding content if JS fails). */
    document.documentElement.classList.add("js");

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    /* ---------- Tema claro / oscuro ---------- */
    (function initTheme() {
        var stored = null;
        try { stored = localStorage.getItem("theme"); } catch (e) {}
        var theme = stored || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
        document.documentElement.setAttribute("data-theme", theme);

        var toggle = $(".theme-toggle");
        if (toggle) {
            toggle.addEventListener("click", function () {
                var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
                var next = current === "light" ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", next);
                try { localStorage.setItem("theme", next); } catch (e) {}
            });
        }
    })();

    /* ---------- Header shadow on scroll ---------- */
    var header = $(".site-header");
    var toTop = $(".to-top");
    function onScrollHeader() {
        var y = window.scrollY || window.pageYOffset;
        if (header) header.classList.toggle("scrolled", y > 10);
        if (toTop) toTop.classList.toggle("visible", y > 500);
    }
    window.addEventListener("scroll", onScrollHeader, { passive: true });
    onScrollHeader();

    /* ---------- Botón subir ---------- */
    if (toTop) {
        toTop.addEventListener("click", function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
        });
    }

    /* ---------- Menú móvil ---------- */
    var toggle = $(".nav__toggle");
    var links = $(".nav__links");
    function closeMenu() {
        if (!toggle || !links) return;
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("open");
    }
    if (toggle && links) {
        toggle.addEventListener("click", function () {
            var open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        // Cierra al navegar
        $$("a", links).forEach(function (a) {
            a.addEventListener("click", closeMenu);
        });
        // Close on Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeMenu();
        });
    }

    /* ---------- Scroll reveal ---------- */
    var revealEls = $$(".aparecer");
    if (prefersReduced || !("IntersectionObserver" in window)) {
        revealEls.forEach(function (el) { el.classList.add("activo"); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("activo");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
        revealEls.forEach(function (el) { revealObserver.observe(el); });
    }

    /* ---------- Highlight active section in navigation ---------- */
    var navLinks = $$(".nav__links a[href^='#']");
    var sections = navLinks
        .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
        .filter(Boolean);

    if (sections.length && "IntersectionObserver" in window) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var id = entry.target.id;
                navLinks.forEach(function (a) {
                    a.classList.toggle("active", a.getAttribute("href") === "#" + id);
                });
            });
        }, { threshold: 0.5, rootMargin: "-30% 0px -60% 0px" });
        sections.forEach(function (s) { navObserver.observe(s); });
    }

    /* ---------- Contact form validation ---------- */
    var form = $("#form");
    var alerta = $("#alerta");
    if (form && alerta) {
        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        function showError(field, msg) {
            alerta.innerHTML = msg;
            if (field) {
                field.parentElement.classList.add("invalid");
                field.setAttribute("aria-invalid", "true");
            }
        }
        function clearError(field) {
            if (field) {
                field.parentElement.classList.remove("invalid");
                field.removeAttribute("aria-invalid");
            }
        }

        form.addEventListener("submit", function (event) {
            alerta.innerHTML = "";
            var nombre = $("#nombre", form);
            var email = $("#email", form);
            var asunto = $("#asunto", form);
            var mensaje = $("#mensaje", form);
            [nombre, email, asunto, mensaje].forEach(clearError);

            var errores = [];

            if (nombre.value.trim().length < 4 || nombre.value.trim().length > 50) {
                errores.push("Name must be between 4 and 50 characters.");
                showError(nombre, "");
            }
            if (!emailRe.test(email.value.trim())) {
                errores.push("Please enter a valid email address.");
                showError(email, "");
            }
            if (asunto.value.trim().length < 4 || asunto.value.trim().length > 50) {
                errores.push("Subject must be between 4 and 50 characters.");
                showError(asunto, "");
            }
            if (mensaje.value.trim().length < 5 || mensaje.value.trim().length > 300) {
                errores.push("Message must be between 5 and 300 characters.");
                showError(mensaje, "");
            }

            if (errores.length) {
                event.preventDefault();
                alerta.innerHTML = errores.join("<br>");
                return;
            }

            // All valid: let the form submit to formsubmit.co
            var btn = $("#enviar", form);
            if (btn) {
                btn.disabled = true;
                btn.textContent = "Sending...";
            }
        });
    }
})();
