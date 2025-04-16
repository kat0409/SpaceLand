import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars, Html, Environment } from '@react-three/drei';

// Cloud Storage URLs for the models
const ROLLER_COASTER_URL = 'https://storage.googleapis.com/3dmodels1/roller_coaster.glb';
const FERRIS_WHEEL_URL = 'https://storage.googleapis.com/3dmodels1/carnival_ferris_wheel.glb';
const DROP_TOWER_URL = 'https://storage.googleapis.com/3dmodels1/drop_tower.glb';
const GALAXY_COASTER_URL = 'https://storage.googleapis.com/3dmodels1/swing_ride.glb';

// Preload models to avoid flickering during transitions
useGLTF.preload(ROLLER_COASTER_URL);
useGLTF.preload(FERRIS_WHEEL_URL);
useGLTF.preload(DROP_TOWER_URL);
useGLTF.preload(GALAXY_COASTER_URL);

function RideModel({ rideType, position = [0, -1, 0], rotation = [0, Math.PI / 4, 0], scale = 0.05 }) {
  // Choose the right model based on ride type
  const modelPath = 
    rideType === 'Lunar Loop' ? FERRIS_WHEEL_URL :
    rideType === 'Black Hole Drop' ? DROP_TOWER_URL :
    rideType === 'Astro Twister' ? ROLLER_COASTER_URL :
    rideType === 'Galaxy Coaster' ? GALAXY_COASTER_URL :
    ROLLER_COASTER_URL; // Default fallback
    
  const { scene } = useGLTF(modelPath);
  
  useEffect(() => {
    // Apply material adjustments to make the model more visible
    scene.traverse((child) => {
      if (child.isMesh) {
        // Increase emissive properties for better visibility
        if (child.material) {
          // Different emissive colors based on ride type
          if (rideType === 'Lunar Loop') {
            child.material.emissive = { r: 0.1, g: 0.2, b: 0.3 };
            child.material.emissiveIntensity = 0.6;
          } else if (rideType === 'Black Hole Drop') {
            child.material.emissive = { r: 0.3, g: 0.1, b: 0.3 };
            child.material.emissiveIntensity = 0.7;
          } else if (rideType === 'Galaxy Coaster') {
            child.material.emissive = { r: 0.2, g: 0.3, b: 0.1 };
            child.material.emissiveIntensity = 0.8;
            child.material.metalness = 0.9;
          } else {
            child.material.emissive = { r: 0.2, g: 0.1, b: 0 };
            child.material.emissiveIntensity = 0.5;
          }
          // Increase metalness for better reflections
          child.material.metalness = 0.8;
          // Increase roughness for more diffuse light reflection
          child.material.roughness = 0.2;
        }
      }
    });
  }, [scene, rideType]);
  
  // Different configurations based on ride type
  const getPosition = () => {
    switch(rideType) {
      case 'Lunar Loop':
        return [0, -0.25, 0]; // Adjust Ferris wheel position
      case 'Black Hole Drop':
        return [0, 0, 0]; // Adjust Drop Tower position
      case 'Astro Twister':
        return [0, -0.1, 0.2];
      case 'Galaxy Coaster':
        return [0, -0.1, 0]; // Adjust Swing ride position
      default:
        return position;
    }
  };
  
  const getRotation = () => {
    switch(rideType) {
      case 'Lunar Loop':
        return [0, 0, 0]; // Reset rotation for Ferris wheel
      case 'Black Hole Drop':
        return [0, 0, 0]; // Reset rotation for Drop Tower
      case 'Astro Twister':
        return [0, Math.PI * 1.75, 0];
      case 'Galaxy Coaster':
        return [0, Math.PI / 2, 0]; // Rotate Swing ride for better viewing
      default:
        return rotation;
    }
  };
  
  const getScale = () => {
    switch(rideType) {
      case 'Lunar Loop':
        return 0.025; // Adjust scale for Ferris wheel
      case 'Black Hole Drop':
        return 0.035; // Adjust scale for Drop Tower
      case 'Astro Twister':
        return 0.055;
      case 'Galaxy Coaster':
        return 0.04; // Adjust scale for Swing ride
      default:
        return scale;
    }
  };
  
  return (
    <primitive 
      object={scene} 
      scale={getScale()} 
      position={getPosition()} 
      rotation={getRotation()} 
    />
  );
}

export default function RideModelViewer({ rideType = 'Galaxy Coaster' }) {
  const [loading, setLoading] = useState(true);
  
  // Reset loading state when ride changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [rideType]);
  
  return (
    <div className="h-96 w-full bg-black rounded-xl overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
        🔄 Click and drag to rotate • 🖱️ Scroll to zoom
      </div>
      
      <Canvas shadows camera={{ position: [5, 3, 5], fov: 50 }}>
        <color attach="background" args={['#050520']} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={2} 
          castShadow 
          shadow-mapSize={1024} 
          color={rideType === 'Lunar Loop' ? "#4d88ff" : "#ff9900"}
        />
        <spotLight 
          position={[-5, 8, -5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1.5} 
          castShadow 
          color={rideType === 'Lunar Loop' ? "#00ccff" : "#9900ff"}
        />
        <pointLight position={[0, 3, 0]} intensity={1} color={rideType === 'Lunar Loop' ? "#ffffff" : "#00ccff"} />
        
        <Suspense fallback={<Html><div className="text-white">Loading 3D model...</div></Html>}>
          <RideModel rideType={rideType} onLoad={() => setLoading(false)} />
          <Environment preset={rideType === 'Lunar Loop' ? "dawn" : "night"} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 6}
          autoRotate
          autoRotateSpeed={rideType === 'Lunar Loop' ? 1.5 : 0.5}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-purple-400 animate-pulse">Loading your cosmic experience...</div>
        </div>
      )}
    </div>
  );
}