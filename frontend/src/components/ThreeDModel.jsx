import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function MovingModel() {
  const { scene } = useGLTF("/models/scene.gltf");
  const ref = useRef();

  const direction = useRef({
    x: (Math.random() - 0.5) * 0.01,
    y: (Math.random() - 0.5) * 0.01,
    z: (Math.random() - 0.5) * 0.01,
  });

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += direction.current.x;
    ref.current.position.y += direction.current.y;
    ref.current.position.z += direction.current.z;

    ["x", "y", "z"].forEach((axis) => {
      if (Math.abs(ref.current.position[axis]) > 0.5) direction.current[axis] *= -1;
    });

    ref.current.rotation.y += 0.005;
  });

  // Move the model slightly down by changing position.y
  return <primitive ref={ref} object={scene} scale={0.6} position={[0, -0.5, 0]} />;
}

export default function ThreeDModel() {
  return (
    <Canvas
      style={{
        width: "100%",
        height: "100vh", // keep full viewport height
      }}
      camera={{ position: [0, 0, 3] }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 3, 3]} />
      <MovingModel />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
