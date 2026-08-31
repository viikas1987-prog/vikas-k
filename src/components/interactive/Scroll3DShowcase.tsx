import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Rotate3d, Layers, Zap, ShoppingBag } from 'lucide-react';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { cozyAudio } from '../../utils/audioSynth';

export const Scroll3DShowcase: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isWireframe, setIsWireframe] = useState(false);

  const showcaseProducts = products.slice(0, 4);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x11131a, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b6b, 3.5, 25);
    pointLight1.position.set(3, 4, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x6eb5ff, 3, 25);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(0, 6, 4);
    scene.add(dirLight);

    // 4. Floating 3D Group (Pedestal, Crystals, Torus & Particle Cloud)
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Glowing 3D Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.35, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1f2430,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: isWireframe,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.2;
    mainGroup.add(pedestal);

    // Neon Halo Ring around Pedestal
    const ringGeo = new THREE.TorusGeometry(2.55, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.02;
    mainGroup.add(ringMesh);

    // Floating 3D Geometric Crystals
    const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xff8e71,
      roughness: 0.1,
      metalness: 0.9,
    });

    const crystals: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.2;
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(
        Math.cos(angle) * radius,
        -0.4 + Math.sin(i * 1.5) * 0.4,
        Math.sin(angle) * radius
      );
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mainGroup.add(crystal);
      crystals.push(crystal);
    }

    // 3D Floating Particle Sphere Field
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 9;
      particlePositions[i + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i + 2] = (Math.random() - 0.5) * 9;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffb2af,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3D Floating Torus Core
    const torusGeo = new THREE.TorusGeometry(1.4, 0.08, 16, 80);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: isWireframe,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.y = 0.3;
    mainGroup.add(torus);

    // 5. Scroll Interaction Hook
    let targetRotationY = 0;
    let targetCameraY = 1.2;
    let targetCameraZ = 5.5;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

      setScrollProgress(progress);

      // Rotate 3D studio with scroll
      targetRotationY = progress * Math.PI * 4;
      targetCameraY = 1.2 + Math.sin(progress * Math.PI * 2) * 0.8;
      targetCameraZ = 5.5 - Math.sin(progress * Math.PI) * 1.2;

      // Select active product based on scroll angle
      const segment = Math.floor((progress * 4) % 4);
      setActiveItemIndex(segment);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 6. Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation for 3D rotation based on scroll
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.06;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05 + mouseY * 0.1;
      mainGroup.rotation.z = mouseX * 0.05;

      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.05;
      camera.lookAt(0, 0, 0);

      // Animate floating elements
      torus.rotation.x = elapsedTime * 0.6;
      torus.rotation.y = elapsedTime * 0.8;

      crystals.forEach((c, idx) => {
        c.rotation.x += 0.015 * (idx % 2 === 0 ? 1 : -1);
        c.rotation.y += 0.02;
        c.position.y = -0.4 + Math.sin(elapsedTime * 1.5 + idx) * 0.25;
      });

      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = elapsedTime * 0.02;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isWireframe]);

  const currentProduct = showcaseProducts[activeItemIndex] || showcaseProducts[0];

  return (
    <section id="3d-studio" className="w-full py-12 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-[#13161F] via-[#1A1F2C] to-[#0F1118] text-white rounded-4xl p-6 sm:p-12 shadow-2xl border border-gray-800 relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF6B6B]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#6EB5FF]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-20">
          <div>
            <div className="flex items-center gap-2 text-[#FF6B6B] text-xs font-extrabold tracking-widest uppercase mb-1">
              <Rotate3d className="w-4 h-4 animate-spin" />
              <span>Scroll-Driven WebGL 3D Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              3D Dynamic Scroll Runway
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium mt-1">
              Scroll up and down to rotate the 3D studio, inspect angles, and explore real drops in 360°.
            </p>
          </div>

          {/* Interactive 3D Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                cozyAudio.playSoftTap();
                setIsWireframe(!isWireframe);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                isWireframe
                  ? 'bg-[#FF6B6B] text-white border-[#FF6B6B]'
                  : 'bg-white/10 text-gray-300 border-white/10 hover:bg-white/20'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isWireframe ? 'Solid Mode' : '3D Wireframe'}</span>
            </button>
          </div>
        </div>

        {/* 3D Canvas & Interactive Floating HUD Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[500px] relative">
          
          {/* Left / Center 3D WebGL Canvas Area */}
          <div
            ref={mountRef}
            className="lg:col-span-8 w-full h-[400px] sm:h-[500px] rounded-3xl relative overflow-hidden cursor-grab active:cursor-grabbing"
          >
            {/* Scroll Indicator Badge in 3D Canvas */}
            <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[11px] font-bold text-gray-300 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#FF6B6B] animate-pulse" />
              <span>3D Scroll Velocity: {Math.round(scrollProgress * 100)}%</span>
            </div>

            {/* Hint overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-gray-400 font-medium">
              ↕ Scroll page or move mouse to orbit 3D space
            </div>
          </div>

          {/* Right Product 3D Focus Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-3xl flex flex-col justify-between shadow-2xl relative z-20">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6B6B] bg-[#FF6B6B]/20 px-2.5 py-1 rounded-full">
                  Live 3D Model {activeItemIndex + 1}/4
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Verified Stock
                </span>
              </div>

              {/* Product Image preview */}
              <div className="w-full aspect-square rounded-2xl bg-black/40 p-3 mb-4 flex items-center justify-center overflow-hidden border border-white/10 relative group">
                <img
                  src={currentProduct.images[0]}
                  alt={currentProduct.name}
                  className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white px-2.5 py-1 rounded-full">
                  {currentProduct.discountPercent}% OFF
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white line-clamp-2 leading-tight">
                {currentProduct.name}
              </h3>
              <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                {currentProduct.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-3">
                <span className="text-2xl font-black text-[#FF6B6B]">
                  ₹{currentProduct.price.toLocaleString('en-IN')}.00
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{currentProduct.originalPrice.toLocaleString('en-IN')}.00
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart CTA */}
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  cozyAudio.playCelebration();
                  addToCart(currentProduct, currentProduct.colors[0], currentProduct.sizes[0], 1);
                }}
                className="w-full py-3 bg-[#FF6B6B] hover:bg-[#F05252] text-white text-xs font-bold rounded-full transition shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag — ₹{currentProduct.price}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-2">
                {showcaseProducts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      cozyAudio.playSoftTap();
                      setActiveItemIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeItemIndex === i ? 'w-6 bg-[#FF6B6B]' : 'w-2 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
