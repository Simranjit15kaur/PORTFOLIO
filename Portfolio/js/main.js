// Global variables
let scene, camera, renderer, container, controls;

// Initialize Three.js scene for background
function initThreeJS() {
  container = document.getElementById("canvas-container");

  // Create scene
  scene = new THREE.Scene();

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Add controls for testing
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;

  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add floating geometry
  addFloatingGeometry();
  addMoreFloatingObjects();

  // Handle window resize
  window.addEventListener("resize", onWindowResize);

  // Start animation loop
  animate();
}

function addFloatingGeometry() {
  // Create a group to contain all floating elements
  const floatingGroup = new THREE.Group();
  scene.add(floatingGroup);

  // Add floating cubes
  for (let i = 0; i < 6; i++) {
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const material = new THREE.MeshPhongMaterial({
      color: i % 2 === 0 ? 0x00ffff : 0xff00ff,
      transparent: true,
      opacity: 0.8,
      emissive: i % 2 === 0 ? 0x00ffff : 0xff00ff,
      emissiveIntensity: 0.5,
      shininess: 100,
    });

    const cube = new THREE.Mesh(geometry, material);

    // Random position
    cube.position.x = (Math.random() - 0.5) * 10;
    cube.position.y = (Math.random() - 0.5) * 10;
    cube.position.z = (Math.random() - 0.5) * 10;

    // Random rotation
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;

    // Store original position for floating animation
    cube.userData = {
      originalX: cube.position.x,
      originalY: cube.position.y,
      originalZ: cube.position.z,
      speed: 0.2 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
    };

    floatingGroup.add(cube);
  }

  // Add floating torus knots
  const torusGeometry = new THREE.TorusKnotGeometry(0.4, 0.1, 100, 16);
  const torusMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.7,
    wireframe: true,
  });

  const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
  torusKnot.position.set(3, -2, -5);
  torusKnot.userData = {
    originalY: torusKnot.position.y,
    speed: 0.1,
    offset: Math.random() * Math.PI * 2,
  };
  floatingGroup.add(torusKnot);
}

function addMoreFloatingObjects() {
  // Add glowing orbs
  const orbColors = [0x00ffff, 0xff00ff, 0xffffff, 0x00ff99];
  for (let i = 0; i < 5; i++) {
    const geometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.4, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: orbColors[i % orbColors.length],
      transparent: true,
      opacity: 0.45,
      emissive: orbColors[i % orbColors.length],
      emissiveIntensity: 0.7,
      shininess: 100,
    });
    const orb = new THREE.Mesh(geometry, material);
    orb.position.x = (Math.random() - 0.5) * 12;
    orb.position.y = (Math.random() - 0.5) * 10;
    orb.position.z = (Math.random() - 0.5) * 10;
    orb.userData = {
      originalY: orb.position.y,
      speed: 0.08 + Math.random() * 0.15,
      offset: Math.random() * Math.PI * 2,
    };
    scene.add(orb);
  }
  // Add floating 3D torus
  for (let i = 0; i < 2; i++) {
    const geometry = new THREE.TorusGeometry(0.7, 0.18, 16, 100);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.x = (Math.random() - 0.5) * 10;
    torus.position.y = (Math.random() - 0.5) * 10;
    torus.position.z = (Math.random() - 0.5) * 10;
    torus.userData = {
      originalY: torus.position.y,
      speed: 0.06 + Math.random() * 0.1,
      offset: Math.random() * Math.PI * 2,
    };
    scene.add(torus);
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Animate floating objects
  scene.traverse(function (object) {
    if (object.userData.originalY !== undefined) {
      const time = Date.now() * 0.001;
      object.position.y =
        object.userData.originalY +
        Math.sin(time * object.userData.speed + object.userData.offset) *
          0.5;
      object.rotation.x += 0.01;
      object.rotation.y += 0.01;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize particle system for background
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");

  // Create particles
  const particles = [];
  const particleCount = Math.floor(window.innerWidth / 10);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5,
      speedX: Math.random() * 0.3 - 0.15,
      speedY: Math.random() * 0.3 - 0.15,
      color: `rgba(${Math.floor(Math.random() * 50 + 200)}, 
                          ${Math.floor(Math.random() * 50 + 200)}, 
                          ${Math.floor(Math.random() * 50 + 200)}, 
                          ${Math.random() * 0.5 + 0.05})`,
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update position
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around the edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }

  drawParticles();
}

// Custom cursor functionality
function initCustomCursor() {
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorOutline = document.querySelector(".cursor-outline");
  
  if (!cursorDot || !cursorOutline) return;
  
  document.addEventListener("mousemove", (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorOutline.style.left = `${e.clientX}px`;
    cursorOutline.style.top = `${e.clientY}px`;
  });
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, .glass-card');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
}

// Navigation active state
function initNavigation() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
  
  // Smooth scroll for anchor links
  navLinks.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
  
  // Mobile menu toggle
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// Render and animate 3D skill progress bars
function renderSkill3D() {
  document.querySelectorAll('.skill-3d').forEach((el) => {
    // Remove previous content if any
    el.innerHTML = '';
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 130;
    canvas.height = 130;
    canvas.className = 'skill-3d-canvas';
    el.appendChild(canvas);
    // Content overlay
    const content = document.createElement('div');
    content.className = 'skill-3d-content';
    // Initials
    const initials = document.createElement('div');
    initials.className = 'skill-3d-initials';
    initials.textContent = el.getAttribute('data-skill');
    content.appendChild(initials);
    // Label
    const label = document.createElement('div');
    label.className = 'skill-3d-label';
    label.textContent = el.getAttribute('data-label');
    content.appendChild(label);
    // Percent
    const percent = document.createElement('div');
    percent.className = 'skill-3d-percent';
    percent.textContent = '0%';
    content.appendChild(percent);
    el.appendChild(content);
    // Animate progress
    const ctx = canvas.getContext('2d');
    const target = parseInt(el.getAttribute('data-percent'), 10);
    let current = 0;
    function drawCircle(p) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Background circle
      ctx.beginPath();
      ctx.arc(65, 65, 54, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 12;
      ctx.stroke();
      // Progress circle
      const grad = ctx.createLinearGradient(0, 0, 130, 130);
      grad.addColorStop(0, '#00ffff');
      grad.addColorStop(1, '#ff00ff');
      ctx.beginPath();
      ctx.arc(65, 65, 54, -Math.PI/2, (2 * Math.PI) * (p/100) - Math.PI/2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffff88';
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    function animate() {
      if (current < target) {
        current += 1;
        drawCircle(current);
        percent.textContent = current + '%';
        requestAnimationFrame(animate);
      } else {
        drawCircle(target);
        percent.textContent = target + '%';
      }
    }
    animate();
  });
}

// Mobile tap-to-toggle for project overlays
function enableProjectOverlayMobile() {
  function isMobile() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }
  if (!isMobile()) return;
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Close others
      document.querySelectorAll('.project-card.mobile-overlay').forEach(c => {
        if (c !== card) c.classList.remove('mobile-overlay');
      });
      // Toggle this one
      card.classList.toggle('mobile-overlay');
      e.stopPropagation();
    });
  });
  // Close overlay when clicking outside
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.project-card.mobile-overlay').forEach(card => {
      if (!card.contains(e.target)) card.classList.remove('mobile-overlay');
    });
  });
}

// 3D tilt effect for project cards
function enableProjectCardTilt() {
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 12;
        card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }
}

const PROJECT_DETAILS = {
  cv: `
    <div class='font-bold text-lg text-cyan-200 mb-2'>Cheating Detection System for Online Interviews</div>
    <div class='font-semibold text-cyan-300 mb-1'>Project Overview</div>
    <p class='text-gray-100 mb-4'>With the rise of online interviews, ensuring integrity is a challenge. This system uses computer vision and ML to monitor candidates in real-time and detect suspicious behavior indicative of cheating.</p>
    <div class='font-semibold text-cyan-300 mb-1'>Key Features</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Multimodal data collection (video, audio, interaction)</li>
      <li>Gaze and device detection</li>
      <li>Voice activity detection</li>
      <li>Behavioral anomaly detection</li>
      <li>Real-time alerts and automated reporting</li>
      <li>Data privacy and security compliance</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Dataset</div>
    <p class='text-gray-100 mb-4'>200 video samples, 4 cheating behaviors: smartphone, head movement, eye movement, blocking eyes. Labeled as s_numPerson_scenario.mp4.</p>
    <div class='font-semibold text-cyan-300 mb-1'>Methodology</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Segmentation & augmentation (Albumentations)</li>
      <li>YOLOv5s for face, eyes, device detection</li>
      <li>CNN for gaze, RNN for voice, anomaly detection for input devices</li>
      <li>Clustering: SOM, Fuzzy C-Means, Time Series K-Means</li>
      <li>Real-time feedback & reporting</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Results</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>~83.6% accuracy, all clusters &gt;50%</li>
      <li>Cheating behaviors stored as video evidence</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Limitations & Future Work</div>
    <ul class='mb-2 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Camera placement affects accuracy</li>
      <li>Improve behavior differentiation</li>
      <li>Expand dataset, refine clustering</li>
    </ul>
  `,
  ai: `
    <div class='font-bold text-lg text-cyan-200 mb-2'>AI-Generated Image and Text Detection System</div>
    <div class='font-semibold text-cyan-300 mb-1'>Key Features</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Image analysis: deep features (ResNet50), noise patterns, EXIF, stats, AI signature detection, visual analytics</li>
      <li>Text analysis: watermark phrase detection, repetition, perplexity, formal writing, confidence score</li>
      <li>Intuitive Gradio web interface with visual analytics</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Architecture</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Backend: Python, TensorFlow/Keras, OpenCV, NLTK, SciPy, scikit-image</li>
      <li>Frontend: Gradio</li>
      <li>Models: ResNet50, rule-based NLP</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Use Cases</div>
    <ul class='mb-2 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Detect AI-generated content in media, academia, and publishing</li>
      <li>Visualize AI-likelihood with charts and gauges</li>
    </ul>
  `,
  py: `
    <div class='font-bold text-lg text-cyan-200 mb-2'>Factorial Calculation (Python Package)</div>
    <div class='font-semibold text-cyan-300 mb-1'>How to Use</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Install: <code>pip install TOPSIS-Simranjit-102216033==0.0.1</code></li>
      <li>Input an integer to get its factorial value printed.</li>
    </ul>
  `,
  mr: `
    <div class='font-bold text-lg text-cyan-200 mb-2'>Movie Recommender System</div>
    <div class='font-semibold text-cyan-300 mb-1'>Key Features</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Content-based recommendation using NLP</li>
      <li>Bag-of-Words & Cosine Similarity</li>
      <li>Interactive UI with Streamlit</li>
      <li>Movie posters via TMDB API</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Dataset</div>
    <p class='text-gray-100 mb-4'>TMDB 5000 Movies Dataset (title, overview, genres, cast, crew, etc.)</p>
    <div class='font-semibold text-cyan-300 mb-1'>How It Works</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Preprocessing: merges, cleans, and tags movies</li>
      <li>Feature engineering & vectorization</li>
      <li>Recommendation & UI: top 5 similar movies, posters shown</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Future Improvements</div>
    <ul class='mb-2 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Hybrid filtering, advanced NLP, cloud deployment</li>
    </ul>
  `,
  sm: `
    <div class='font-bold text-lg text-cyan-200 mb-2'>Staff Management System</div>
    <div class='font-semibold text-cyan-300 mb-1'>Project Overview</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Automated timetable generation</li>
      <li>Attendance tracking</li>
      <li>Salary calculation</li>
      <li>Leave management system</li>
      <li>Role-based dashboards & report generation</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Tech Stack</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Frontend: HTML, CSS</li>
      <li>Backend: PHP</li>
      <li>Database: MySQL</li>
      <li>Tools: XAMPP / WAMP / phpMyAdmin</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>User Roles</div>
    <ul class='mb-2 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Admin: Manage users, reports, dashboard</li>
      <li>HOD: Manage courses, approve leaves</li>
      <li>Professor: Apply for leave, view attendance/salary</li>
      <li>Financier: Generate payroll, manage bonuses</li>
      <li>Time Table Coord.: Create/edit schedules</li>
    </ul>
  `,
  wm: `
    <div class='font-bold text-lg text-cyan-200 mb-2'>Walmart Grocery Product Classifier & Smart Cart System</div>
    <div class='font-semibold text-cyan-300 mb-1'>Key Features</div>
    <ul class='mb-4 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>Image classification using MobileNetV2</li>
      <li>Live camera detection</li>
      <li>Price mapping with fuzzy matching (rapidfuzz)</li>
      <li>Dynamic shopping cart</li>
      <li>Colab/image upload support</li>
    </ul>
    <div class='font-semibold text-cyan-300 mb-1'>Dataset</div>
    <p class='text-gray-100 mb-4'>43 grocery categories, Kaggle pricing data</p>
    <div class='font-semibold text-cyan-300 mb-1'>Model Overview</div>
    <ul class='mb-2 text-sm text-cyan-100 space-y-1 pl-4 list-disc'>
      <li>MobileNetV2 (pretrained)</li>
      <li>2128 training, 512 validation images</li>
      <li>224x224 RGB, ~90% accuracy</li>
      <li>Model: product_classifier.keras</li>
    </ul>
  `
};

function enableProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('project-modal-body');
  const closeBtn = document.getElementById('close-project-modal');
  document.querySelectorAll('.project-details-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const key = btn.getAttribute('data-project');
      modalBody.innerHTML = PROJECT_DETAILS[key] || '';
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });
  closeBtn.addEventListener('click', function() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initThreeJS();
  initParticles();
  initCustomCursor();
  initNavigation();
  renderSkill3D();
  enableProjectOverlayMobile();
  enableProjectCardTilt();
  enableProjectModal();
}); 