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
} from '@mui/material'
import MainCard from 'ui-component/cards/MainCard'
import { getAllLibrarian } from 'api' // Change the API import to fetch librarian data

const LibrarianList = () => {
  const navigate = useNavigate()
  const [librarian, setLibrarian] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name') // Default to 'name' for sorting
  const [totalLibrarian, setTotalLibrarian] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await getAllLibrarian()
      setLibrarian(data)
      setTotalLibrarian(data.length)
    } catch (error) {
      console.error('Error fetching librarian:', error.message)
    }
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

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
  }

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  // Format dates (Start of Tenure and End of Tenure)
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  // Search filter function
  const filteredLibrarians = librarian.filter((librarian) => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    return (
      librarian.name.toLowerCase().includes(lowerSearchTerm) ||
      librarian.email.toLowerCase().includes(lowerSearchTerm)
    )
  })

  const sortedLibrarians = stableSort(filteredLibrarians, getComparator(order, orderBy))

  const handleRowClick = (librarian) => {
    // You can navigate to a detail page or perform any other action here
    console.log('Librarian clicked:', librarian)
  }

  return (
    <MainCard title="Librarians List">
      <Paper>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'Id'}
                    direction={orderBy === 'Id' ? order : 'asc'}
                    onClick={() => handleRequestSort('Id')}>
                    ID Number
                  </TableSortLabel>
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}>
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'email'}
                    direction={orderBy === 'email' ? order : 'asc'}
                    onClick={() => handleRequestSort('email')}>
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'phone'}
                    direction={orderBy === 'phone' ? order : 'asc'}
                    onClick={() => handleRequestSort('phone')}>
                    Phone Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'sot'}
                    direction={orderBy === 'sot' ? order : 'asc'}
                    onClick={() => handleRequestSort('sot')}>
                    Start of Tenure
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'eot'}
                    direction={orderBy === 'eot' ? order : 'asc'}
                    onClick={() => handleRequestSort('eot')}>
                    End of Tenure
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedLibrarians.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((librarian) => (
                <TableRow
                  key={librarian._id}
                  hover
                  onClick={() => handleRowClick(librarian)}
                  style={{ cursor: 'pointer' }}>
                  <TableCell>{librarian.Id}</TableCell>
                  <TableCell>
                    <img src={librarian.profile} alt="Profile" height={40} width={40} className='rounded-full' />
                  </TableCell>
                  <TableCell>{librarian.name}</TableCell>
                  <TableCell>{librarian.email}</TableCell>
                  <TableCell>{librarian.phone}</TableCell>
                  <TableCell>{formatDate(librarian.sot)}</TableCell>
                  <TableCell>{formatDate(librarian.eot)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredLibrarians.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </MainCard>
  )
}

export default LibrarianList
