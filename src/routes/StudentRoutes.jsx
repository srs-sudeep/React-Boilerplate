import lazyLoad from 'core/utils/lazyLoad'

// project imports
import MainLayout from 'layout/MainLayout'


const Profile = lazyLoad(() => import('views/profile'))
import { Navigate } from 'react-router-dom'
const Dashboard = lazyLoad(() => import('views/dashboard'))
const IndiBook = lazyLoad(() => import('views/pages/librarian/IndiBook'))
const Wishlist = lazyLoad(() => import('views/pages/student/wishlist'))

// ==============================|| MAIN ROUTING ||============================== //

const StudentRoutes = [
  {
    path: '/student',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/student/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },

      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'wishlist',
        element: <Wishlist />,
      },
      {
        path: 'book/:id',
        element: <IndiBook />,
      },
    ],
  },
]

export default StudentRoutes
