import { Suspense } from 'react';
import ComputedModle from './model';
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  PresentationControls,
} from '@react-three/drei';

const Fun = () => {
  return (
    <>
      <Environment preset="city" />
      <color attach="background" args={['ivory']} />
      {/* <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh> */}
      <Suspense>
        <PresentationControls
          rotation={[0.1, 0.1, 0]}
          global
          polar={[-0.4, 0.2]}
          azimuth={[-0.5, 0.5]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
        >
          <Float floatIntensity={0.5}>
            <rectAreaLight
              intensity={60}
              width={1.5}
              height={5}
              rotation={[-0.1, Math.PI, 0]}
              position={[0, 0.5, -1.5]}
            />
            <ComputedModle />
          </Float>
        </PresentationControls>
        <ContactShadows position-y={-1.2} scale={5} opacity={0.3} blur={2} />
      </Suspense>
    </>
  );
};

export default Fun;
