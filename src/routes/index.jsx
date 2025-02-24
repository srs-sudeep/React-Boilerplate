import useAuthValidation from 'core/Private/Private'
import { useRoutes } from 'react-router-dom'
import SuperAdminRoutes from './SuperAdminRoutes'
import commonRoutes from './commonRoutes'

export default function Router() {
  useAuthValidation()
  const routes = useRoutes([
    ...SuperAdminRoutes,
    ...commonRoutes,
  ])

  return routes
}
