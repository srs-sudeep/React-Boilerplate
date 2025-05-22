// assets
import { IconChartDots3 } from '@tabler/icons-react'

// constant
const icons = { IconChartDots3 }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const timeline = {
  id: 'timelineAdmin',
  title: 'Timeline',
  type: 'group',
  children: [
    {
      id: 'timelineAdmin',
      title: 'Timeline',
      type: 'item',
      url: '/admin/timeline',
      icon: icons.IconChartDots3,
      breadcrumbs: false,
    },
  ],
}

export default timeline
