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
  MenuItem,
  Menu,
  Button,
  TextField,
  Chip,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import MainCard from 'ui-component/cards/MainCard'
import { getAllUsers, getIndiBook, updateBook, sendMail } from 'api'

const RequestsList = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookDetails, setBookDetails] = useState({})
  const [filterType, setFilterType] = useState('None') // New state for request type filter
  const [anchorEl, setAnchorEl] = useState(null) // For dropdown menu

  useEffect(() => {
    const fetchDataContinuously = () => {
      fetchData()

      // Set timeout for the next fetch in 5 seconds (5000 ms)
      const timeoutId = setTimeout(fetchDataContinuously, 5000)

      // Cleanup the timeout when the component unmounts
      return () => clearTimeout(timeoutId)
    }

    fetchDataContinuously()

    // Cleanup function to avoid memory leaks
    return () => {
      clearTimeout(fetchDataContinuously)
    }
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

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = (event) => {
    setAnchorEl(null)
    const selectedFilter = event.target.getAttribute('data-value')
    if (selectedFilter) {
      setFilterType(selectedFilter)
      setPage(0)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const filteredUsers = users.filter((user) => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm) ||
      bookDetails[user.requestedBooks[0]?.bookId]?.name
        .toLowerCase()
        .includes(lowerSearchTerm) ||
      '' ||
      bookDetails[user.requestedBooks[0]?.bookId]?.author
        .toLowerCase()
        .includes(lowerSearchTerm) ||
      ''
    )
  })

  const handleClick = async (status, bookId, userId, userEmail) => {
    try {
      const bookData = {
        status,
        userId,
        ...(status === 'issue'
          ? { issueDate: new Date().toISOString() }
          : { returnDate: new Date().toISOString() }),
      }

      await updateBook(bookId, bookData)
      fetchData()

      const book = await getIndiBook(bookId)
      const { name, author } = book

      const emailSubject = `Book ${status === 'issue' ? 'Issued' : 'Returned'}`

      // Send email to the user
      sendMail(userEmail, emailSubject, status, name, author)
    } catch (error) {
      console.error('Error updating book:', error.message)
    }
  }

  const renderRows = (user) => {
    const rows = []

    if (filterType === 'Issue' || filterType === 'None') {
      user.requestedBooks.forEach((requestedBook, index) => {
        if (!bookDetails[requestedBook.bookId]) {
          fetchBookDetails(requestedBook.bookId)
        }
        const book = bookDetails[requestedBook.bookId] || {}

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
            <TableCell>{book.count || 0}</TableCell>
            <TableCell>
              <Button
                onClick={() =>
                  handleClick(
                    'issue',
                    requestedBook.bookId,
                    user.id,
                    user.email,
                  )
                }
                variant="contained"
                color="success">
                Issue
              </Button>
            </TableCell>
          </TableRow>,
        )
      })
    }

    if (filterType === 'Return' || filterType === 'None') {
      user.returnedBooks.forEach((returnedBook, index) => {
        if (!bookDetails[returnedBook.bookId]) {
          fetchBookDetails(returnedBook.bookId)
        }
        const book = bookDetails[returnedBook.bookId] || {}

        rows.push(
          <TableRow
            key={`returned-${user.Id}-${index}`}
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
            <TableCell>{book.count || 0}</TableCell>
            <TableCell>
              <Button
                onClick={() =>
                  handleClick(
                    'return',
                    returnedBook.bookId,
                    user.id,
                    user.email,
                  )
                }
                variant="contained"
                color="error">
                Return
              </Button>
            </TableCell>
          </TableRow>,
        )
      })
    }

    return rows
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleFilterDelete = () => {
    setFilterType('None')
  }

  useEffect(() => {
    // Check if there are any rows and update localStorage
    const hasRequests = users.some((user) => {
      const hasRequestedBooks = user.requestedBooks.length > 0
      const hasReturnedBooks = user.returnedBooks.length > 0
      return hasRequestedBooks || hasReturnedBooks
    })

    localStorage.setItem('request', hasRequests ? 'true' : 'false')
  }, [users, bookDetails])

  return (
    <MainCard title="Requests List">
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
          <IconButton onClick={handleFilterClick}>
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}>
            <MenuItem data-value="None" onClick={handleFilterClose}>
              None
            </MenuItem>
            <MenuItem data-value="Issue" onClick={handleFilterClose}>
              Issue
            </MenuItem>
            <MenuItem data-value="Return" onClick={handleFilterClose}>
              Return
            </MenuItem>
          </Menu>
        </div>
        {filterType !== 'None' && (
          <Chip
            label={filterType}
            onDelete={() => handleFilterDelete()}
            sx={{
              marginRight: '8px',
              marginBottom: '8px',
              backgroundColor: '#e0e0e0', // Initial background
              '&:hover': {
                backgroundColor: '#d4d4d4', // Background on hover
              },
            }}
          />
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell></TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Available Count</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .flatMap(renderRows)}
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

export default RequestsList
