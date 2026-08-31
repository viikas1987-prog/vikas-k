import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { RotateCw, Sparkles, Heart } from 'lucide-react';
import { cozyAudio } from '../../utils/audioSynth';

interface ProductViewer3DProps {
  product: Product;
  selectedColorHex?: string;
  onColorChange?: (hex: string) => void;
}

export const ProductViewer3D: React.FC<ProductViewer3DProps> = ({
  product,
  selectedColorHex,
  onColorChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [currentColor, setCurrentColor] = useState(selectedColorHex || product.colors[0]?.hex || '#F5EBE1');
  const [isRotating, setIsRotating] = useState(true);
  const [softnessPulse, setSoftnessPulse] = useState(false);
  const meshMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (selectedColorHex) {
      setCurrentColor(selectedColorHex);
    }
  }, [selectedColorHex]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 3.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, theme === 'dark' ? 1.6 : 2.2);
    scene.add(ambient);

    const light1 = new THREE.DirectionalLight(0xfff5ea, 2.0);
    light1.position.set(3, 4, 3);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(theme === 'dark' ? 0x8E9FFF : 0xffd2cb, 1.2);
    light2.position.set(-3, -2, -2);
    scene.add(light2);

    const itemGroup = new THREE.Group();
    scene.add(itemGroup);

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentColor),
      roughness: 0.88,
      metalness: 0.02,
    });
    meshMatRef.current = material;

    if (product.modelType === 'romper') {
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.72, 1.2, 32), material);
      torso.scale.set(1, 1, 0.6);
      itemGroup.add(torso);

      const leftSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.55, 16), material);
      leftSleeve.position.set(-0.75, 0.35, 0);
      leftSleeve.rotation.z = Math.PI / 3.5;
      const rightSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.55, 16), material);
      rightSleeve.position.set(0.75, 0.35, 0);
      rightSleeve.rotation.z = -Math.PI / 3.5;
      itemGroup.add(leftSleeve, rightSleeve);

      const buttonMat = new THREE.MeshStandardMaterial({ color: 0x8B5E3C, roughness: 0.5 });
      for (let i = 0; i < 3; i++) {
        const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), buttonMat);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(0, 0.35 - i * 0.32, 0.32);
        itemGroup.add(btn);
      }

      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.45, 16), material);
      leftLeg.position.set(-0.35, -0.75, 0);
      const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.45, 16), material);
      rightLeg.position.set(0.35, -0.75, 0);
      itemGroup.add(leftLeg, rightLeg);
    } else if (product.modelType === 'teddy') {
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), material);
      head.position.set(0, 0.35, 0);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.68, 24, 24), material);
      body.position.set(0, -0.45, 0);
      body.scale.set(1, 1.1, 0.9);

      const earGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const lEar = new THREE.Mesh(earGeo, material);
      lEar.position.set(-0.45, 0.75, 0);
      const rEar = new THREE.Mesh(earGeo, material);
      rEar.position.set(0.45, 0.75, 0);

      const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), new THREE.MeshStandardMaterial({ color: 0xFFFDF0, roughness: 0.9 }));
      muzzle.position.set(0, 0.25, 0.42);

      itemGroup.add(head, body, lEar, rEar, muzzle);
    } else if (product.modelType === 'swaddle' || product.modelType === 'quilt') {
      for (let i = 0; i < 3; i++) {
        const fold = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.28, 1.1), material);
        fold.position.set(0, (i - 1) * 0.26, 0);
        itemGroup.add(fold);
      }
      const ribbonMat = new THREE.MeshStandardMaterial({ color: theme === 'dark' ? 0x8E9FFF : 0xF9B7B2, metalness: 0.3 });
      const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.85, 1.15), ribbonMat);
      itemGroup.add(ribbon);
    } else {
      const bootie1 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), material);
      bootie1.position.set(-0.4, 0, 0);
      bootie1.scale.set(0.9, 0.8, 1.3);
      const cuff1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.35, 16), material);
      cuff1.position.set(-0.4, 0.3, -0.1);

      const bootie2 = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), material);
      bootie2.position.set(0.4, 0, 0);
      bootie2.scale.set(0.9, 0.8, 1.3);
      const cuff2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.35, 16), material);
      cuff2.position.set(0.4, 0.3, -0.1);

      itemGroup.add(bootie1, cuff1, bootie2, cuff2);
    }

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setIsRotating(false);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      itemGroup.rotation.y += deltaX * 0.015;
      itemGroup.rotation.x += deltaY * 0.015;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isDragging) {
        itemGroup.rotation.y += 0.008;
      }
      itemGroup.position.y = Math.sin(elapsed * 1.8) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

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
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [product, theme]);

  const handleColorPick = (hex: string) => {
    cozyAudio.playBubblePop();
    setCurrentColor(hex);
    if (meshMatRef.current) {
      meshMatRef.current.color.set(hex);
    }
    if (onColorChange) onColorChange(hex);
  };

  const handleTestSoftness = () => {
    cozyAudio.playSparkle();
    setSoftnessPulse(true);
    setTimeout(() => setSoftnessPulse(false), 1200);
  };

  return (
    <div className="w-full flex flex-col items-center bg-cozy-cream/60 dark:bg-cozy-night-card/60 backdrop-blur-xl rounded-3xl p-6 border border-cozy-blush/40 dark:border-cozy-night-border relative shadow-soft-clay">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cozy-blush/60 dark:bg-cozy-night-cardHover text-cozy-warmBrown dark:text-cozy-night-accent flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cozy-rose" /> 3D 360° Studio Visualizer
        </span>
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/80 dark:bg-cozy-night-card text-cozy-warmBrown dark:text-cozy-night-textMuted hover:bg-cozy-peach transition flex items-center gap-1"
          title="Toggle Auto-Rotation"
        >
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin-slow text-cozy-rose' : ''}`} />
          {isRotating ? 'Rotating' : 'Paused'}
        </button>
      </div>

      <div
        ref={mountRef}
        className={`w-full h-64 md:h-80 cursor-grab active:cursor-grabbing transition-transform duration-500 ${
          softnessPulse ? 'scale-105' : 'scale-100'
        }`}
        title="Click and drag to rotate in 360°"
      />

      <div className="w-full mt-3 pt-3 border-t border-cozy-blush/30 dark:border-cozy-night-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cozy-warmBrown/80 dark:text-cozy-night-textMuted">
            3D Fabric Shade:
          </span>
          <div className="flex items-center gap-1.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => handleColorPick(c.hex)}
                className={`w-7 h-7 rounded-full border-2 transition-all transform hover:scale-110 shadow-sm ${
                  currentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'border-cozy-warmBrown dark:border-white ring-2 ring-cozy-rose/50 scale-110'
                    : 'border-white dark:border-cozy-night-border'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleTestSoftness}
          className="text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-cozy-rose to-cozy-peach text-white shadow-soft-glow hover:opacity-95 active:scale-95 transition flex items-center gap-1.5"
        >
          <Heart className="w-3.5 h-3.5 fill-current animate-pulse" />
          Test Fabric Softness ({product.softnessScore}/10)
        </button>
      </div>
    </div>
  );
};
