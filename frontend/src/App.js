// src/routes/index.jsx
import { BrowserRouter, useRoutes } from 'react-router-dom';
import AppRoutes from './routers';

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
