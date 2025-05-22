// assets
import { IconChartDots3 } from '@tabler/icons-react'

// constant
const icons = { IconChartDots3 }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const timeline = {
  id: 'timeline',
  title: 'Timeline',
  type: 'group',
  children: [
    {
      id: 'timeline',
      title: 'Timeline',
      type: 'item',
      url: '/librarian/timeline',
      icon: icons.IconChartDots3,
      breadcrumbs: false,
    },
  ],
}

export default timeline
