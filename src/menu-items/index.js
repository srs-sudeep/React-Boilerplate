import adminProfile from './superadmin/adminProfile'
import dashboard from './superadmin/dashboard'

// ==============================|| MENU ITEMS ||============================== //

const menuItems = (role) => {
  switch (role) {
    case 'superadmin':
      return {
        items: [dashboard, adminProfile],
      }
  }
}

export default menuItems
