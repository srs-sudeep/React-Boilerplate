// assets
import { IconUser } from '@tabler/icons-react'

// constant
const icons = { IconUser }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const librarianProfile = {
  id: 'librarianProfile',
  title: 'Profile',
  type: 'group',
  children: [
    {
      id: 'librarian Profile',
      title: 'Profile',
      type: 'item',
      url: '/librarian/profile',
      icon: icons.IconUser,
      breadcrumbs: false,
    },
  ],
}

export default librarianProfile
