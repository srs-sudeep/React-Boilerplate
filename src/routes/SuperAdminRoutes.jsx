import lazyLoad from 'core/utils/lazyLoad'

// project imports
import MainLayout from 'layout/MainLayout'

// dashboard routing
const AdminDashboard = lazyLoad(
  () => import('views/pages/superAdmin/AdminDashboard'),
)
const Analytics = lazyLoad(() => import('views/pages/superAdmin/Analytics'))
const Profile = lazyLoad(() => import('views/pages/superAdmin/Profile'))
import { Navigate } from 'react-router-dom'

// ==============================|| MAIN ROUTING ||============================== //

const SuperAdminRoutes = [
  {
    path: '/superadmin',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/superadmin/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      },

      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]

export default SuperAdminRoutes
