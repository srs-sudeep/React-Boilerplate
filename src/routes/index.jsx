import useAuthValidation from 'core/Private/Private'
import { useRoutes } from 'react-router-dom'
import AdminRoutes from './AdminRoutes'
import commonRoutes from './commonRoutes'
import LibrarianRoutes from './LibrarianRoutes'
import StudentRoutes from './StudentRoutes'

export default function Router() {
  useAuthValidation()
  const routes = useRoutes([
    ...AdminRoutes,
    ...commonRoutes,
    ...LibrarianRoutes,
    ...StudentRoutes,
  ])

  return routes
}
