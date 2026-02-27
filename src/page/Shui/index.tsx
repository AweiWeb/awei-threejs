import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { div } from 'three/webgpu';

const Shui = () => {
  return (
    <div className="shui" style={{ width: '20vw', height: '30vh' }}>
      <DotLottieReact
        src="https://lottie.host/27801872-5075-4032-9c73-0cf7e592f7a4/SBZ62kD3Gi.lottie"
        loop
        autoplay
      />
    </div>
  );
};

export default Shui;
