import { createBrowserRouter } from 'react-router';
import App from '@/App.tsx';
import Fiber1 from '@/page/fiber1/index';
import Fiber2 from '@/page/drei/index';
import Fiber3 from '@/page/debug/index';
import EnvExample from '@/page/env-shadow/index';
import LoadModel from '@/page/LoadModel/index';
import TextDebug from '@/page/Text/index';
import GlslExample from '@/page/glsl/index';
import MouseEventPage from '@/page/MouseEvent/index';
import ProcessingExample from '@/page/procssing/index';
import FunExample from '@/page/FunExample/index';
import PhysicsExample from '@/page/Physics/index';
import gameExample from '@/page/gameExample/index';
import JourneyGame from '@/page/awei-study-Game/index';
import R3f from '@/page/r3f';
import R3fGame1 from '@/page/r3f-game1';

const loaderData = (): any => {
  console.log('我是数据');
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, Component: Fiber1 },
        { path: 'fiber1', Component: Fiber1 },
        { path: 'fiber2', Component: Fiber2 },
        { path: 'fiber3', Component: Fiber3 },
        { path: 'env', Component: EnvExample },
        { path: 'model', Component: LoadModel },
        { path: 'text', Component: TextDebug },
        { path: 'glsl', Component: GlslExample },
        { path: 'event', Component: MouseEventPage },
        { path: 'processing', Component: ProcessingExample },
        { path: 'fun', Component: FunExample },
        {
          path: 'phy',
          lazy: async () => {
            console.log('lazy');
            const model = await import('@/page/Physics/index');
            console.log(model.default);

            return { Component: model.default };
          },
          hydrateFallbackElement: <div>Loading Physics...</div>, //异步加载显示组件
        },
        { path: 'game', Component: gameExample },
        { path: 'end', Component: JourneyGame },
        {
          path: 'r3f',
          Component: R3f,
          loader: loaderData,
          children: [
            {
              path: 'game1',
              Component: R3fGame1,
            },
          ],
        },
      ],
    },
  ],
  {
    future: {
      unstable_middleware: true, //开启中间件
    },
  }
);

export default router;
