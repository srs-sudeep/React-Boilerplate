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
  TextField,
  TableSortLabel,
  Chip,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import MainCard from 'ui-component/cards/MainCard'
import { getIndiUser, getIndiBook, addtowhishlist } from 'api' // Fetch users and books data
import { Cancel, CheckCircle } from '@mui/icons-material'
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'

const Wishlist = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([]) // State for books
  const [page, setPage] = useState(0)
  const [wishlistBooks, setWishlistBooks] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('title') // Default sorting by title
  const [anchorEl, setAnchorEl] = useState(null) // For opening the filter menu
const [filterType, setFilterType] = useState('None') // Store the current filter type

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const userData = await getIndiUser(localStorage.getItem('id'))
      setUsers([userData]) // Setting the user data

      const wishlist = userData.whishlist
      const bookPromises = wishlist.map((wishlistItem) =>
        getIndiBook(wishlistItem.bookId),
      ) // Access bookId in the wishlist
      const bookData = await Promise.all(bookPromises)
      setBooks(bookData) // Setting the book data
      userData.whishlist.map((book) =>
        setWishlistBooks((prevState) => [...prevState, book.bookId]),
      )
    } catch (error) {
      console.error('Error fetching data:', error.message)
    }
  }

  // Function to add/remove a book from the wishlist
  const handleWishlist = async (bookId) => {
    try {
      const isWishlisted = wishlistBooks.includes(bookId)
      if (isWishlisted) {
        setWishlistBooks(wishlistBooks.filter((id) => id !== bookId)) // Remove from wishlist
      } else {
        setWishlistBooks([...wishlistBooks, bookId]) // Add to wishlist
      }
      const body = {
        bookId: bookId,
        status: isWishlisted ? 'remove' : 'add',
      }
      await addtowhishlist(localStorage.getItem('id'), body)
      fetchData() // Refresh the data to update wishlist
    } catch (error) {
      console.error('Error updating wishlist:', error.message)
    }
    if (isWishlisted) {
      setWishlistBooks((prevState) => [...prevState, bookId]) // Re-add to wishlist in case of error
    } else {
      setWishlistBooks((prevState) => prevState.filter((id) => id !== bookId)) // Remove again in case of error
    }
  }

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget) // Set anchor element for the menu
  }
  
  const handleFilterClose = (event) => {
    const value = event.target.getAttribute('data-value')
    if (value) {
      setFilterType(value) // Set the selected filter type
    }
    setAnchorEl(null) // Close the filter menu
  }
  
  const handleFilterDelete = () => {
    setFilterType('None') // Clear the filter when chip is deleted
  }
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
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

  const sortedBooks = books.sort(getComparator(order, orderBy))

  const filteredBooks = sortedBooks.filter((book) => {
    const lowerSearchTerm = searchTerm.toLowerCase()
  
    // Apply search term filter
    const matchesSearch =
      book.name.toLowerCase().includes(lowerSearchTerm) ||
      book.author.toLowerCase().includes(lowerSearchTerm)
  
    // Apply availability filter
    const matchesFilter =
      filterType === 'None' ||
      (filterType === 'Available' && book.count > 0) ||
      (filterType === 'Not Available' && book.count === 0)
  
    return matchesSearch && matchesFilter
  })
  

  return (
    <MainCard title="Wishlist Books">
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
            <MenuItem data-value="Available" onClick={handleFilterClose}>
              Available
            </MenuItem>
            <MenuItem data-value="Not Available" onClick={handleFilterClose}>
              Not Available
            </MenuItem>
          </Menu>
        </div>
        {filterType !== 'None' && <Chip
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
        />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel>S.No.</TableSortLabel>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleRequestSort('title')}>
                    Book Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'author'}
                    direction={orderBy === 'author' ? order : 'asc'}
                    onClick={() => handleRequestSort('author')}>
                    Author
                  </TableSortLabel>
                </TableCell>
                <TableCell>Availability</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((book, index) => (
                  <TableRow key={index} hover style={{ cursor: 'pointer' }}>
                    <TableCell onClick={() => navigate(`/${localStorage.getItem('userRole')}/book/${book.id}`)}>{index + 1 + page * rowsPerPage}.</TableCell>
                    <TableCell onClick={() => navigate(`/${localStorage.getItem('userRole')}/book/${book.id}`)}>
                      <img
                        src={book.cover}
                        alt="Cover"
                        height={40}
                        width={40}
                      />
                    </TableCell>
                    <TableCell onClick={() => navigate(`/${localStorage.getItem('userRole')}/book/${book.id}`)}>{book.name}</TableCell>
                    <TableCell onClick={() => navigate(`/${localStorage.getItem('userRole')}/book/${book.id}`)}>{book.author}</TableCell>
                    <TableCell onClick={() => navigate(`/${localStorage.getItem('userRole')}/book/${book.id}`)}>
                      {book.count > 0 ? (
                        <Chip
                          icon={<CheckCircle style={{ color: 'black' }} />}
                          label="Available"
                          color="success"
                          style={{ color: 'black' }} // Set text color to white
                        />
                      ) : (
                        <Chip
                          icon={<Cancel style={{ color: 'white' }} />}
                          label="Not Available"
                          color="error"
                          style={{ color: 'white' }} // Set text color to white
                        />
                      )}
                    </TableCell>
                    <TableCell>
                        <Tooltip
                          title={
                            wishlistBooks.includes(book.id)
                              ? 'Remove from Wishlist'
                              : 'Add to Wishlist'
                          }>
                          <IconButton
                            onClick={() => handleWishlist(book.id)}
                            color="primary">
                            {wishlistBooks.includes(book.id) ? (
                              <IconBookmarkFilled />
                            ) : (
                              <IconBookmark />
                            )}
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredBooks.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </MainCard>
  )
}

export default Wishlist
