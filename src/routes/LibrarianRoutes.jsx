import lazyLoad from 'core/utils/lazyLoad'

// project imports
import MainLayout from 'layout/MainLayout'

// dashboard routing
const Dashboard = lazyLoad(
  () => import('views/Dashboard'),
)
const StudentsList = lazyLoad(() => import('views/pages/librarian/StudentsList'))
const RequestsList = lazyLoad(() => import('views/pages/librarian/RequestsList'))
const IssuersList = lazyLoad(() => import('views/pages/librarian/IssuersList'))
const Timeline = lazyLoad(() => import('views/pages/librarian/Timeline'))
const Profile = lazyLoad(() => import('views/profile'))
const IndiBook = lazyLoad(() => import('views/pages/librarian/IndiBook'))
const RegisterBooks = lazyLoad(() => import('views/pages/librarian/RegisterBooks'))
import { Navigate } from 'react-router-dom'

// ==============================|| MAIN ROUTING ||============================== //

const LibrarianRoutes = [
  {
    path: '/librarian',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/librarian/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'students',
        element: <StudentsList />,
      },
      {
        path: 'requests',
        element: <RequestsList />,
      },
      {
        path: 'issuers',
        element: <IssuersList />,
      },
      {
        path: 'timeline',
        element: <Timeline />,
      },
      {
        path: 'registerBooks',
        element: <RegisterBooks />,
      },
      {
        path: 'book/:id',
        element: <IndiBook />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]

export default LibrarianRoutes
