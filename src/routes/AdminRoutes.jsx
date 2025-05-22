import lazyLoad from 'core/utils/lazyLoad'

// project imports
import MainLayout from 'layout/MainLayout'

// dashboard routing
const Dashboard = lazyLoad(
  () => import('views/Dashboard'),
)
const CreateLibrarian = lazyLoad(() => import('views/pages/admin/CreateLibrarian'))
const LibrarianList = lazyLoad(() => import('views/pages/admin/LibrarianList'))
const RegisterBooks = lazyLoad(() => import('views/pages/admin/RegisterBooks'))
const Timeline = lazyLoad(() => import('views/pages/admin/Timeline'))
const Profile = lazyLoad(() => import('views/profile'))
const IndiBook = lazyLoad(() => import('views/pages/librarian/IndiBook'))
import { Navigate } from 'react-router-dom'

// ==============================|| MAIN ROUTING ||============================== //

const AdminRoutes = [
  {
    path: '/admin',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="/admin/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'book/:id',
        element: <IndiBook />,
      },
      {
        path: 'timeline',
        element: <Timeline />,
      },
      {
        path: 'createLibrarian',
        element: <CreateLibrarian />,
      },
      {
        path: 'librarianList',
        element: <LibrarianList />,
      },
      {
        path: 'registerBooks',
        element: <RegisterBooks/>,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]

export default AdminRoutes
