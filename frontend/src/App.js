// src/routes/index.jsx
import { BrowserRouter, useRoutes } from 'react-router-dom';
import AppRoutes from './routers';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
