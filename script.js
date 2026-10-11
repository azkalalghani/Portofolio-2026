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
        tagline: "A task manager that connect the team",
        description: "Fulus is a personal finance experience built around clarity. Research showed users felt overwhelmed by numbers, so the design prioritises simple summaries and progressive disclosure of details.",
        role: "UI/UX Designer",
        tools: "Figma, Maze",
        year: "2024",
        bg: "linear-gradient(180deg, #6d9ddf 0%, #3b5579 100%)",
        images: ["assets/fulus.png"],
    },
    coint: {
        category: "UI/UX",
        title: "Coint",
        tagline: "A task manager that connect the team",
        description: "Coint is a mobile-first app concept. I designed the end-to-end flow from onboarding to core tasks, validating the layout with quick usability tests on real devices.",
        role: "UI/UX Designer",
        tools: "Figma",
        year: "2024",
        bg: "linear-gradient(0deg, #56674e 0%, #9ccd9f 100%)",
        images: ["assets/coint.png"],
    },
    "neurolink-fe": {
        category: "Frontend",
        title: "Neurolink",
        tagline: "A task manager that connect the team",
        description: "Frontend implementation of the Neurolink dashboard: a responsive, accessible board layout built from the design system with reusable components.",
        role: "Frontend Developer",
        tools: "HTML, CSS, JavaScript",
        year: "2025",
        bg: "linear-gradient(0deg, #4e4f67 0%, #9c9ecd 100%)",
        images: ["assets/neurolink.png"],
    },
    "rangemate-fe": {
        category: "Frontend",
        title: "Rangemate",
        tagline: "A task manager that connect the team",
        description: "Frontend build of Rangemate, translating the Figma design into a pixel-accurate, responsive web interface with smooth micro-interactions.",
        role: "Frontend Developer",
        tools: "HTML, CSS, JavaScript",
        year: "2025",
        bg: "linear-gradient(180deg, #ff5b00 0%, #311c10 100%)",
        images: ["assets/rangemate.png"],
    },
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

// ===== Project modal =====
const modal = document.getElementById("project-modal");
const modalImg = document.getElementById("modal-img");
const modalThumbs = document.getElementById("modal-thumbs");
const $ = (id) => document.getElementById(id);

function showImage(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    // restart fade animation
    modalImg.style.animation = "none";
    modalImg.offsetHeight;
    modalImg.style.animation = "";
    modalThumbs.querySelectorAll("button").forEach((b) => {
        b.setAttribute("aria-current", b.dataset.src === src);
    });
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

    modalThumbs.innerHTML = p.images.length > 1
        ? p.images.map((src, i) =>
            `<button type="button" data-src="${src}" aria-label="Image ${i + 1}"><img src="${src}" alt=""></button>`
        ).join("")
        : "";
    showImage(p.images[0], `${p.title} preview`);

    modal.showModal();
}

function closeModal() {
    if (!modal.open || modal.classList.contains("is-closing")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return modal.close();
    modal.classList.add("is-closing");
    modal.addEventListener("animationend", function done(e) {
        if (e.target !== modal || e.animationName !== "modal-out") return;
        modal.removeEventListener("animationend", done);
        modal.classList.remove("is-closing");
        modal.close();
    });
}

document.querySelectorAll(".card[data-project]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.project));
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(card.dataset.project);
        }
    });
});

modalThumbs.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) showImage(btn.dataset.src, modalImg.alt);
});

$("modal-close").addEventListener("click", closeModal);
// click on backdrop
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
// Esc: animate out instead of instant close
modal.addEventListener("cancel", (e) => { e.preventDefault(); closeModal(); });
