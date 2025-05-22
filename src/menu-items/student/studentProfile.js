// assets
import { IconBookmark, IconUser } from '@tabler/icons-react'

// constant
const icons = { IconUser, IconBookmark }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const studentProfile = {
  id: 'studentProfile',
  title: 'Profile',
  type: 'group',
  children: [
    {
      id: 'student Profile',
      title: 'Profile',
      type: 'item',
      url: '/student/profile',
      icon: icons.IconUser,
      breadcrumbs: false,
    },
    {
      id: 'student Wishlist',
      title: 'Wishlist',
      type: 'item',
      url: '/student/wishlist',
      icon: icons.IconBookmark,
      breadcrumbs: false,
    },
  ],
}

export default studentProfile
