import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

interface FloatingItem {
  mesh: THREE.Object3D;
  speed: number;
  rotSpeed: number;
  offset: number;
}

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const ambientLight = new THREE.AmbientLight(
      theme === 'dark' ? 0x9ba9ff : 0xfffaea,
      theme === 'dark' ? 1.4 : 1.8
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0e6, 2.2);
    dirLight.position.set(4, 6, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(
      theme === 'dark' ? 0x7b8eff : 0xffd1cc,
      theme === 'dark' ? 2.5 : 1.5
    );
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // 1. Build 3D Cuddle Bear "Bambi"
    const bearGroup = new THREE.Group();
    mainGroup.add(bearGroup);

    const bearMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0xD4A373 : 0xE6BA95,
      roughness: 0.85,
      metalness: 0.05,
    });

    const muzzleMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFF8EE,
      roughness: 0.8,
    });

    const darkFeatureMaterial = new THREE.MeshStandardMaterial({
      color: 0x3E2723,
      roughness: 0.5,
    });

    const pinkInnerEarMaterial = new THREE.MeshStandardMaterial({
      color: 0xFAB4B0,
      roughness: 0.9,
    });

    // Bear Head
    const headGeo = new THREE.SphereGeometry(0.72, 32, 32);
    const head = new THREE.Mesh(headGeo, bearMaterial);
    head.castShadow = true;
    bearGroup.add(head);

    // Bear Snout
    const muzzleGeo = new THREE.SphereGeometry(0.3, 24, 24);
    const muzzle = new THREE.Mesh(muzzleGeo, muzzleMaterial);
    muzzle.position.set(0, -0.15, 0.56);
    muzzle.scale.set(1.1, 0.85, 0.9);
    bearGroup.add(muzzle);

    // Nose
    const noseGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nose = new THREE.Mesh(noseGeo, darkFeatureMaterial);
    nose.position.set(0, -0.07, 0.82);
    nose.scale.set(1.2, 0.8, 0.8);
    bearGroup.add(nose);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, darkFeatureMaterial);
    leftEye.position.set(-0.24, 0.08, 0.64);
    const rightEye = new THREE.Mesh(eyeGeo, darkFeatureMaterial);
    rightEye.position.set(0.24, 0.08, 0.64);
    bearGroup.add(leftEye, rightEye);

    // Eye catchlights
    const catchlightGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftCatch = new THREE.Mesh(catchlightGeo, catchlightMat);
    leftCatch.position.set(-0.22, 0.11, 0.69);
    const rightCatch = new THREE.Mesh(catchlightGeo, catchlightMat);
    rightCatch.position.set(0.26, 0.11, 0.69);
    bearGroup.add(leftCatch, rightCatch);

    // Ears
    const earGeo = new THREE.SphereGeometry(0.26, 24, 24);
    const leftEar = new THREE.Mesh(earGeo, bearMaterial);
    leftEar.position.set(-0.58, 0.56, 0);
    leftEar.scale.set(1, 1, 0.5);

    const leftInnerEar = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), pinkInnerEarMaterial);
    leftInnerEar.position.set(-0.58, 0.56, 0.08);
    leftInnerEar.scale.set(1, 1, 0.3);

    const rightEar = new THREE.Mesh(earGeo, bearMaterial);
    rightEar.position.set(0.58, 0.56, 0);
    rightEar.scale.set(1, 1, 0.5);

    const rightInnerEar = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), pinkInnerEarMaterial);
    rightInnerEar.position.set(0.58, 0.56, 0.08);
    rightInnerEar.scale.set(1, 1, 0.3);

    bearGroup.add(leftEar, leftInnerEar, rightEar, rightInnerEar);

    // Body
    const bodyGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const body = new THREE.Mesh(bodyGeo, bearMaterial);
    body.position.set(0, -1.05, -0.05);
    body.scale.set(1.05, 1.2, 0.95);
    body.castShadow = true;
    bearGroup.add(body);

    // Tummy Soft Patch
    const tummyPatchGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const tummyPatch = new THREE.Mesh(tummyPatchGeo, muzzleMaterial);
    tummyPatch.position.set(0, -1.05, 0.42);
    tummyPatch.scale.set(0.9, 1.1, 0.4);
    bearGroup.add(tummyPatch);

    // Arms
    const armGeo = new THREE.CapsuleGeometry(0.22, 0.5, 16, 16);
    const leftArm = new THREE.Mesh(armGeo, bearMaterial);
    leftArm.position.set(-0.82, -0.9, 0.2);
    leftArm.rotation.z = Math.PI / 5;
    leftArm.rotation.x = -Math.PI / 8;

    const rightArm = new THREE.Mesh(armGeo, bearMaterial);
    rightArm.position.set(0.82, -0.9, 0.2);
    rightArm.rotation.z = -Math.PI / 5;
    rightArm.rotation.x = -Math.PI / 8;
    bearGroup.add(leftArm, rightArm);

    // Feet
    const footGeo = new THREE.SphereGeometry(0.3, 24, 24);
    const leftFoot = new THREE.Mesh(footGeo, bearMaterial);
    leftFoot.position.set(-0.5, -1.9, 0.25);
    leftFoot.scale.set(1, 0.75, 1.3);

    const rightFoot = new THREE.Mesh(footGeo, bearMaterial);
    rightFoot.position.set(0.5, -1.9, 0.25);
    rightFoot.scale.set(1, 0.75, 1.3);
    bearGroup.add(leftFoot, rightFoot);

    // Bowtie
    const bowGeo = new THREE.ConeGeometry(0.16, 0.24, 16);
    const bowMat = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x8E9FFF : 0xF9B7B2,
      roughness: 0.6,
    });
    const leftBow = new THREE.Mesh(bowGeo, bowMat);
    leftBow.rotation.z = Math.PI / 2;
    leftBow.position.set(-0.13, -0.48, 0.68);
    const rightBow = new THREE.Mesh(bowGeo, bowMat);
    rightBow.rotation.z = -Math.PI / 2;
    rightBow.position.set(0.13, -0.48, 0.68);
    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), bowMat);
    knot.position.set(0, -0.48, 0.72);
    bearGroup.add(leftBow, rightBow, knot);

    bearGroup.position.set(0, 0.3, 0);

    // 2. Floating 3D Clouds
    const cloudMat = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0x3A4476 : 0xFFFFFF,
      roughness: 0.9,
      transparent: true,
      opacity: 0.85,
    });

    const clouds: THREE.Group[] = [];
    const createCloud = (x: number, y: number, z: number, scale: number) => {
      const cloud = new THREE.Group();
      const numPuffs = 5;
      for (let i = 0; i < numPuffs; i++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(0.35 + Math.random() * 0.2, 16, 16), cloudMat);
        puff.position.set((i - 2) * 0.25, (Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.2);
        cloud.add(puff);
      }
      cloud.position.set(x, y, z);
      cloud.scale.set(scale, scale, scale);
      mainGroup.add(cloud);
      clouds.push(cloud);
    };

    createCloud(-2.2, 1.4, -0.8, 1.1);
    createCloud(2.4, 0.9, -1.2, 1.3);
    createCloud(-1.9, -1.2, -0.5, 0.85);

    // 3. Floating 3D Ornaments
    const starMat = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? 0xFFDF78 : 0xFFC83B,
      metalness: 0.2,
      roughness: 0.4,
      emissive: theme === 'dark' ? 0x443300 : 0x000000,
    });

    const floatingItems: FloatingItem[] = [];

    // Wooden Teether ring
    const ringGeo = new THREE.TorusGeometry(0.35, 0.08, 16, 32);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0xDDB892, roughness: 0.6 });
    const teetherRing = new THREE.Mesh(ringGeo, woodMat);
    teetherRing.position.set(1.9, -0.9, 0.3);
    mainGroup.add(teetherRing);
    floatingItems.push({ mesh: teetherRing, speed: 1.2, rotSpeed: 0.015, offset: 2.0 });

    // Baby Pacifier
    const pacifierGroup = new THREE.Group();
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 24), bowMat);
    shield.rotation.x = Math.PI / 2;
    const teat = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), muzzleMaterial);
    teat.position.set(0, 0, 0.12);
    teat.scale.set(0.9, 0.9, 1.3);
    pacifierGroup.add(shield, teat);
    pacifierGroup.position.set(-1.8, -0.2, 0.4);
    mainGroup.add(pacifierGroup);
    floatingItems.push({ mesh: pacifierGroup, speed: 1.4, rotSpeed: -0.012, offset: 4.2 });

    // Small Gold Stars
    for (let i = 0; i < 4; i++) {
      const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.12, 0), starMat);
      const angle = (i / 4) * Math.PI * 2;
      const radius = 2.0 + Math.random() * 0.5;
      star.position.set(Math.cos(angle) * radius, Math.sin(angle) * 1.5, (Math.random() - 0.5) * 1.5);
      mainGroup.add(star);
      floatingItems.push({ mesh: star, speed: 0.8 + Math.random() * 0.6, rotSpeed: 0.02, offset: i * 1.5 });
    }

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetRotY = mouseX * 0.45;
      targetRotX = mouseY * 0.25;
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;

      bearGroup.position.y = 0.3 + Math.sin(elapsed * 1.5) * 0.08;
      bearGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.03;
      body.scale.x = 1.05 + Math.sin(elapsed * 2.0) * 0.02;
      body.scale.y = 1.2 + Math.sin(elapsed * 2.0) * 0.02;

      leftEar.rotation.z = Math.sin(elapsed * 3) * 0.06;
      rightEar.rotation.z = -Math.sin(elapsed * 3) * 0.06;

      floatingItems.forEach((item) => {
        item.mesh.position.y += Math.sin(elapsed * item.speed + item.offset) * 0.003;
        item.mesh.rotation.x += item.rotSpeed;
        item.mesh.rotation.y += item.rotSpeed * 1.2;
      });

      clouds.forEach((cloud, i) => {
        cloud.position.x += Math.sin(elapsed * 0.4 + i) * 0.002;
        cloud.position.y += Math.cos(elapsed * 0.5 + i) * 0.002;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[420px] md:min-h-[560px] flex items-center justify-center cursor-grab active:cursor-grabbing relative select-none"
      title="Drag or move cursor to interact with Bambi Bear in 3D!"
    >
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 pointer-events-none text-xs font-semibold px-4 py-1.5 rounded-full bg-white/70 dark:bg-cozy-night-card/80 backdrop-blur-md shadow-sm border border-white/60 dark:border-white/10 text-cozy-warmBrown dark:text-cozy-night-accent flex items-center gap-1.5 animate-pulse-gentle">
        <span>✨</span> Move cursor or touch to cuddle Bambi in 3D <span>🧸</span>
      </div>
    </div>
  );
};