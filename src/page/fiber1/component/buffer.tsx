/*
 * 处理自定义几何buffer
 */
import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';

const BufferModel = () => {
  const bufferRef = useRef<THREE.BufferGeometry>(null!);
  const vertexCount = 10 * 3;

  const position = useMemo(() => {
    const position = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertexCount; i++) {
      position[i] = (Math.random() - 0.5) * 3;
    }
    return position;
  }, []);
  // 计算法线
  useEffect(() => {
    bufferRef.current.computeVertexNormals();
  }, []);
  return (
    <>
      <mesh>
        <bufferGeometry ref={bufferRef}>
          <bufferAttribute
            attach="attributes-position"
            count={vertexCount}
            itemSize={3}
            array={position}
          />
        </bufferGeometry>
        <meshStandardMaterial color={'red'} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};

export default BufferModel;
