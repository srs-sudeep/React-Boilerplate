// assets
import { IconBook } from '@tabler/icons-react'

// constant
const icons = { IconBook }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const registerBooks = {
  id: 'registerBooks',
  title: 'Add Books',
  type: 'group',
  children: [
    {
      id: 'registerBooks',
      title: 'Add Books',
      type: 'item',
      url: '/admin/registerBooks',
      icon: icons.IconBook,
      breadcrumbs: false,
    },
  ],
}

export default registerBooks
