// assets
import { IconBook } from '@tabler/icons-react'

// constant
const icons = { IconBook }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const registerBooks = {
  id: 'registerBook',
  title: 'Add Books',
  type: 'group',
  children: [
    {
      id: 'registerBook',
      title: 'Add Books',
      type: 'item',
      url: '/librarian/registerBooks',
      icon: icons.IconBook,
      breadcrumbs: false,
    },
  ],
}

export default registerBooks
