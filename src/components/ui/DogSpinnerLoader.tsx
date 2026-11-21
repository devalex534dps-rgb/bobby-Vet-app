import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

interface DogSpinnerLoaderProps {
  message?: string;
}

function createRealisticFurMaps(baseHex: string, darkHex: string, lightHex: string) {
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = 512;
  colorCanvas.height = 512;
  const cCtx = colorCanvas.getContext("2d")!;

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext("2d")!;

  cCtx.fillStyle = baseHex;
  cCtx.fillRect(0, 0, 512, 512);
  bCtx.fillStyle = "#808080";
  bCtx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 14000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const len = 5 + Math.random() * 10;
    const dx = (Math.random() - 0.5) * 2.5;
    const pick = Math.random();

    cCtx.strokeStyle = pick > 0.55 ? lightHex : pick > 0.2 ? baseHex : darkHex;
    cCtx.globalAlpha = 0.28 + Math.random() * 0.28;
    cCtx.lineWidth = 1 + Math.random() * 0.9;
    cCtx.beginPath();
    cCtx.moveTo(x, y);
    cCtx.lineTo(x + dx, y + len);
    cCtx.stroke();

    const bVal = Math.floor(90 + Math.random() * 130);
    bCtx.strokeStyle = `rgb(${bVal},${bVal},${bVal})`;
    bCtx.globalAlpha = 0.35;
    bCtx.lineWidth = 1.1;
    bCtx.beginPath();
    bCtx.moveTo(x, y);
    bCtx.lineTo(x + dx, y + len);
    bCtx.stroke();
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;

  return { map, bumpMap };
}

export const DogSpinnerLoader: React.FC<DogSpinnerLoaderProps> = ({
  message = "Buscando expediente e historial...",
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = 290;
    const height = 225;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0.45, 1.32, 4.35);
    camera.lookAt(0, 0.72, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Iluminación de estudio fotográfico
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xd4e2f0, 1.1);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.45);
    keyLight.position.set(3.2, 5.5, 4.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdceeff, 0.6);
    fillLight.position.set(-3.5, 2.2, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    rimLight.position.set(-2.5, 3.8, -3.5);
    scene.add(rimLight);

    // Texturas procedurales de pelaje realistas
    const tanMaps = createRealisticFurMaps("#c6783c", "#8f4b1d", "#e3a168");
    const whiteMaps = createRealisticFurMaps("#f5f2eb", "#dcd6ca", "#ffffff");
    const blackMaps = createRealisticFurMaps("#23252b", "#121317", "#3d4049");

    const tanMat = new THREE.MeshStandardMaterial({
      map: tanMaps.map,
      bumpMap: tanMaps.bumpMap,
      bumpScale: 0.018,
      roughness: 0.82,
      metalness: 0.02,
    });
    const whiteMat = new THREE.MeshStandardMaterial({
      map: whiteMaps.map,
      bumpMap: whiteMaps.bumpMap,
      bumpScale: 0.014,
      roughness: 0.84,
      metalness: 0.01,
    });
    const blackMat = new THREE.MeshStandardMaterial({
      map: blackMaps.map,
      bumpMap: blackMaps.bumpMap,
      bumpScale: 0.018,
      roughness: 0.8,
      metalness: 0.02,
    });
    const earMat = new THREE.MeshStandardMaterial({
      map: tanMaps.map,
      bumpMap: tanMaps.bumpMap,
      bumpScale: 0.016,
      color: 0xd99b6a,
      roughness: 0.85,
    });
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0x16171b,
      roughness: 0.14,
      metalness: 0.08,
    });
    const irisMat = new THREE.MeshStandardMaterial({ color: 0x4a2912, roughness: 0.15 });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.05 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xc29e76, roughness: 0.5 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xd6dde6, metalness: 0.85, roughness: 0.2 });
    const tongueMat = new THREE.MeshStandardMaterial({ color: 0xe66a7a, roughness: 0.25 });
    const mouthInnerMat = new THREE.MeshStandardMaterial({ color: 0x5c232b, roughness: 0.7 });

    // Sombra suave en el suelo
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 36),
      new THREE.ShadowMaterial({ opacity: 0.16 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    scene.add(floor);

    const dogRoot = new THREE.Group();
    scene.add(dogRoot);

    const dog = new THREE.Group();
    dog.position.set(0, 0.58, 0);
    dogRoot.add(dog);

    // Torso orgánico
    const bodyGroup = new THREE.Group();
    dog.add(bodyGroup);

    const ribcage = new THREE.Mesh(new THREE.SphereGeometry(0.35, 28, 28), tanMat);
    ribcage.position.set(0, 0.04, 0.18);
    ribcage.scale.set(0.84, 0.94, 1.12);
    ribcage.castShadow = true;
    bodyGroup.add(ribcage);

    const blackSaddle = new THREE.Mesh(new THREE.SphereGeometry(0.345, 28, 28), blackMat);
    blackSaddle.position.set(0, 0.09, -0.1);
    blackSaddle.scale.set(0.88, 0.86, 1.32);
    blackSaddle.castShadow = true;
    bodyGroup.add(blackSaddle);

    const whiteBelly = new THREE.Mesh(new THREE.SphereGeometry(0.31, 24, 24), whiteMat);
    whiteBelly.position.set(0, -0.07, 0.02);
    whiteBelly.scale.set(0.82, 0.72, 1.45);
    bodyGroup.add(whiteBelly);

    const whiteChest = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), whiteMat);
    whiteChest.position.set(0, -0.02, 0.43);
    whiteChest.scale.set(0.84, 0.95, 0.72);
    whiteChest.castShadow = true;
    bodyGroup.add(whiteChest);

    const haunch = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), tanMat);
    haunch.position.set(0, 0.02, -0.34);
    haunch.scale.set(0.86, 0.88, 0.96);
    haunch.castShadow = true;
    bodyGroup.add(haunch);

    // 4 Patas articuladas con dedos
    const legPivots: THREE.Group[] = [];
    const legSpecs = [
      { x: -0.19, z: 0.34, isFront: true },
      { x: 0.19, z: 0.34, isFront: true },
      { x: -0.19, z: -0.36, isFront: false },
      { x: 0.19, z: -0.36, isFront: false },
    ];
    legSpecs.forEach(({ x, z, isFront }) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, -0.06, z);

      const thigh = new THREE.Mesh(
        new THREE.CapsuleGeometry(isFront ? 0.085 : 0.105, 0.22, 12, 16),
        tanMat
      );
      thigh.position.set(0, -0.14, isFront ? 0 : -0.02);
      thigh.rotation.x = isFront ? 0.06 : -0.14;
      thigh.castShadow = true;
      pivot.add(thigh);

      const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.2, 12, 16), whiteMat);
      shin.position.set(0, -0.32, isFront ? 0.01 : 0.02);
      shin.castShadow = true;
      pivot.add(shin);

      const pawGroup = new THREE.Group();
      pawGroup.position.set(0, -0.44, 0.06);
      [-0.035, 0, 0.035].forEach((tx, idx) => {
        const toe = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), whiteMat);
        toe.position.set(tx, 0, idx === 1 ? 0.03 : 0.015);
        toe.scale.set(0.85, 0.72, 1.35);
        toe.castShadow = true;
        pawGroup.add(toe);
      });
      pivot.add(pawGroup);

      dog.add(pivot);
      legPivots.push(pivot);
    });

    // Cola Beagle curva con punta blanca
    const tailPivot = new THREE.Group();
    tailPivot.position.set(0, 0.18, -0.55);
    const tailLower = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.22, 10, 14), blackMat);
    tailLower.position.set(0, 0.13, -0.06);
    tailLower.rotation.x = -0.38;
    tailLower.castShadow = true;
    tailPivot.add(tailLower);
    const tailTip = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.2, 10, 14), whiteMat);
    tailTip.position.set(0, 0.31, -0.11);
    tailTip.rotation.x = -0.15;
    tailTip.castShadow = true;
    tailPivot.add(tailTip);
    dog.add(tailPivot);

    // Cuello y Collar de cuero con placa
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.27, 0.3, 24), tanMat);
    neck.position.set(0, 0.27, 0.41);
    neck.rotation.x = 0.28;
    neck.castShadow = true;
    dog.add(neck);

    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.042, 14, 32), collarMat);
    collar.position.set(0, 0.27, 0.44);
    collar.rotation.x = Math.PI / 2.2;
    dog.add(collar);

    const tagPivot = new THREE.Group();
    tagPivot.position.set(0, 0.17, 0.66);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.007, 8, 16), metalMat);
    tagPivot.add(ring);
    const tag = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.015, 20), metalMat);
    tag.position.set(0, -0.055, 0);
    tag.rotation.x = Math.PI / 2;
    tagPivot.add(tag);
    dog.add(tagPivot);

    // Cabeza esculpida
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.52, 0.51);
    dog.add(headGroup);

    const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 28), tanMat);
    cranium.scale.set(1.0, 0.96, 1.06);
    cranium.castShadow = true;
    headGroup.add(cranium);

    // Frente con línea blanca (blaze)
    const blaze = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.22, 10, 14), whiteMat);
    blaze.position.set(0, 0.1, 0.25);
    blaze.rotation.x = 0.44;
    blaze.scale.set(0.85, 1, 0.38);
    headGroup.add(blaze);

    // Hocico con belfos suaves
    const muzzleTop = new THREE.Mesh(new THREE.SphereGeometry(0.155, 22, 22), whiteMat);
    muzzleTop.position.set(0, -0.04, 0.3);
    muzzleTop.scale.set(0.95, 0.68, 1.24);
    muzzleTop.castShadow = true;
    headGroup.add(muzzleTop);

    [-0.075, 0.075].forEach((fx) => {
      const flew = new THREE.Mesh(new THREE.SphereGeometry(0.078, 14, 14), whiteMat);
      flew.position.set(fx, -0.085, 0.32);
      flew.scale.set(0.9, 0.72, 1.2);
      headGroup.add(flew);
    });

    // Nariz húmeda
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 18, 18), noseMat);
    nose.position.set(0, -0.005, 0.48);
    nose.scale.set(1.25, 0.8, 0.85);
    headGroup.add(nose);

    // Ojos realistas (borde oscuro, iris marrón, pupila y brillo)
    [-0.125, 0.125].forEach((ex) => {
      const eyeSocket = new THREE.Mesh(new THREE.SphereGeometry(0.056, 16, 16), blackMat);
      eyeSocket.position.set(ex, 0.08, 0.265);
      headGroup.add(eyeSocket);

      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 16), irisMat);
      iris.position.set(ex, 0.082, 0.278);
      headGroup.add(iris);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.032, 14, 14), pupilMat);
      pupil.position.set(ex, 0.082, 0.296);
      headGroup.add(pupil);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 10), glintMat);
      glint.position.set(ex + 0.014, 0.098, 0.32);
      headGroup.add(glint);
    });

    // Orejas anchas y suaves de Beagle
    const earPivots: THREE.Group[] = [];
    [-1, 1].forEach((side) => {
      const earPivot = new THREE.Group();
      earPivot.position.set(side * 0.27, 0.08, -0.01);

      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 20), earMat);
      ear.position.set(side * 0.05, -0.18, 0.01);
      ear.scale.set(0.28, 1.35, 0.88);
      ear.rotation.z = side * -0.18;
      ear.castShadow = true;
      earPivot.add(ear);

      headGroup.add(earPivot);
      earPivots.push(earPivot);
    });

    // Cavidad bucal, mandíbula y lengua
    const mouthBg = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), mouthInnerMat);
    mouthBg.position.set(0, -0.09, 0.25);
    mouthBg.scale.set(1, 0.55, 1.1);
    headGroup.add(mouthBg);

    const jawPivot = new THREE.Group();
    jawPivot.position.set(0, -0.095, 0.2);
    headGroup.add(jawPivot);

    const lowerJaw = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), whiteMat);
    lowerJaw.position.set(0, -0.025, 0.12);
    lowerJaw.scale.set(0.85, 0.4, 1.12);
    jawPivot.add(lowerJaw);

    const tongue = new THREE.Mesh(new THREE.CapsuleGeometry(0.048, 0.14, 10, 14), tongueMat);
    tongue.position.set(0, -0.028, 0.21);
    tongue.rotation.x = 0.78;
    tongue.scale.set(1.05, 1, 0.32);
    jawPivot.add(tongue);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const t = elapsed % 5.0;

      // Vueltas despacio (0s -> 2.3s)
      if (t < 2.3) {
        dogRoot.rotation.y = (t / 2.3) * Math.PI * 2;
      } else {
        dogRoot.rotation.y = Math.PI * 2 + Math.sin((t - 2.3) * 1.2) * 0.15;
      }

      // Salto + mortal en el aire (2.2s -> 3.85s)
      let jumpY = 0;
      let flipX = 0;
      let earFlap = 0;
      if (t >= 2.2 && t < 2.5) {
        const p = (t - 2.2) / 0.3;
        jumpY = -0.07 * Math.sin(p * Math.PI);
      } else if (t >= 2.5 && t < 3.85) {
        const p = (t - 2.5) / 1.35;
        jumpY = Math.sin(p * Math.PI) * 1.05;
        flipX = -p * Math.PI * 2;
        earFlap = Math.sin(p * Math.PI) * 0.85;
      }

      dog.position.y = 0.58 + jumpY;
      dog.rotation.x = flipX;
      floor.scale.setScalar(Math.max(0.45, 1 - jumpY * 0.45));
      earPivots[0].rotation.z = -earFlap;
      earPivots[1].rotation.z = earFlap;
      tagPivot.rotation.x = Math.sin(elapsed * 8) * 0.22 + (jumpY > 0.1 ? 0.5 : 0);

      // Pasitos al girar
      if (t < 2.3) {
        const walk = Math.sin(elapsed * 12) * 0.24;
        legPivots[0].rotation.x = walk;
        legPivots[1].rotation.x = -walk;
        legPivots[2].rotation.x = -walk;
        legPivots[3].rotation.x = walk;
      } else {
        legPivots.forEach((lp) => {
          lp.rotation.x = THREE.MathUtils.lerp(lp.rotation.x, 0, 0.2);
        });
      }

      // Jadeo realista
      const pant = (Math.sin(elapsed * 10) + 1) * 0.5;
      bodyGroup.scale.set(1 + pant * 0.025, 1 + pant * 0.02, 1);
      jawPivot.rotation.x = 0.14 + pant * 0.3;
      tongue.scale.y = 0.95 + pant * 0.24;
      tailPivot.rotation.z = Math.sin(elapsed * 9) * 0.32;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      [tanMaps, whiteMaps, blackMaps].forEach((m) => {
        m.map.dispose();
        m.bumpMap.dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-3xl p-7 flex flex-col items-center justify-center gap-4 text-center">
      <div
        ref={mountRef}
        className="w-[290px] h-[225px] flex items-center justify-center"
        aria-label="Beagle 3D realista cargando"
      />

      <div className="w-full max-w-xs space-y-2">
        <p className="text-sm font-bold text-[#0c1b33]">{message}</p>
        <div className="w-full h-3 rounded-full bg-[#e0effe] overflow-hidden border border-[#bae0fd]/80">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#2c5ead] via-[#1591dc] to-[#4bb8fa]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
        <p className="text-[11px] font-medium text-slate-500">
          Verificando folio en clínica...
        </p>
      </div>
    </div>
  );
};

export default DogSpinnerLoader;
