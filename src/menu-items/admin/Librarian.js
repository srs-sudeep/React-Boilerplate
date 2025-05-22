// assets
import { IconCopyPlus, IconListDetails } from '@tabler/icons-react'

// constant
const icons = { IconCopyPlus, IconListDetails }

// ==============================|| STUDENT DASHBOARD MENU ITEMS ||============================== //

const Librarian = {
  id: 'Librarian',
  title: 'Librarian',
  type: 'group',
  children: [
    {
      id: 'createLibrarian',
      title: 'Create Librarian',
      type: 'item',
      url: '/admin/createLibrarian',
      icon: icons.IconCopyPlus,
      breadcrumbs: false,
    },
    {
      id: 'list',
      title: 'Librarian List',
      type: 'item',
      url: '/admin/librarianList',
      icon: icons.IconListDetails,
    },
  ],
}

export default Librarian
