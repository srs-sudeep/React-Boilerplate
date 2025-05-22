// assets
import { IconDashboard } from '@tabler/icons-react'

// constant
const icons = { IconDashboard }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const studentDashboard = {
  id: 'studentdashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/student/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ],
}

export default studentDashboard
