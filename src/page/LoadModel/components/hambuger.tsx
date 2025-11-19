import { Clone, useGLTF } from '@react-three/drei';

const HamBuger = (props: any) => {
  const { scene } = useGLTF('/models/ham.glb');
  return (
    <>
      <Clone object={scene} {...props} position={[-2, 0, 0]} />
      {/* <Clone object={scene} {...props} position={[-2, 0, -2]} />
      <Clone object={scene} {...props} position={[2, 0, -0]} />
      <Clone object={scene} {...props} position={[0.2, 0, -2]} />
      <Clone object={scene} {...props} position={[2.4, 0, -2]} /> */}
    </>
  );
};
useGLTF.preload('/models/ham.glb');
export default HamBuger;
