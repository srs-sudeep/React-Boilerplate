import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Button,
  TextField,
  Chip,
  Popover,
} from '@mui/material'
import { DateRangePicker } from 'react-date-range'
import { addDays } from 'date-fns'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import MainCard from 'ui-component/cards/MainCard'
import { getAllUsers, getIndiBook, sendReminder } from 'api'
import dayjs from 'dayjs'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

const IssuersList = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [bookDetails, setBookDetails] = useState({})
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  ])

  const [reminderSent, setReminderSent] = useState({}); // Track sent reminders

  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error.message)
    }
  }

  const fetchBookDetails = async (bookId) => {
    try {
      const book = await getIndiBook(bookId)
      setBookDetails((prevDetails) => ({
        ...prevDetails,
        [bookId]: book,
      }))
    } catch (error) {
      console.error('Error fetching book details:', error.message)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1
    if (b[orderBy] > a[orderBy]) return 1
    return 0
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  const sortedUsers = users.sort(getComparator(order, orderBy))

  const isWithinDateRange = (issueDate) => {
    const start = dateRange[0].startDate
    const end = dateRange[0].endDate
    if (!start || !end) return true
    const issueDateObject = dayjs(issueDate)
    return issueDateObject.isAfter(dayjs(start)) && issueDateObject.isBefore(dayjs(end))
  }

  const filteredUsers = sortedUsers.filter((user) => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    return (
      (user.name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm) ||
        bookDetails[user.books[0]?.bookId]?.name
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        '' ||
        bookDetails[user.books[0]?.bookId]?.author
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        '') &&
      user.books.some((issuedBook) => isWithinDateRange(issuedBook.issueDate))
    )
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

const renderRows = (user) => {
  const rows = [];
  // Helper function to calculate the difference in days between two dates
  const calculateDaysRemaining = (returnDate) => {
    const currentDate = new Date();
    const returnDateObj = new Date(returnDate);
    const timeDiff = returnDateObj.getTime() - currentDate.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert to days
    return dayDiff;
  };

  const handleSendReminder = (email, bookName, author, returnDate, bookId) => {
    if (!reminderSent[bookId]) {
      sendReminder(email, "Book Return Reminder", bookName, author, returnDate);
      // Mark the reminder as sent for this book
      setReminderSent((prev) => ({ ...prev, [bookId]: true }));
    }
  };

  user.books.forEach((issuedBook, index) => {
    if (!bookDetails[issuedBook.bookId]) {
      fetchBookDetails(issuedBook.bookId);
    }
    const book = bookDetails[issuedBook.bookId] || {};

    if (isWithinDateRange(issuedBook.issueDate)) {
      const daysRemaining = calculateDaysRemaining(issuedBook.returnDate);

      // Automatically send reminder if 3 days are remaining and it hasn't been sent yet
      if (daysRemaining === 3 && !reminderSent[issuedBook.bookId]) {
        handleSendReminder(user.email, book.name, book.author, issuedBook.returnDate, issuedBook.bookId);
      }

      rows.push(
        <TableRow
          key={`requested-${user.Id}-${index}`}
          hover
          style={{ cursor: 'pointer' }}>
          <TableCell>{user.Id}</TableCell>
          <TableCell>
            <img
              src={user.profile}
              alt="Profile"
              height={60}
              width={60}
              className="rounded-full"
            />
          </TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.phone}</TableCell>
          <TableCell>
            <img src={book.cover} alt="cover" height={40} width={40} />
          </TableCell>
          <TableCell>{book.name || 'Loading...'}</TableCell>
          <TableCell>{book.author || 'Loading...'}</TableCell>
          <TableCell>{formatDate(issuedBook.issueDate)}</TableCell>
        </TableRow>
      );
    }
  });

  return rows;
};

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleOpenCalendar = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseCalendar = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <MainCard title="Issuers List">
      <Paper>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TextField
            label="Search here..."
            variant="outlined"
            style={{ marginBottom: '10px' }}
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton aria-describedby={id} onClick={handleOpenCalendar}>
            <CalendarMonthIcon />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseCalendar}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}>
            <DateRangePicker
              ranges={dateRange}
              onChange={(item) => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              editableDateInputs={true}
              months={2}
              direction="horizontal"
            />
          </Popover>
        </div>
        <Chip
          label={`${dateRange[0].startDate ? dayjs(dateRange[0].startDate).format('MMM D, YYYY') : 'Start'} - ${
            dateRange[0].endDate ? dayjs(dateRange[0].endDate).format('MMM D, YYYY') : 'End'
          }`}
          onDelete={() => setDateRange([{ startDate: null, endDate: null, key: 'selection' }])}
          sx={{
            marginRight: '8px',
            marginBottom: '8px',
            backgroundColor: '#e0e0e0',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
            },
            '& .MuiChip-deleteIcon': {
              color: '#888',
              '&:hover': {
                color: 'white',
              },
            },
          }}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Number</TableCell>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell></TableCell>
                <TableCell>Book Name</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Issue Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .filter((user) => user.role === 'student')
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => renderRows(user))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </MainCard>
  )
}

export default IssuersList
