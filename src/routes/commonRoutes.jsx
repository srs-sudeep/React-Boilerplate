import { Navigate } from 'react-router-dom'
import Page404 from 'views/pages/Page404'
import Login from 'views/pages/authentication/Login'
import Signup from 'views/pages/authentication/Signup'

const commonRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]

export default commonRoutes
