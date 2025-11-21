import React from 'react';
import ReactDom from 'react-dom/client';
import { RouterProvider } from 'react-router';
import router from '@/router/index';
import '@/style/index.scss';
const Root = document.getElementById('root') as HTMLDivElement;
console.log(Root);

ReactDom.createRoot(Root).render(<RouterProvider router={router} />);
