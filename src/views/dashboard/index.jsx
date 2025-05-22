import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Paper,
  TextField,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Fab,
  Zoom,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import MainCard from 'ui-component/cards/MainCard'
import { getAllBooks, getAllLibrarian } from 'api'
import BookCard from 'ui-component/cards/BookCard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { IconId, IconLayoutDashboard, IconMail, IconPhone, IconSparkles, IconUserEdit } from '@tabler/icons-react'
import Leaderboard from 'ui-component/Leaderboard'
import Recommendation from 'ui-component/Recommendation'

const Dashboard = () => {
  const capitalizeFirstLetter = (role) => {
    if (!role) return ''
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }

  const userName = localStorage.getItem('user')
  const userRole = capitalizeFirstLetter(localStorage.getItem('userRole'))

  const navigate = useNavigate()
  const [book, setBook] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tags, setTags] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const [openFab, setOpenFab] = useState(false)
  const [librarian, setLibrarian] = useState([])

  // State for handling modals
  const [openLibrarianModal, setOpenLibrarianModal] = useState(false)
  const [openLeaderboardModal, setOpenLeaderboardModal] = useState(false)
  const [openRecommendationModal, setOpenRecommendationModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const data = await getAllBooks()
      setBook(data)
      extractAvailableTags(data)
      const librarianData = await getAllLibrarian()
      setLibrarian([librarianData[librarianData.length - 1]])
    } catch (error) {
      console.error('Error fetching book:', error.message)
    }
  }

  const extractAvailableTags = (books) => {
    const allTags = books.flatMap((book) => book.tags || [])
    const uniqueTags = [...new Set(allTags)]
    setAvailableTags(uniqueTags)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredBooks = book.filter((book) => {
    const lowerSearchTerm = searchTerm.toLowerCase()
    const matchesSearchTerm =
      book.name.toLowerCase().includes(lowerSearchTerm) ||
      book.author.toLowerCase().includes(lowerSearchTerm)

    const matchesTags = tags.every((tag) => book.tags.includes(tag))

    return matchesSearchTerm && matchesTags
  })

  console.log(librarian)

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  const handleTagSelect = (tag) => {
    if (!tags.includes(tag)) {
      setTags((prevTags) => [...prevTags, tag])
    }
    handleFilterClose()
  }

  const handleTagDelete = (tagToDelete) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete))
  }

  // Modal handling functions
  const handleOpenLibrarianModal = () => setOpenLibrarianModal(true)
  const handleCloseLibrarianModal = () => setOpenLibrarianModal(false)

  const handleOpenLeaderboardModal = () => setOpenLeaderboardModal(true)
  const handleCloseLeaderboardModal = () => setOpenLeaderboardModal(false)

  const handleOpenRecommendationModal = () => setOpenRecommendationModal(true)
  const handleCloseRecommendationModal = () => setOpenRecommendationModal(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800">
            {userRole} Dashboard
          </h1>
          <p className="text-gray-500">Welcome back, {userName}!</p>
        </div>
      </div>
      <MainCard>
        <Paper>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TextField
              label="Search by book or author here..."
              variant="outlined"
              style={{ marginBottom: '10px' }}
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <IconButton
              aria-controls="filter-menu"
              aria-haspopup="true"
              onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
            <Menu
              id="filter-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleFilterClose}>
              {availableTags.map((tag) => (
                <MenuItem key={tag} onClick={() => handleTagSelect(tag)}>
                  {tag}
                </MenuItem>
              ))}
            </Menu>
          </div>

          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleTagDelete(tag)}
              />
            ))}
          </div>

          <Grid container spacing={3} sx={{ p: 3 }}>
            {filteredBooks.reverse().map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </Grid>
        </Paper>
      </MainCard>

      {/* Sticky FAB in the bottom right */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}>
        <Tooltip title="Options">
          <Fab color="primary" onClick={() => setOpenFab((prev) => !prev)}>
            <IconLayoutDashboard />
          </Fab>
        </Tooltip>
        <Zoom in={openFab}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              bottom: 64,
              right: 0,
              gap: 1,
            }}>
            {userRole === 'Student' && <Tooltip title="Know Your Librarian">
              <Fab color="secondary" onClick={handleOpenLibrarianModal}>
                {librarian.length > 0 ? <img
                  src={librarian[0].profile}
                  alt="Profile"
                  className="rounded-full"
                /> : <IconUserEdit />}
              </Fab>
            </Tooltip>}

            <Tooltip title="Leaderboard">
              <Fab color="secondary" onClick={handleOpenLeaderboardModal}>
                <EmojiEventsIcon />
              </Fab>
            </Tooltip>

            <Tooltip title="Recommendations">
              <Fab color="secondary" onClick={handleOpenRecommendationModal}>
                <IconSparkles />
              </Fab>
            </Tooltip>
          </Box>
        </Zoom>
      </Box>

      {/* Librarian Modal */}
      <Dialog open={openLibrarianModal} onClose={handleCloseLibrarianModal}>
        <DialogTitle className="text-xl font-bold">
          Know Your Librarian
        </DialogTitle>
        <DialogContent>
          {librarian.length > 0 ? (
            <>
              <div className='flex items-center space-x-2'>
              <img src={librarian[0].profile} alt="Profile" className='rounded-full' height={50} width={50} />
              <p className='text-xl font-bold'>{librarian[0].name}</p>
              </div>
              <span className='flex items-center space-x-2 mt-3'>
              <IconMail />
              <p className='text-lg'>{librarian[0].email}</p>
              </span>
              <span className='flex items-center space-x-2 mt-1'>
              <IconPhone />
              <p className='text-lg'>{librarian[0].phone}</p>
              </span>
              <span className='flex items-center space-x-2 mt-1'>
              <IconId />
              <p className='text-lg'>{librarian[0].Id}</p>
              </span>
            </>
          ) : (
            <p>No librarian data available</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLibrarianModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Leaderboard Modal */}
      <Dialog open={openLeaderboardModal} onClose={handleCloseLeaderboardModal}>
        <DialogTitle className="text-xl font-bold">Leaderboard</DialogTitle>
        <DialogContent>
          <Leaderboard />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLeaderboardModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Recommendation Modal */}
      <Dialog
        open={openRecommendationModal}
        onClose={handleCloseRecommendationModal}>
        <DialogTitle className='text-xl font-bold'>Recommendations</DialogTitle>
        <DialogContent>
          <Recommendation />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecommendationModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Dashboard
