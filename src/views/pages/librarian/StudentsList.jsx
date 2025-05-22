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
import { getAllUsers } from 'api' // Change the API import to fetch users data

const StudentsList = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')

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

  // Comparator function to handle sorting
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

  // Search filter function
  const filteredUsers = sortedUsers.filter((user) => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm)
    )
  })

  return (
    <MainCard title="Students List">
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
                  <TableSortLabel>
                    S.No.
                  </TableSortLabel>
                </TableCell>
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
                    active={orderBy === 'count'}
                    direction={orderBy === 'count' ? order : 'asc'}
                    onClick={() => handleRequestSort('count')}>
                    Issued Books
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .filter((user) => user.role === 'student')
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow
                    key={index}
                    hover
                    style={{ cursor: 'pointer' }}
                    onClick={() => console.log('User clicked:', user)}
                  >
                    <TableCell>{index + 1 + page * rowsPerPage}.</TableCell>
                    <TableCell>{user.Id}</TableCell>
                    <TableCell>
                      <img src={user.profile} alt="Profile" height={40} width={40} className="rounded-full" />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.books.length}</TableCell>
                  </TableRow>
                ))}
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

export default StudentsList
