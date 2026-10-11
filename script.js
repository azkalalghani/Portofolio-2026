// ===== Project data (edit text/images here) =====
// Add more image paths to `images` to get a gallery with thumbnails in the modal.
const projects = {
    neurolink: {
        category: "UI/UX",
        title: "Neurolink",
        tagline: "A task manager that connect the team",
        description: "Neurolink is a task management dashboard designed to keep cross-functional teams aligned. I ran user interviews to map how teams track work, then designed a board view that surfaces priorities, owners, and deadlines at a glance.\n\nThe result is a clean, scannable interface that reduces context switching and helps teams stay in sync.",
        role: "UI/UX Designer",
        tools: "Figma, FigJam",
        year: "2025",
        bg: "linear-gradient(0deg, #4e4f67 0%, #9c9ecd 100%)",
        images: ["assets/neurolink.png"],
    },
    rangemate: {
        category: "UI/UX",
        title: "Rangemate",
        tagline: "A task manager that connect the team",
        description: "Rangemate helps teams plan and coordinate work across schedules. I focused on information architecture and a warm, energetic visual language that makes planning feel less like a chore.",
        role: "UI/UX Designer",
        tools: "Figma",
        year: "2025",
        bg: "linear-gradient(180deg, #ff5b00 0%, #311c10 100%)",
        images: ["assets/rangemate.png"],
    },
    fulus: {
        category: "UI/UX",
        title: "Fulus",
        tagline: "A finance dashboard to monitor and manage your expenses",
        description: "Fulus is a personal finance experience built around clarity. Research showed users felt overwhelmed by numbers, so the design prioritises simple summaries and progressive disclosure of details.\n\nFeatured UI modals include quick Search, real-time Notifications & account alerts, and Project Share permissions.",
        role: "UI/UX Designer",
        tools: "Figma, Maze",
        year: "2024",
        bg: "linear-gradient(180deg, #6d9ddf 0%, #3b5579 100%)",
        images: [
            "assets/Search Modal.png",
            "assets/Notifications Modal.png",
            "assets/Share Modal.png"
        ],
    },
    coint: {
        category: "UI/UX",
        title: "Coint",
        tagline: "A finance mobile app to track your money",
        description: "Coint is a mobile-first personal finance app concept. I designed the end-to-end flow from onboarding to daily expense and bills tracking, validating the layout with usability tests on real devices.",
        role: "UI/UX Designer",
        tools: "Figma",
        year: "2024",
        bg: "linear-gradient(0deg, #56674e 0%, #9ccd9f 100%)",
        images: ["assets/coint.png"],
    },
    "neurolink-fe": {
        category: "Frontend",
        title: "Neurolink",
        tagline: "Neurolink Landing Page",
        description: "Frontend implementation of the Neurolink landing page: a responsive, accessible web layout built from the design system with reusable components.",
        role: "Frontend Developer",
        tools: "HTML, CSS, JavaScript",
        year: "2025",
        bg: "linear-gradient(0deg, #4e4f67 0%, #9c9ecd 100%)",
        images: ["assets/NeurolinkLanding.png"],
        link: "https://azkalalghani.github.io/Neurolink-Lading-Page/",
        linkText: "Visit Landing Page",
    },
    // "rangemate-fe": {
    //     category: "Frontend",
    //     title: "Rangemate",
    //     tagline: "A task manager that connect the team",
    //     description: "Frontend build of Rangemate, translating the Figma design into a pixel-accurate, responsive web interface with smooth micro-interactions.",
    //     role: "Frontend Developer",
    //     tools: "HTML, CSS, JavaScript",
    //     year: "2025",
    //     bg: "linear-gradient(180deg, #ff5b00 0%, #311c10 100%)",
    //     images: ["assets/rangemate.png"],
    // },
};

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

// ===== Get in touch: per-word opacity on scroll =====
const scrubText = document.getElementById("scrub-text");
scrubText.innerHTML = scrubText.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="word">${w}</span>`)
    .join(" ");
const words = scrubText.querySelectorAll(".word");

function updateWords() {
    const rect = scrubText.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when the text enters at the bottom 90% of the viewport, 1 when it reaches 40%
    const start = vh * 0.9;
    const end = vh * 0.4;
    const progress = Math.min(Math.max((start - rect.top) / (start - end + rect.height), 0), 1);
    const lit = progress * words.length;

    words.forEach((word, i) => {
        word.style.opacity = 0.15 + 0.85 * Math.min(Math.max(lit - i, 0), 1);
    });
}

let ticking = false;
window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateWords(); ticking = false; });
}, { passive: true });
window.addEventListener("resize", updateWords);
updateWords();

// ===== Project modal & Horizontal Image Slider =====
const modal = document.getElementById("project-modal");
const modalSlider = document.getElementById("modal-slider");
const modalPrev = document.getElementById("modal-prev");
const modalNext = document.getElementById("modal-next");
const modalDots = document.getElementById("modal-dots");
const modalThumbs = document.getElementById("modal-thumbs");
const $ = (id) => document.getElementById(id);

let autoScrollTimer = null;
let idleTimer = null;
const IDLE_WAIT = 2000;    // If not being scrolled for 2s, automatically scroll to next photo
const AUTO_INTERVAL = 2000; // Then keep advancing every 2s

function clearAutoScrollTimers() {
    clearTimeout(autoScrollTimer);
    clearTimeout(idleTimer);
    autoScrollTimer = null;
    idleTimer = null;
}

function getSlideIndex() {
    const width = modalSlider.clientWidth;
    if (!width) return 0;
    return Math.round(modalSlider.scrollLeft / width);
}

function updatePagination(index) {
    if (index === undefined) index = getSlideIndex();
    const dots = modalDots.querySelectorAll(".modal__dot");
    dots.forEach((dot, i) => {
        dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
    const thumbs = modalThumbs.querySelectorAll("button");
    thumbs.forEach((thumb, i) => {
        thumb.setAttribute("aria-current", i === index ? "true" : "false");
    });
}

function scrollToSlide(index, behavior = "smooth") {
    const width = modalSlider.clientWidth;
    if (!width) return;
    modalSlider.scrollTo({
        left: index * width,
        behavior
    });
    updatePagination(index);
}

function advanceSlide() {
    if (!modal.open) return;
    const slides = modalSlider.querySelectorAll(".modal__slide");
    if (slides.length <= 1) return;

    const currentIndex = getSlideIndex();
    const nextIndex = (currentIndex + 1) % slides.length;
    scrollToSlide(nextIndex, "smooth");

    // Continue auto-scroll cycle every 2s while idle
    autoScrollTimer = setTimeout(advanceSlide, AUTO_INTERVAL);
}

function startAutoScrollCycle() {
    clearAutoScrollTimers();
    if (!modal.open) return;
    const slides = modalSlider.querySelectorAll(".modal__slide");
    if (slides.length <= 1) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    idleTimer = setTimeout(() => {
        advanceSlide();
    }, IDLE_WAIT);
}

// User scroll or interaction resets the 2s idle timer
function onUserActivity() {
    clearAutoScrollTimers();
    updatePagination();

    if (!modal.open) return;
    const slides = modalSlider.querySelectorAll(".modal__slide");
    if (slides.length <= 1) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    idleTimer = setTimeout(() => {
        advanceSlide();
    }, IDLE_WAIT);
}

function openModal(id) {
    const p = projects[id];
    if (!p) return;

    $("modal-category").textContent = p.category;
    $("modal-title").textContent = p.title;
    $("modal-tagline").textContent = p.tagline;
    $("modal-desc").textContent = p.description;
    $("modal-role").textContent = p.role;
    $("modal-tools").textContent = p.tools;
    $("modal-year").textContent = p.year;
    modal.style.setProperty("--bg", p.bg);

    clearAutoScrollTimers();

    // Render slides
    modalSlider.innerHTML = p.images.map((src, i) => `
        <div class="modal__slide" data-index="${i}">
            <img src="${src}" alt="${p.title} preview ${i + 1}" loading="lazy">
        </div>
    `).join("");

    const hasMultiple = p.images.length > 1;

    if (hasMultiple) {
        modalPrev.classList.add("is-visible");
        modalNext.classList.add("is-visible");
        modalDots.innerHTML = p.images.map((_, i) => `
            <button type="button" class="modal__dot" data-index="${i}" aria-current="${i === 0 ? "true" : "false"}" aria-label="Go to slide ${i + 1}"></button>
        `).join("");
        modalThumbs.innerHTML = p.images.map((src, i) => `
            <button type="button" data-index="${i}" aria-current="${i === 0 ? "true" : "false"}" aria-label="Photo ${i + 1}">
                <img src="${src}" alt="">
            </button>
        `).join("");
    } else {
        modalPrev.classList.remove("is-visible");
        modalNext.classList.remove("is-visible");
        modalDots.innerHTML = "";
        modalThumbs.innerHTML = "";
    }

    modal.showModal();

    requestAnimationFrame(() => {
        modalSlider.scrollLeft = 0;
        updatePagination(0);
        if (hasMultiple) {
            startAutoScrollCycle();
        }
    });
}

function closeModal() {
    if (!modal.open || modal.classList.contains("is-closing")) return;
    clearAutoScrollTimers();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return modal.close();
    modal.classList.add("is-closing");
    modal.addEventListener("animationend", function done(e) {
        if (e.target !== modal || e.animationName !== "modal-out") return;
        modal.removeEventListener("animationend", done);
        modal.classList.remove("is-closing");
        modal.close();
    });
}

// Scroll event on horizontal slider
modalSlider.addEventListener("scroll", () => {
    onUserActivity();
}, { passive: true });

// Prev/Next buttons
modalPrev.addEventListener("click", () => {
    const slides = modalSlider.querySelectorAll(".modal__slide");
    if (slides.length <= 1) return;
    const prevIndex = (getSlideIndex() - 1 + slides.length) % slides.length;
    scrollToSlide(prevIndex, "smooth");
    onUserActivity();
});

modalNext.addEventListener("click", () => {
    const slides = modalSlider.querySelectorAll(".modal__slide");
    if (slides.length <= 1) return;
    const nextIndex = (getSlideIndex() + 1) % slides.length;
    scrollToSlide(nextIndex, "smooth");
    onUserActivity();
});

// Dots & Thumbnails click
modalDots.addEventListener("click", (e) => {
    const dot = e.target.closest(".modal__dot");
    if (!dot) return;
    scrollToSlide(parseInt(dot.dataset.index, 10), "smooth");
    onUserActivity();
});

modalThumbs.addEventListener("click", (e) => {
    const thumb = e.target.closest("button");
    if (!thumb) return;
    scrollToSlide(parseInt(thumb.dataset.index, 10), "smooth");
    onUserActivity();
});

// Arrow keys keyboard support
modalSlider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        modalPrev.click();
    } else if (e.key === "ArrowRight") {
        e.preventDefault();
        modalNext.click();
    }
});

// Keep slide in place on window resize
window.addEventListener("resize", () => {
    if (modal.open) {
        const cur = getSlideIndex();
        scrollToSlide(cur, "instant");
    }
});

// Project cards click
document.querySelectorAll(".card[data-project]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.project));
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(card.dataset.project);
        }
    });
});

$("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
modal.addEventListener("cancel", (e) => { e.preventDefault(); closeModal(); });
modal.addEventListener("close", clearAutoScrollTimers);
