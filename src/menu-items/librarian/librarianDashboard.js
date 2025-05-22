// assets
import { IconDashboard } from '@tabler/icons-react'

// constant
const icons = { IconDashboard }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const librarianDashboard = {
  id: 'librariandashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/librarian/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ],
}

export default librarianDashboard
