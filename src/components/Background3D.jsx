import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Scene({ paused }) {
  const points = useRef();
  const group = useRef();
  const { camera } = useThree();
  const portfolioScroll = useRef(0);
  
  useEffect(() => {
    const handlePortfolioScroll = (e) => {
      portfolioScroll.current = e.detail.progress;
    };
    window.addEventListener('portfolio-scroll', handlePortfolioScroll);
    return () => window.removeEventListener('portfolio-scroll', handlePortfolioScroll);
  }, []);

  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  const materialRef = useRef();
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (paused) return;
    const time = state.clock.elapsedTime;
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const windowScrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;
    
    const combinedProgress = windowScrollProgress + portfolioScroll.current;

    const targetZ = 8 - (combinedProgress * 4);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    
    const targetX = mousePos.current.x * 1.5;
    const targetY = mousePos.current.y * 1.5;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.02);
    camera.lookAt(0, 0, 0);

    if (group.current) {
        group.current.rotation.y = time * 0.02 + combinedProgress * 0.3;
    }

    if (materialRef.current) {
        const primaryAccent = new THREE.Color('#ccff00');
        const secondaryAccent = new THREE.Color('#6366f1');
        
        if (combinedProgress > 0.5) {
            materialRef.current.color.lerp(secondaryAccent, 0.05);
        } else {
            materialRef.current.color.lerp(primaryAccent, 0.05);
        }
    }
  });

  const shardData = useMemo(() => {
    return [...Array(15)].map(() => ({
      position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      size: Math.random() * 0.8 + 0.2,
      type: Math.random() > 0.5 ? 'octa' : 'icosa'
    }));
  }, []);

  return (
    <group ref={group}>
      <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          ref={materialRef}
          transparent
          color="#ccff00"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
          opacity={0.3}
        />
      </Points>
      
      {shardData.map((data, i) => (
        <mesh key={i} position={data.position} rotation={data.rotation}>
          {data.type === 'octa' ? (
            <octahedronGeometry args={[data.size, 0]} />
          ) : (
            <icosahedronGeometry args={[data.size, 0]} />
          )}
          <meshBasicMaterial 
            color="#ccff00" 
            wireframe 
            transparent 
            opacity={0.1} 
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Background3D({ paused }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
      >
        <React.Suspense fallback={null}>
          <fog attach="fog" args={['#0a0a0b', 2, 15]} />
          <Scene paused={paused} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
