// assets
import {
  IconCirclesRelation,
  IconMessage2Question,
  IconSchool,
} from '@tabler/icons-react'

// constant
const icons = { IconCirclesRelation, IconSchool, IconMessage2Question }

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const lists = {
  id: 'lists',
  title: 'Lists',
  type: 'group',
  children: [
    {
      id: 'studentList',
      title: 'Students',
      type: 'item',
      url: '/librarian/students',
      icon: icons.IconSchool,
      breadcrumbs: false,
    },
    {
      id: 'requestList',
      title: 'Requests',
      type: 'item',
      url: '/librarian/requests',
      icon: icons.IconMessage2Question,
      breadcrumbs: false,
    },
    {
      id: 'issuerList',
      title: 'Issuers',
      type: 'item',
      url: '/librarian/issuers',
      icon: icons.IconCirclesRelation,
      breadcrumbs: false,
    },
  ],
}

export default lists
