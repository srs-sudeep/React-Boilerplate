// assets
import { IconUser } from '@tabler/icons-react'

// constant
const icons = { IconUser }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const adminProfile = {
  id: 'adminProfile',
  title: 'Profile',
  type: 'group',
  children: [
    {
      id: 'admin Profile',
      title: 'Profile',
      type: 'item',
      url: '/admin/profile',
      icon: icons.IconUser,
      breadcrumbs: false,
    },
  ],
}

export default adminProfile
