// assets
import { IconChartBar, IconDashboard } from '@tabler/icons-react'

// constant
const icons = { IconDashboard, IconChartBar }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'admindashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/admin/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false,
    },
  ],
}

export default dashboard
