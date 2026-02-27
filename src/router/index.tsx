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
import R3f from '@/page/r3f/index';
import R3fGame1 from '@/page/r3f-game1';
import R3fGame2 from '@/page/r3f-game2';
import R3fGame3 from '@/page/r3f-game3';
import EcctrlExample from '@/page/EcctrlExample/index';
import R3fGame4 from '@/page/r3f-game4';
import Wass01 from '@/page/Wass';
import Weixue from '@/page/weixue-demo';
import Wass02 from '@/page/Wass-02';
import Wass03 from '@/page/Wass-03';
import CloudDemo from '@/page/Clouds-demo';
import Wass04 from '@/page/Wass-04';
import Wass05 from '@/page/Wass-05';
import Shui from '@/page/Shui';
const loaderData = (): any => {
  console.log('我是数据');
};

const router = createBrowserRouter([
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
        Component: PhysicsExample,
        name: '物体下落',
      },
      { path: 'game', Component: gameExample, name: '影子展示' },
      { path: 'end', Component: JourneyGame },
      {
        path: 'ecctrl',
        Component: EcctrlExample,
      },
      {
        path: 'r3f',
        Component: R3f,
        children: [
          {
            path: 'game1',
            Component: R3fGame1,
          },
          { path: 'game2', Component: R3fGame2 },
          { path: 'game3', Component: R3fGame3 },
          { path: 'game4', Component: R3fGame4 },
        ],
      },
      {
        path: '/wass-01',
        Component: Wass01,
      },
      {
        path: '/wass-02',
        Component: Wass02,
      },
      {
        path: '/weixue',
        Component: Weixue,
      },
      {
        path: '/wass-03',
        Component: Wass03,
      },
      {
        path: '/wass-04',
        Component: Wass04,
      },
      {
        path: '/clouds',
        Component: CloudDemo,
      },
      {
        path: '/wass-05',
        Component: Wass05,
      },
      {
        path: 'shui',
        Component: Shui,
      },
    ],
  },
]);

export default router;
