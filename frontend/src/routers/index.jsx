import { useRoutes } from 'react-router-dom';
import routes from './route';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

export default AppRoutes;
