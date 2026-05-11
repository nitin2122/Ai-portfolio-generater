// AIPF Main Logic - Kinetic Noir 

// --- 1. Three.js 3D Background Setup ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
// Fog to match background
scene.fog = new THREE.FogExp2(0x121414, 0.05);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    // Spread particles across a wide area
    posArray[i] = (Math.random() - 0.5) * 40;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Neon Lime / Electric Indigo colored material
const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xCCFF00,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, material);
scene.add(particlesMesh);

// Add some floating geometric 'glass' shards
const shardGeo = new THREE.OctahedronGeometry(0.5, 0);
const shardMat = new THREE.MeshBasicMaterial({
    color: 0x6366F1,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

const shards = [];
for (let i = 0; i < 20; i++) {
    const shard = new THREE.Mesh(shardGeo, shardMat);
    shard.position.x = (Math.random() - 0.5) * 20;
    shard.position.y = (Math.random() - 0.5) * 20;
    shard.position.z = (Math.random() - 0.5) * 10 - 5;

    shard.rotation.x = Math.random() * Math.PI;
    shard.rotation.y = Math.random() * Math.PI;

    scene.add(shard);
    shards.push(shard);
}

camera.position.z = 5;

// Mouse tracking for slight parallax
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particlesMesh.rotation.y = -0.05 * elapsedTime;
    particlesMesh.rotation.x = 0.02 * elapsedTime;

    // Slow shard rotation
    shards.forEach((shard, index) => {
        shard.rotation.x += 0.002 * (index % 2 === 0 ? 1 : -1);
        shard.rotation.y += 0.003;
    });

    // Mouse parallax
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// --- 2. GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        gsap.to(window, { duration: 1, scrollTo: target, ease: 'power3.inOut' });
    });
});

// Hero Sequence
const tlHero = gsap.timeline();
tlHero.from('.badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 })
    .from('.hero-title', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero-actions button', { y: 20, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.6');

// Scroll triggered 3D Camera zoom
ScrollTrigger.create({
    trigger: '.workspace-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
        // Move camera forward into the particles on scroll
        gsap.to(camera.position, {
            z: 5 - (self.progress * 4),
            duration: 0.5,
            overwrite: 'auto'
        });
        // Change particle color slightly based on scroll
        if (self.progress > 0.5) {
            material.color.setHex(0x6366F1); // Switch to Indigo
        } else {
            material.color.setHex(0xCCFF00); // Back to Lime
        }
    }
});

// Workspace Panels Reveal
gsap.from('.ai-panel', {
    scrollTrigger: {
        trigger: '.workspace-grid',
        start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.preview-panel', {
    scrollTrigger: {
        trigger: '.workspace-grid',
        start: 'top 70%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out'
});

// Gallery Reveal
gsap.from('.gallery-header', {
    scrollTrigger: {
        trigger: '.gallery-section',
        start: 'top 80%',
    },
    y: 30, opacity: 0, duration: 0.8, ease: 'power3.out'
});


// --- 3. Mock AI Generation Logic ---
const generateBtn = document.getElementById('generate-btn');
const promptInput = document.getElementById('ai-prompt');

const progressContainer = document.querySelector('.generation-progress');
const progressFill = document.querySelector('.progress-fill');
const previewContainer = document.getElementById('preview-container');
const aiStatus = document.querySelector('.ai-status');

// Template Gallery Data
const galleryData = [
    {
        title: 'Minimalist Mono',
        desc: 'Clean, typography-driven layout with stark contrasts.',
        tags: ['Monochrome', 'Brutalist', 'Typography'],
        image: 'https://image.pollinations.ai/prompt/minimalist%20typography%20web%20design%20black%20and%20white?width=400&height=300&nologo=true',
        prompt: 'A highly minimalist, black and white portfolio. Use a brutalist sans-serif font like Space Grotesk. The background should be pure white (#FFFFFF) with pure black text (#000000) and an accent of silver (#DDDDDD). Focus on stark contrasts and clean typography.',
        themeData: {
            bg: '#ffffff',
            text: '#000000',
            accent: '#dddddd',
            fontDisplay: "'Space Grotesk', sans-serif",
            fontBody: "'Inter', sans-serif",
            bio: "I design clean, minimalist digital experiences focusing on stark contrasts and brutalist typography.",
            aboutText: "Driven by the belief that less is more, I specialize in creating functional, typography-first interfaces. My approach strips away the unnecessary, leaving only what truly matters to the user experience.",
            skills: ["Minimalism", "Typography", "Brutalist UX", "Grid Systems", "Wireframing"],
            experience: [
                { role: "Senior Designer", company: "Studio Blank", duration: "2021 - Present", description: "Lead the design of ultra-minimalist web platforms." },
                { role: "UI Designer", company: "Less is More", duration: "2018 - 2021", description: "Created high-contrast interfaces for fashion brands." }
            ],
            imagePrompts: ["minimalist modern architecture black and white", "brutalist concrete building", "clean typography poster design monochrome"]
        }
    },
    {
        title: 'Neon Cyber',
        desc: 'Dark mode with vibrant neon accents and futuristic fonts.',
        tags: ['Dark Mode', 'Cyberpunk', 'Neon'],
        image: 'https://image.pollinations.ai/prompt/cyberpunk%20neon%20web%20design%20dark%20mode?width=400&height=300&nologo=true',
        prompt: 'A futuristic, cyberpunk-inspired portfolio. Dark background (#0A0A0A) with vibrant neon green (#39FF14) and purple (#9D00FF) accents. Use a geometric sans-serif font for headers. High-tech, glowing aesthetic.',
        themeData: {
            bg: '#0a0a0a',
            text: '#e0e0e0',
            accent: '#39ff14',
            fontDisplay: "'Space Grotesk', sans-serif",
            fontBody: "'Inter', sans-serif",
            bio: "Building the future of digital interfaces with cyberpunk aesthetics and high-tech glow.",
            aboutText: "I thrive in the intersection of cyberpunk culture and cutting-edge web technology. My designs feature dark modes, neon highlights, and futuristic layouts that transport users to the year 2077.",
            skills: ["Cyberpunk UI", "Neon Design", "Dark Mode", "WebGL", "Interactive 3D"],
            experience: [
                { role: "Lead UI Engineer", company: "Neon Dynamics", duration: "2022 - Present", description: "Developed next-gen futuristic dashboards." },
                { role: "Frontend Dev", company: "Synthwave Digital", duration: "2019 - 2022", description: "Built glowing, high-contrast promotional sites." }
            ],
            imagePrompts: ["cyberpunk city neon lights dark", "futuristic technology interface glowing", "synthwave retrowave grid purple green"]
        }
    },
    {
        title: 'Ethereal Glass',
        desc: 'Soft gradients, glassmorphism UI, and elegant serifs.',
        tags: ['Glassmorphism', 'Elegant', 'Gradients'],
        image: 'https://image.pollinations.ai/prompt/glassmorphism%20elegant%20web%20design%20light%20lavender?width=400&height=300&nologo=true',
        prompt: 'An elegant, premium portfolio. Soft, ethereal gradient backgrounds using light lavender (#E6E6FA) and pale blue (#ADD8E6). Use a classic serif font like Noto Serif for headers and a clean sans-serif like Inter for body text. Aesthetic should feel airy and professional.',
        themeData: {
            bg: '#f8f9fc',
            text: '#2d3748',
            accent: '#8b5cf6',
            fontDisplay: "'Noto Serif', serif",
            fontBody: "'Inter', sans-serif",
            bio: "Crafting elegant, premium digital experiences through glassmorphism and soft typography.",
            aboutText: "My work revolves around creating airy, breathable spaces in digital design. By combining soft gradients, classic serif typography, and glass-like interfaces, I build products that feel sophisticated and approachable.",
            skills: ["Glassmorphism", "Elegant UI", "Typography", "Premium Branding", "Prototyping"],
            experience: [
                { role: "Art Director", company: "Lumina Agency", duration: "2020 - Present", description: "Directed high-end digital branding campaigns." },
                { role: "UI/UX Designer", company: "Aura Creative", duration: "2017 - 2020", description: "Designed soft, ethereal interfaces for wellness apps." }
            ],
            imagePrompts: ["soft ethereal gradient glassmorphism abstract", "elegant premium lifestyle product shot", "minimalist luxury interior design light"]
        }
    },
    {
        title: 'Vibrant Pop',
        desc: 'Playful retro-pop aesthetic with bold, high-contrast colors.',
        tags: ['Retro', 'Pop Art', 'Colorful'],
        image: 'https://image.pollinations.ai/prompt/pop%20art%20web%20design%20vibrant%20colorful%20playful?width=400&height=300&nologo=true',
        prompt: 'A vibrant, retro-pop portfolio. Use a bright yellow background (#FFD700) with stark black text (#000000) and hot pink accents (#FF1493). Use a bold, playful display font like "Righteous" or "Outfit".',
        themeData: {
            bg: '#FFD700',
            text: '#000000',
            accent: '#FF1493',
            fontDisplay: "'Righteous', cursive",
            fontBody: "'Outfit', sans-serif",
            bio: "I design playful, high-energy digital experiences that pop.",
            aboutText: "My design philosophy is rooted in the idea that software should be fun. I combine retro-pop aesthetics with modern UX principles to create vibrant, memorable interfaces that leave a lasting impression.",
            skills: ["Creative Direction", "Illustration", "UI/UX", "Animation", "Branding"],
            experience: [
                { role: "Art Director", company: "Pop Studio", duration: "2021 - Present", description: "Lead the design of highly interactive, colorful web experiences." },
                { role: "Visual Designer", company: "Retro Digital", duration: "2018 - 2021", description: "Created vibrant marketing campaigns and visual assets." }
            ],
            imagePrompts: ["pop art illustration vibrant colors", "retro 80s synthwave graphic design", "colorful playful abstract shapes"]
        }
    },
    {
        title: 'Industrial Grit',
        desc: 'Raw, textured, urban aesthetic with brutalist elements.',
        tags: ['Industrial', 'Grit', 'Urban'],
        image: 'https://image.pollinations.ai/prompt/industrial%20brutalist%20web%20design%20textured%20dark?width=400&height=300&nologo=true',
        prompt: 'An industrial, raw portfolio. Dark textured background (#1A1A1A) with off-white text (#F0F0F0) and safety orange accents (#FF4500). Use an industrial display font like "Oswald" or "Teko".',
        themeData: {
            bg: '#1A1A1A',
            text: '#F0F0F0',
            accent: '#FF4500',
            fontDisplay: "'Oswald', sans-serif",
            fontBody: "'Inter', sans-serif",
            bio: "Building robust, raw, and impactful digital infrastructure.",
            aboutText: "I draw inspiration from urban environments and industrial design, creating digital products that feel solid, raw, and authentic. My work embraces brutalism and utilitarian aesthetics.",
            skills: ["Brutalist Design", "System Architecture", "WebGL", "UX Engineering", "Rapid Prototyping"],
            experience: [
                { role: "Lead Engineer", company: "Heavy Industries", duration: "2022 - Present", description: "Architected robust, high-performance web applications." },
                { role: "Frontend Dev", company: "Urban Code", duration: "2019 - 2022", description: "Built raw, impactful e-commerce experiences." }
            ],
            imagePrompts: ["industrial concrete texture raw", "brutalist architecture dark moody", "safety orange urban abstract"]
        }
    },
    {
        title: 'Corporate Sleek',
        desc: 'Professional, trustworthy, high-end enterprise aesthetic.',
        tags: ['Corporate', 'Enterprise', 'Clean'],
        image: 'https://image.pollinations.ai/prompt/corporate%20sleek%20web%20design%20professional%20blue%20white?width=400&height=300&nologo=true',
        prompt: 'A sleek, corporate portfolio. Clean white background (#FFFFFF) with dark slate text (#1E293B) and trustworthy blue accents (#2563EB). Use a clean, modern sans-serif like "Roboto" or "Helvetica".',
        themeData: {
            bg: '#FFFFFF',
            text: '#1E293B',
            accent: '#2563EB',
            fontDisplay: "'Roboto', sans-serif",
            fontBody: "'Roboto', sans-serif",
            bio: "Delivering scalable, high-end enterprise solutions and digital products.",
            aboutText: "I specialize in creating professional, trustworthy digital products for enterprise clients. My focus is on clarity, accessibility, and scalable design systems that drive business results.",
            skills: ["Enterprise UI", "Design Systems", "Accessibility", "Product Strategy", "Data Visualization"],
            experience: [
                { role: "Product Designer", company: "Enterprise Solutions Inc.", duration: "2020 - Present", description: "Designed scalable, accessible enterprise software used by Fortune 500 companies." },
                { role: "UX Designer", company: "FinTech Global", duration: "2017 - 2020", description: "Streamlined complex financial workflows into intuitive interfaces." }
            ],
            imagePrompts: ["modern glass office building sleek", "data visualization abstract professional", "clean minimal workspace corporate"]
        }
    }
];

// Populate Gallery
const galleryGrid = document.querySelector('.gallery-grid');
if (galleryGrid) {
    galleryData.forEach((item, i) => {
        const delay = i * 0.1;
        const el = document.createElement('div');
        el.className = 'gallery-item';

        el.innerHTML = `
            <div class="gallery-item-preview" style="background: ${item.themeData.bg}; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px;">
                <div style="font-family: ${item.themeData.fontDisplay}; color: ${item.themeData.text}; font-size: 36px; font-weight: bold; line-height: 1; margin-bottom: 12px; text-align: center;">${item.title.split(' ')[0]}</div>
                <div style="font-family: ${item.themeData.fontBody}; color: ${item.themeData.accent}; border: 1px solid ${item.themeData.accent}; padding: 4px 12px; font-size: 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 2px;">Preview</div>
            </div>
            <div class="gallery-item-content">
                <h4 class="gallery-item-title">${item.title}</h4>
                <p class="gallery-item-desc">${item.desc}</p>
                <div class="gallery-item-tags">
                    ${item.tags.map(tag => `<span class="gallery-item-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        el.addEventListener('click', () => {
            // Populate workspace
            document.getElementById('ai-prompt').value = item.prompt;

            // Apply theme instantly
            window.currentAITheme = item.themeData;
            const userName = document.getElementById('user-name').value || 'Kinetic Studios';
            const userDetails = document.getElementById('user-details').value || 'Creative Professional';

            // Show preview components
            document.getElementById('preview-actions').style.display = 'flex';
            document.getElementById('variant-selector').style.display = 'flex';
            document.getElementById('window-controls').style.display = 'flex';
            document.querySelector('.empty-state').style.display = 'none';

            showGeneratedPreview(userName, userDetails, currentVariant, item.themeData);

            // Scroll to workspace
            gsap.to(window, { duration: 1, scrollTo: '#workspace', ease: 'power3.inOut' });
        });

        galleryGrid.appendChild(el);

        // Animate in
        gsap.from(el, {
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: 'top 80%'
            },
            y: 40, opacity: 0, duration: 0.8, delay: delay, ease: 'power3.out'
        });
    });
}

generateBtn.addEventListener('click', async () => {
    if (!promptInput.value.trim()) {
        alert("Please describe your portfolio first.");
        return;
    }

    // Start Generation Flow
    generateBtn.style.display = 'none';
    progressContainer.style.display = 'block';
    aiStatus.textContent = 'Generating...';
    aiStatus.style.color = 'var(--accent-lime)';

    // Reset Progress and Logs
    gsap.set(progressFill, { width: '0%' });
    const agentLogs = document.querySelector('.agent-logs');
    agentLogs.innerHTML = '';

    const logs = [
        "Connecting to Gemini AI Engine...",
        "Analyzing prompt and artistic direction...",
        "Selecting Kinetic Noir design system tokens...",
        "Generating professional copy...",
        "Synthesizing layout structure...",
        "Prompting AI image models...",
        "Finalizing cinematic rendering..."
    ];

    let logIndex = 0;
    const logInterval = setInterval(() => {
        if (logIndex < logs.length) {
            const span = document.createElement('span');
            span.textContent = `> ${logs[logIndex]}`;
            agentLogs.appendChild(span);
            // keep scrolled to bottom
            agentLogs.scrollTop = agentLogs.scrollHeight;
            logIndex++;
        }
    }, 800);

    // Simulate API delay with progress bar, but actually wait for the fetch
    gsap.to(progressFill, { width: '80%', duration: 4, ease: 'power1.out' });

    try {
        const userName = document.getElementById('user-name').value || 'Kinetic Studios';
        const userDetails = document.getElementById('user-details').value || 'Creative Professional';

        const aiTheme = await fetchGeminiGeneration(promptInput.value, userName, userDetails);

        // Cache the theme for live preview updates
        window.currentAITheme = aiTheme;

        gsap.to(progressFill, {
            width: '100%',
            duration: 0.5,
            onComplete: () => {
                clearInterval(logInterval);
                // Show result
                progressContainer.style.display = 'none';
                generateBtn.style.display = 'block';
                generateBtn.textContent = 'REGENERATE';
                aiStatus.textContent = 'Completed';
                aiStatus.style.color = 'var(--secondary)';

                // Show Download button
                document.getElementById('preview-actions').style.display = 'flex';
                // Show Variant Selector
                document.getElementById('variant-selector').style.display = 'flex';
                document.getElementById('window-controls').style.display = 'flex';

                showGeneratedPreview(userName, userDetails, currentVariant, aiTheme);
            }
        });
    } catch (error) {
        clearInterval(logInterval);
        alert("Generation failed: " + error.message);
        progressContainer.style.display = 'none';
        generateBtn.style.display = 'block';
        generateBtn.textContent = 'RETRY GENERATION';
        aiStatus.textContent = 'Failed';
        aiStatus.style.color = 'red';
    }
});

// Live Preview Update Logic
function updateLivePreview() {
    // Only update if it has already been generated once
    if (document.getElementById('preview-actions').style.display === 'flex' && window.currentAITheme) {
        const userName = document.getElementById('user-name').value || 'Kinetic Studios';
        const userDetails = document.getElementById('user-details').value || 'Creative Professional';
        showGeneratedPreview(userName, userDetails, currentVariant, window.currentAITheme);
    }
}

document.getElementById('user-name').addEventListener('input', updateLivePreview);
document.getElementById('user-details').addEventListener('input', updateLivePreview);
document.getElementById('ai-prompt').addEventListener('input', updateLivePreview);

// Image Upload Logic
let uploadedImages = [];
// Variant Selector Logic
let currentVariant = 1;
const variantBtns = document.querySelectorAll('.variant-btn');
variantBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        variantBtns.forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = 'rgba(255,255,255,0.2)';
            b.style.color = 'white';
        });
        e.target.classList.add('active');
        e.target.style.borderColor = 'var(--accent-lime)';
        e.target.style.color = 'var(--accent-lime)';

        currentVariant = parseInt(e.target.getAttribute('data-variant'));
        if (window.currentAITheme) {
            const userName = document.getElementById('user-name').value || 'Kinetic Studios';
            const userDetails = document.getElementById('user-details').value || 'Creative Professional';
            showGeneratedPreview(userName, userDetails, currentVariant, window.currentAITheme);
        }
    });
});

function handleDownload(format) {
    const element = document.getElementById('preview-container');
    const btnId = `download-${format}-btn`;
    const btn = document.getElementById(btnId);
    const oldText = btn.textContent;

    btn.textContent = 'GENERATING...';
    btn.disabled = true;

    const opt = {
        margin: 0.5,
        filename: `my-ai-portfolio.${format}`,
        image: { type: 'jpeg', quality: 0.98 },
        // IMPORTANT: useCORS is strictly required to capture cross-origin images like unsplash/picsum
        html2canvas: { scale: 2, backgroundColor: '#121414', useCORS: true, allowTaint: false },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    if (format === 'pdf') {
        html2pdf().set(opt).from(element).save().then(() => {
            btn.textContent = oldText;
            btn.disabled = false;
        });
    } else {
        html2canvas(element, opt.html2canvas).then(canvas => {
            const dataUrl = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.98);
            const link = document.createElement('a');
            link.download = opt.filename;
            link.href = dataUrl;
            link.click();
            btn.textContent = oldText;
            btn.disabled = false;
        });
    }
}

document.getElementById('download-pdf-btn').addEventListener('click', () => handleDownload('pdf'));
document.getElementById('download-png-btn').addEventListener('click', () => handleDownload('png'));
document.getElementById('download-jpg-btn').addEventListener('click', () => handleDownload('jpg'));


// Gemini API Integration
async function fetchGeminiGeneration(prompt, name, details, apiKey = "") {
    const systemPrompt = `You are an expert web designer and copywriter. I need a JSON payload to theme a portfolio.
User Name: ${name}
Role: ${details}
Prompt: ${prompt}

Return ONLY a valid JSON object with this exact schema. Do not include markdown code blocks.
{
  "bg": "MUST BE a valid HEX code (e.g. #121414). CRITICAL: If the user asks for a specific color, use that exact color's HEX code.",
  "text": "MUST BE a valid HEX code (e.g. #ffffff). Ensure high contrast with bg.",
  "accent": "MUST BE a valid HEX code for accents. CRITICAL: Follow the user's requested colors.",
  "fontDisplay": "CSS font-family string (e.g. 'Noto Serif', serif)",
  "fontBody": "CSS font-family string (e.g. 'Inter', sans-serif)",
  "bio": "a 2 sentence professional bio tailored to the user's role and prompt",
  "aboutText": "a detailed 3-4 sentence paragraph describing the user's background, passion, and unique value proposition",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6"],
  "experience": [
    { "role": "Job Title", "company": "Company Name", "duration": "2020 - Present", "description": "1-2 sentences about what they achieved." },
    { "role": "Previous Title", "company": "Old Company", "duration": "2018 - 2020", "description": "1-2 sentences about achievements." }
  ],
  "imagePrompts": ["detailed visual description for hero image", "description for project 1", "description for project 2"]
}`;

    if (!apiKey) {
        console.log("No API key provided, returning a beautiful fallback theme generated from prompt.");
        return {
            bg: "#0a0a0a",
            text: "#f5f5f5",
            accent: "#6366f1",
            fontDisplay: "'Plus Jakarta Sans', sans-serif",
            fontBody: "'Inter', sans-serif",
            bio: `${name} is an innovative ${details} dedicated to pushing the boundaries of digital design and development. Every pixel is crafted with intent.`,
            aboutText: `I am ${name}, a passionate ${details} dedicated to bridging the gap between aesthetics and functionality. Over the years, I have honed my craft by collaborating with global brands and building scalable, beautiful systems. My approach merges analytical thinking with bold creative direction.`,
            skills: ["Strategic Planning", "User Experience", "Visual Design", "Agile Development", "System Architecture", "Leadership"],
            experience: [
                { role: "Lead " + details, company: "Nexus Digital", duration: "2020 - Present", description: "Spearheaded the redesign of flagship products, increasing user engagement by 40%." },
                { role: details, company: "Quantum Studios", duration: "2016 - 2020", description: "Worked alongside cross-functional teams to deliver award-winning digital experiences." }
            ],
            imagePrompts: [
                `${prompt} abstract visualization 3d render premium`,
                `${details} professional application interface mockup clean`,
                `${prompt} conceptual digital art high resolution`
            ]
        };
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            }
        ],
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            console.warn(`API Request failed: ${response.status} ${response.statusText}. Using fallback theme.`);
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        let textResult = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] ? data.candidates[0].content.parts[0].text : "";

        console.log("Raw Gemini Content:", textResult);

        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            textResult = jsonMatch[0];
        } else {
            textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const themeData = JSON.parse(textResult);

        // Ensure required fields exist, if not, provide fallbacks
        themeData.bg = themeData.bg || "#121414";
        themeData.text = themeData.text || "#ffffff";
        themeData.accent = themeData.accent || "#00ffcc";
        themeData.fontDisplay = themeData.fontDisplay || "'Space Grotesk', sans-serif";
        themeData.fontBody = themeData.fontBody || "'Inter', sans-serif";
        themeData.bio = themeData.bio || `${name} is an experienced ${details} with a focus on creating exceptional digital experiences.`;
        themeData.aboutText = themeData.aboutText || `With years of experience in the industry, ${name} has developed a keen eye for detail and a passion for pushing creative boundaries. Always looking for the next challenge, they strive to deliver top-tier results in every project they undertake.`;
        themeData.skills = themeData.skills && themeData.skills.length > 0 ? themeData.skills : ["Creative Direction", "UI/UX Design", "Frontend Development", "Brand Strategy", "Prototyping", "Digital Marketing"];
        themeData.experience = themeData.experience && themeData.experience.length > 0 ? themeData.experience : [
            { role: "Senior " + details, company: "TechNova Solutions", duration: "2021 - Present", description: "Led core initiatives and delivered high-impact digital products used by millions." },
            { role: details, company: "Creative Forge", duration: "2018 - 2021", description: "Developed dynamic solutions and established key design systems for enterprise clients." }
        ];
        themeData.imagePrompts = themeData.imagePrompts && themeData.imagePrompts.length >= 3 ? themeData.imagePrompts : ["abstract modern tech", "UI UX app design", "web development abstract"];

        return themeData;
    } catch (e) {
        console.warn("Gemini API failed or returned invalid JSON. Using a beautiful fallback theme instead to prevent breaking the UI.", e);

        // Fallback Theme to ensure the app continues working flawlessly
        return {
            bg: "#0a0a0a",
            text: "#f5f5f5",
            accent: "#6366f1",
            fontDisplay: "'Plus Jakarta Sans', sans-serif",
            fontBody: "'Inter', sans-serif",
            bio: `${name} is an innovative ${details} dedicated to pushing the boundaries of digital design and development. Every pixel is crafted with intent.`,
            aboutText: `I am ${name}, a passionate ${details} dedicated to bridging the gap between aesthetics and functionality. Over the years, I have honed my craft by collaborating with global brands and building scalable, beautiful systems. My approach merges analytical thinking with bold creative direction.`,
            skills: ["Strategic Planning", "User Experience", "Visual Design", "Agile Development", "System Architecture", "Leadership"],
            experience: [
                { role: "Lead " + details, company: "Nexus Digital", duration: "2020 - Present", description: "Spearheaded the redesign of flagship products, increasing user engagement by 40%." },
                { role: details, company: "Quantum Studios", duration: "2016 - 2020", description: "Worked alongside cross-functional teams to deliver award-winning digital experiences." }
            ],
            imagePrompts: [
                `${prompt} abstract visualization 3d render premium`,
                `${details} professional application interface mockup clean`,
                `${prompt} conceptual digital art high resolution`
            ]
        };
    }
}

function showGeneratedPreview(name, details, variant = 1, aiTheme) {
    // Determine Background Images (Using Picsum for fast, reliable, CORS-friendly generation)
    const imgPrompt1 = aiTheme.imagePrompts && aiTheme.imagePrompts[0] ? aiTheme.imagePrompts[0] : "design";
    const imgPrompt2 = aiTheme.imagePrompts && aiTheme.imagePrompts[1] ? aiTheme.imagePrompts[1] : "tech";
    const imgPrompt3 = aiTheme.imagePrompts && aiTheme.imagePrompts[2] ? aiTheme.imagePrompts[2] : "web";

    // Extract first keyword to generate stable seeds for the images
    const seed1 = encodeURIComponent(imgPrompt1.split(' ')[0] || 'design');
    const seed2 = encodeURIComponent(imgPrompt2.split(' ')[0] || 'tech');
    const seed3 = encodeURIComponent(imgPrompt3.split(' ')[0] || 'web');

    const aiImg1 = `url('https://picsum.photos/seed/${seed1}1/1200/800')`;
    const aiImg2 = `url('https://picsum.photos/seed/${seed2}2/800/500')`;
    const aiImg3 = `url('https://picsum.photos/seed/${seed3}3/800/500')`;

    const bg1 = aiImg1;
    const bg2 = aiImg2;
    const bg3 = aiImg3;

    // Style string to inject dynamic CSS variables to the container
    const dynamicStyles = `
        background-color: ${aiTheme.bg}; 
        color: ${aiTheme.text}; 
        --gen-accent: ${aiTheme.accent};
        --gen-font-display: ${aiTheme.fontDisplay};
        --gen-font-body: ${aiTheme.fontBody};
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scroll-behavior: smooth;
    `;

    // Map Experience array to HTML
    const experienceHtml = aiTheme.experience.map(exp => `
        <div style="border-left: 2px solid var(--gen-accent); padding-left: 24px; margin-bottom: 32px; position: relative;">
            <div style="position: absolute; left: -6px; top: 0; width: 10px; height: 10px; border-radius: 50%; background: var(--gen-accent);"></div>
            <div style="font-family: var(--gen-font-display); font-size: 20px; margin-bottom: 4px;">${exp.role}</div>
            <div style="font-family: var(--gen-font-body); font-size: 14px; opacity: 0.7; margin-bottom: 12px; display: flex; justify-content: space-between;">
                <span>${exp.company}</span>
                <span>${exp.duration}</span>
            </div>
            <div style="font-family: var(--gen-font-body); line-height: 1.6; opacity: 0.9;">${exp.description}</div>
        </div>
    `).join('');

    // Map Skills array to HTML
    const skillsHtml = aiTheme.skills.map(skill => `
        <div style="padding: 12px 24px; border: 1px solid rgba(128,128,128,0.2); border-radius: 4px; font-family: var(--gen-font-body); font-size: 14px; display: inline-block;">
            ${skill}
        </div>
    `).join('');

    let contentHtml = '';

    if (variant === 1) {
        // Variant 1: Centered, spacious, elegant
        contentHtml = `
            <div class="gen-preview-container" style="${dynamicStyles}">
                <!-- Navbar -->
                <div class="gen-nav" style="display:flex; justify-content:space-between; align-items: center; padding: 32px 40px; font-family:var(--gen-font-body); font-size:12px; position: sticky; top: 0; background: ${aiTheme.bg}; z-index: 10; border-bottom: 1px solid rgba(128,128,128,0.1);">
                    <div style="font-weight:bold; text-transform: uppercase; font-size: 16px; letter-spacing: 1px;">${name}</div>
                    <div style="display:flex; gap:32px; font-weight: 500;">
                        <span style="cursor:pointer; transition:color 0.3s;" onmouseover="this.style.color='var(--gen-accent)'" onmouseout="this.style.color='inherit'">ABOUT</span>
                        <span style="cursor:pointer; transition:color 0.3s;" onmouseover="this.style.color='var(--gen-accent)'" onmouseout="this.style.color='inherit'">EXPERIENCE</span>
                        <span style="cursor:pointer; transition:color 0.3s;" onmouseover="this.style.color='var(--gen-accent)'" onmouseout="this.style.color='inherit'">WORK</span>
                    </div>
                </div>

                <!-- Hero Section -->
                <div style="padding: 100px 40px 60px 40px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <div style="font-family:var(--gen-font-body); font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: var(--gen-accent); margin-bottom: 24px;">Portfolio of ${name}</div>
                    <div class="gen-title" style="font-family:var(--gen-font-display); font-size: clamp(48px, 6vw, 80px); line-height:1.1; margin-bottom:24px; max-width: 900px;">${details.toUpperCase()}</div>
                    <div class="gen-desc" style="font-family:var(--gen-font-body); font-size: 18px; opacity:0.8; max-width:600px; line-height:1.6; margin-bottom: 48px;">${aiTheme.bio}</div>
                    <div class="gen-hero-img" style="width: 100%; max-width: 1000px; height: 500px; background:${bg1}; background-size:cover; background-position:center; border-radius:12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);"></div>
                </div>

                <!-- About Section -->
                <div style="padding: 80px 40px; background: rgba(128,128,128,0.03);">
                    <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start;">
                        <div>
                            <h2 style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 24px;">About Me</h2>
                            <p style="font-family: var(--gen-font-body); font-size: 16px; line-height: 1.8; opacity: 0.8;">${aiTheme.aboutText}</p>
                        </div>
                        <div>
                            <h2 style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 24px;">Core Capabilities</h2>
                            <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                                ${skillsHtml}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Experience Section -->
                <div style="padding: 80px 40px;">
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 48px; text-align: center;">Professional Experience</h2>
                        <div style="margin-left: 20px;">
                            ${experienceHtml}
                        </div>
                    </div>
                </div>

                <!-- Selected Work Section -->
                <div style="padding: 80px 40px; background: rgba(128,128,128,0.03);">
                    <div style="max-width: 1000px; margin: 0 auto;">
                        <h2 style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 48px; text-align: center;">Selected Work</h2>
                        <div class="gen-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:40px;">
                            <div>
                                <div class="gen-box" style="height:350px; background:${bg2}; background-size:cover; background-position:center; border-radius:8px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 20px;"></div>
                                <h3 style="font-family: var(--gen-font-display); font-size: 24px; margin-bottom: 8px;">Project Alpha</h3>
                                <p style="font-family: var(--gen-font-body); font-size: 14px; opacity: 0.7;">${imgPrompt2}</p>
                            </div>
                            <div>
                                <div class="gen-box" style="height:350px; background:${bg3}; background-size:cover; background-position:center; border-radius:8px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); margin-bottom: 20px;"></div>
                                <h3 style="font-family: var(--gen-font-display); font-size: 24px; margin-bottom: 8px;">Project Beta</h3>
                                <p style="font-family: var(--gen-font-body); font-size: 14px; opacity: 0.7;">${imgPrompt3}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div style="padding: 60px 40px; text-align: center; border-top: 1px solid rgba(128,128,128,0.1);">
                    <div style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 24px;">Let's work together.</div>
                    <div style="display: inline-block; padding: 16px 32px; background: var(--gen-accent); color: ${aiTheme.bg}; font-family: var(--gen-font-body); font-weight: bold; cursor: pointer; border-radius: 4px;">GET IN TOUCH</div>
                </div>
            </div>
        `;
    } else if (variant === 2) {
        // Variant 2: Left-aligned, brutalist/hero focus
        contentHtml = `
            <div class="gen-preview-container" style="${dynamicStyles}">
                <!-- Hero Section with Full Bleed Background -->
                <div style="height: 500px; background:${bg1}; background-size:cover; background-position:center; position:relative; padding: 40px; display:flex; flex-direction:column; justify-content:space-between;">
                    <div style="position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.2), ${aiTheme.bg}); z-index:0;"></div>
                    
                    <div class="gen-nav" style="display:flex; justify-content:space-between; font-family:var(--gen-font-body); font-size:12px; position:relative; z-index:1; text-transform: uppercase;">
                        <div style="font-weight:bold; font-size: 18px;">${name}</div>
                        <div style="display:flex; gap:32px; font-weight: bold;">
                            <span>WORK</span><span>ABOUT</span><span>CONTACT</span>
                        </div>
                    </div>
                    
                    <div style="position:relative; z-index:1; padding-bottom: 40px;">
                        <div style="font-family:var(--gen-font-body); font-size: 16px; color: var(--gen-accent); margin-bottom: 16px; font-weight: bold;">[ PORTFOLIO ]</div>
                        <div class="gen-title" style="font-family:var(--gen-font-display); font-size: clamp(50px, 8vw, 100px); line-height:1; margin-bottom:24px; text-transform: uppercase;">${details}</div>
                        <div class="gen-desc" style="font-family:var(--gen-font-body); font-size: 20px; max-width:600px; line-height:1.6; font-weight: 500;">${aiTheme.bio}</div>
                    </div>
                </div>

                <div style="padding: 100px 40px;">
                    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px;">
                        <!-- Left Column: About & Skills -->
                        <div>
                            <h2 style="font-family: var(--gen-font-display); font-size: 40px; margin-bottom: 32px; border-bottom: 4px solid var(--gen-accent); padding-bottom: 16px; display: inline-block;">THE PERSON</h2>
                            <p style="font-family: var(--gen-font-body); font-size: 16px; line-height: 1.8; margin-bottom: 48px;">${aiTheme.aboutText}</p>
                            
                            <h3 style="font-family: var(--gen-font-display); font-size: 24px; margin-bottom: 24px; text-transform: uppercase;">Skills Matrix</h3>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                ${skillsHtml}
                            </div>
                        </div>

                        <!-- Right Column: Experience -->
                        <div>
                            <h2 style="font-family: var(--gen-font-display); font-size: 40px; margin-bottom: 48px; border-bottom: 4px solid var(--gen-accent); padding-bottom: 16px; display: inline-block;">EXPERIENCE</h2>
                            ${experienceHtml}
                        </div>
                    </div>
                </div>

                <!-- Gallery -->
                <div style="padding: 0 40px 100px 40px;">
                    <div style="max-width: 1200px; margin: 0 auto;">
                        <div class="gen-grid" style="display:flex; gap:20px;">
                            <div style="flex:1;">
                                <div class="gen-box" style="height:400px; background:${bg2}; background-size:cover; background-position:center; filter: grayscale(50%); transition: all 0.4s;" onmouseover="this.style.filter='grayscale(0%)'" onmouseout="this.style.filter='grayscale(50%)'"></div>
                            </div>
                            <div style="flex:1;">
                                <div class="gen-box" style="height:400px; background:${bg3}; background-size:cover; background-position:center; filter: grayscale(50%); transition: all 0.4s;" onmouseover="this.style.filter='grayscale(0%)'" onmouseout="this.style.filter='grayscale(50%)'"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (variant === 3) {
        // Variant 3: Split layout
        contentHtml = `
            <div class="gen-preview-container" style="${dynamicStyles}; display: flex; align-items: flex-start;">
                <!-- Left Fixed Panel -->
                <div style="width: 40%; height: 600px; position: sticky; top: 0; padding: 60px; display:flex; flex-direction:column; justify-content:space-between; border-right: 1px solid rgba(128,128,128,0.2);">
                    <div>
                        <div style="font-weight:bold; text-transform: uppercase; font-size: 14px; letter-spacing: 2px; color: var(--gen-accent); margin-bottom: 40px;">${name}</div>
                        <div class="gen-title" style="font-family:var(--gen-font-display); font-size: clamp(32px, 4vw, 56px); line-height:1.1; margin-bottom:24px;">${details.toUpperCase()}</div>
                        <div class="gen-desc" style="font-family:var(--gen-font-body); font-size:16px; opacity: 0.8; line-height:1.6;">${aiTheme.bio}</div>
                    </div>
                    
                    <div>
                        <h3 style="font-family: var(--gen-font-display); font-size: 20px; margin-bottom: 16px;">Expertise</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px;">
                            ${skillsHtml}
                        </div>
                        <div style="font-family: var(--gen-font-body); font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: flex; gap: 24px;">
                            <span style="cursor:pointer; border-bottom: 1px solid var(--gen-accent);">EMAIL</span>
                            <span style="cursor:pointer; border-bottom: 1px solid var(--gen-accent);">LINKEDIN</span>
                        </div>
                    </div>
                </div>

                <!-- Right Scrolling Panel -->
                <div style="width: 60%; padding: 60px;">
                    <div style="width: 100%; height: 60vh; background:${bg1}; background-size:cover; background-position:center; margin-bottom: 80px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);"></div>
                    
                    <div style="max-width: 600px; margin: 0 auto;">
                        <h2 style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 24px;">About</h2>
                        <p style="font-family: var(--gen-font-body); font-size: 16px; line-height: 1.8; opacity: 0.9; margin-bottom: 80px;">${aiTheme.aboutText}</p>
                        
                        <h2 style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 40px;">Career History</h2>
                        <div style="margin-bottom: 80px;">
                            ${experienceHtml}
                        </div>

                        <h2 style="font-family: var(--gen-font-display); font-size: 32px; margin-bottom: 40px;">Featured Works</h2>
                        <div class="gen-box" style="width: 100%; height: 400px; background:${bg2}; background-size:cover; background-position:center; margin-bottom: 40px;"></div>
                        <div class="gen-box" style="width: 100%; height: 400px; background:${bg3}; background-size:cover; background-position:center; margin-bottom: 40px;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    previewContainer.innerHTML = contentHtml;

    // Add Intersection Observer for scroll animations
    const innerScrollContainer = previewContainer.querySelector('.gen-preview-container');
    const observerOptions = {
        root: innerScrollContainer,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply initial styles and observe elements
    const animateElements = previewContainer.querySelectorAll('.gen-title, .gen-desc, .gen-hero-img, h2, p, .gen-box, .gen-grid > div');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
}

// Window Controls Logic
document.getElementById('close-preview-btn').addEventListener('click', () => {
    // Reset state
    window.currentAITheme = null;
    document.getElementById('preview-container').innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">✨</div>
            <h3 class="headline-sm">Awaiting Instructions</h3>
            <p class="body-text">Enter a prompt to generate your portfolio preview.</p>
        </div>
    `;
    document.getElementById('preview-actions').style.display = 'none';
    document.getElementById('variant-selector').style.display = 'none';
    document.getElementById('window-controls').style.display = 'none';

    // Un-expand if expanded
    const grid = document.querySelector('.workspace-grid');
    grid.style.gridTemplateColumns = '';
    document.querySelector('.ai-panel').style.display = 'flex';
    document.getElementById('toggle-expand-btn').style.transform = 'rotate(0deg)';
    window.isExpanded = false;
});

window.isExpanded = false;
document.getElementById('toggle-expand-btn').addEventListener('click', () => {
    const grid = document.querySelector('.workspace-grid');
    const aiPanel = document.querySelector('.ai-panel');
    const btn = document.getElementById('toggle-expand-btn');

    if (!window.isExpanded) {
        // Expand
        grid.style.gridTemplateColumns = '1fr';
        aiPanel.style.display = 'none';
        btn.style.transform = 'rotate(180deg)';
        window.isExpanded = true;
    } else {
        // Collapse
        grid.style.gridTemplateColumns = '';
        aiPanel.style.display = 'flex';
        btn.style.transform = 'rotate(0deg)';
        window.isExpanded = false;
    }
});

// --- Auth State Management ---
const authModal = document.getElementById('auth-modal');
const navSignInBtn = document.getElementById('nav-signin-btn');
const navSignOutBtn = document.getElementById('nav-signout-btn');
const userEmailDisplay = document.getElementById('user-email-display');

if (navSignInBtn) {
    navSignInBtn.addEventListener('click', () => {
        if (authModal) authModal.style.display = 'flex';
    });
}

if (navSignOutBtn) {
    navSignOutBtn.addEventListener('click', async () => {
        await supabase.auth.signOut();
    });
}

supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        if (navSignInBtn) navSignInBtn.style.display = 'none';
        if (navSignOutBtn) navSignOutBtn.style.display = 'flex';
        if (userEmailDisplay) userEmailDisplay.textContent = session.user.email;
        if (authModal) authModal.style.display = 'none';
    } else {
        if (navSignInBtn) navSignInBtn.style.display = 'flex';
        if (navSignOutBtn) navSignOutBtn.style.display = 'none';
        if (userEmailDisplay) userEmailDisplay.textContent = '';
    }
});

// Close auth modal logic (if applicable)
const closeAuthBtn = document.getElementById('close-auth-modal');
if (closeAuthBtn && authModal) {
    closeAuthBtn.addEventListener('click', () => authModal.style.display = 'none');
}

const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) alert("Sign up error: " + error.message);
        else alert("Sign up successful! Check your email or try downloading your portfolio now.");
    });
}

const signinForm = document.getElementById('signin-form');
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert("Sign in error: " + error.message);
    });
}
