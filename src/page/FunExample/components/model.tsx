import { Html, useGLTF } from '@react-three/drei';

const ComputedModle = () => {
  const model = useGLTF(
    '/models/macbook.gltf'
  );
  return (
    <primitive position-y={-1.3} object={model.scene}>
      <Html
        transform
        wrapperClass="htmlScreen"
        distanceFactor={1.2}
        position={[0, 1.56, -1.4]}
        rotation-x={-0.24}
      >
        <iframe src="https://codesandbox.io/p/sandbox/vkgi6?file=%2Fsrc%2FApp.js%3A30%2C12-30%2C17" />
      </Html>
    </primitive>
  );
};
useGLTF.preload(
  'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf'
);

export default ComputedModle;
