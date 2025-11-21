import { Suspense } from 'react';
import { Outlet } from 'react-router';

const App = () => {
  return (
    <>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default App;
