import { useGLTF } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader, DRACOLoader } from 'three/examples/jsm/Addons.js';

const Model = () => {
  const { scene } = useLoader(
    GLTFLoader,
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      loader.setDRACOLoader(dracoLoader);
    },
    // (xhr) => {
    //   console.log(xhr.loaded / xhr.total);
    // }
  );
  console.log(scene);

  return <primitive position={[2, 0, 0]} scale={3} object={scene} />;
};

export default Model;
