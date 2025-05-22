import adminProfile from './admin/adminProfile'
import Librarian from './admin/Librarian'
import registerBooks from './admin/registerBooks'
import registerBook from './librarian/registerBooks'
import dashboard from './admin/dashboard'
import librarianDashboard from './librarian/librarianDashboard'
import librarianProfile from './librarian/librarianProfile'
import studentProfile from './student/studentProfile'
import studentDashboard from './student/studentDashboard'
import lists from './librarian/lists'
import timeline from './librarian/timeline'
import timelineAdmin from './admin/timeline'

// ==============================|| MENU ITEMS ||============================== //

const menuItems = (role) => {
  switch (role) {
    case 'admin':
      return {
        items: [
          dashboard,
          timelineAdmin,
          Librarian,
          registerBooks,
          adminProfile,
        ],
      }
    case 'librarian':
      return {
        items: [
          librarianDashboard,
          timeline,
          lists,
          registerBook,
          librarianProfile,
        ],
      }
    case 'student':
      return {
        items: [studentDashboard, studentProfile],
      }
  }
}

export default menuItems
