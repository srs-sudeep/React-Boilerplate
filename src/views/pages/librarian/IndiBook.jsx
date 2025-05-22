import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Button,
  CardActions,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  DialogActions,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { fetchSummary, getIndiBook, getIndiUser, requestBook } from 'api' // Assuming you have the correct API imports
import { Star, StarBorder } from '@mui/icons-material'
import { useTheme } from '@mui/system'
import { IconSparkles } from '@tabler/icons-react'

const IndiBook = () => {
  const [bookDetails, setBookDetails] = useState({})
  const [userHistory, setUserHistory] = useState([])
  const [reviews, setReviews] = useState([])
  const [requestedBooks, setRequestedBooks] = useState([])
  const [issuedBooks, setIssuedBooks] = useState([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [currentBookId, setCurrentBookId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const theme = useTheme()
  const userRole = localStorage.getItem('userRole')
  const [notifiedBooks, setNotifiedBooks] = useState([]) // Track notified books
  const [summary, setSummary] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('english')

  useEffect(() => {
    fetchBookData()
  }, [])

  const fetchBookData = async () => {
    try {
      const bookId = window.location.pathname.split('/').pop()
      const book = await getIndiBook(bookId)

      setBookDetails(book)

      book.feedback.map(async (feedback) => {
        // Fetch user details using userId from feedback
        const user = await getIndiUser(feedback.userId)

        // Add user details to the feedback and store it in reviews
        setReviews((prevState) => [
          ...prevState,
          {
            ...feedback,
            userName: user.name,
            userAvatar: user.profile || '/avatar.png',
            userEmail: user.email,
          },
        ])
      })

      book.history.map(async (history) => {
        // Fetch user details using userId from feedback
        const user = await getIndiUser(history.userId)

        // Add user details to the feedback and store it in reviews
        setUserHistory((prevState) => [
          ...prevState,
          {
            ...history,
            userName: user.name,
            userAvatar: user.profile || '/avatar.png',
            userEmail: user.email,
          },
        ])
      })

      const user = await getIndiUser(localStorage.getItem('id'))
      user.requestedBooks.map((book) =>
        setRequestedBooks((prevState) => [...prevState, book.bookId]),
      )
      user.returnedBooks.map((book) =>
        setRequestedBooks((prevState) => [...prevState, book.bookId]),
      )
      user.books.map((book) =>
        setIssuedBooks((prevState) => [...prevState, book.bookId]),
      )
      user.notify.map((book) =>
        setNotifiedBooks((prevState) => [...prevState, book.bookId]),
      )
    } catch (error) {
      console.error('Error fetching book:', error.message)
    }
  }

  const getSummary = async (language) => {
    setIsLoading(true)
    setShowSummary(true)
    if (bookDetails.name && bookDetails.author) {
      const summaryText = await fetchSummary(
        bookDetails.name,
        bookDetails.author,
        language,
      )
      setSummary(JSON.parse(summaryText))
    }
    setIsLoading(false)
  }

  const handleClick = async (bookId, status) => {
    if (status === 'return') {
      setCurrentBookId(bookId)
      setModalOpen(true) // Open the modal
    } else if (status === 'notify') {
      setNotifiedBooks((prevState) => [...prevState, bookId]) // Mark as notified
      try {
        const user = await getIndiUser(localStorage.getItem('id'))
        const body = { userId: localStorage.getItem('id'), email: user.email }
        await notifyBook(bookId, body)
      } catch (error) {
        console.error('Error notifying book:', error.message)
      }
    } else {
      try {
        const body = { userId: localStorage.getItem('id'), status: status }
        await requestBook(bookId, body)
        fetchData()
      } catch (error) {
        console.error('Error requesting book:', error.message)
        alert('Something went wrong! Please try again later.')
      }
    }
  }

  const handleSubmit = async () => {
    try {
      const body = {
        userId: localStorage.getItem('id'),
        status: 'return',
        rating: rating,
        comment: comment,
      }
      await requestBook(currentBookId, body)
      const count = +localStorage.getItem('request') || 0
      localStorage.setItem('request', count + 1)
      setModalOpen(false) // Close the modal
      fetchBookData() // Refresh the data
    } catch (error) {
      console.error('Error submitting return request:', error.message)
    }
  }

  // Function to render stars for rating
  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <IconButton
        key={index}
        onClick={() => setRating(index + 1)}
        sx={{ p: 0, color: theme.palette.warning.dark }}>
        {index < rating ? <Star /> : <StarBorder />}
      </IconButton>
    ))
  }

  const renderBookRating = (rating) => {
    return [...Array(5)].map((_, index) => (
      <IconButton key={index} sx={{ p: 0, color: theme.palette.warning.dark }}>
        {index < rating ? <Star /> : <StarBorder />}
      </IconButton>
    ))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Function to open the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  // Function to handle language change
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
  }

  // Function to call getSummary with selected language
  const handleGenerateSummary = () => {
    setIsLoading(true)
    handleCloseDialog() // Close the dialog after selecting language
    getSummary(selectedLanguage) // Call the summary function with the selected language
  }

  return (
    <>
      <Box sx={{ padding: '16px' }}>
        {/* Top Section - Book Cover and Details */}
        <Card
          sx={{
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent={'center'}
            direction={{ xs: 'column', sm: 'row' }}>
            <Grid item xs={12} sm={4} md={3}>
              <CardMedia
                component="img"
                image={bookDetails.cover || '/book-cover.webp'}
                alt="Book cover"
                sx={{
                  width: '70%',
                  height: 'auto',
                  borderRadius: '8px',
                  margin: 'auto',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <CardContent>
                <Typography variant="h1" component="div">
                  {bookDetails.name}
                </Typography>
                <Typography
                  variant="h4"
                  color="textSecondary"
                  style={{ marginTop: '8px' }}>
                  Author: {bookDetails.author}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  style={{ marginTop: '8px' }}>
                  Tags: {bookDetails.tags && bookDetails.tags.join(', ')}
                </Typography>
                {bookDetails.rating > 0 ? (
                  <Typography variant="body1" className="mt-5">
                    {renderBookRating(bookDetails.rating)}{' '}
                    {Math.ceil(bookDetails.rating)}
                  </Typography>
                ) : (
                  <Typography variant="body1">Not rated yet</Typography>
                )}
                {userRole === 'student' && (
                  <CardActions
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      paddingLeft: '0',
                    }}>
                    {/* Button logic */}
                    {requestedBooks.includes(bookDetails.id) ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        style={{width: '30%'}}
                        disabled>
                        Requested
                      </Button>
                    ) : issuedBooks.includes(bookDetails.id) ? (
                      // Then check for issuedBooks (Return button)
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        style={{width: '30%'}}
                        onClick={() => handleClick(bookDetails.id, 'return')}>
                        Return
                      </Button>
                    ) : (
                      // Handle notify or issue logic here
                      <Button
                        size="small"
                        variant="contained"
                        style={{width: '30%'}}
                        color={bookDetails.count <= 0 ? 'warning' : 'primary'}
                        onClick={() =>
                          bookDetails.count <= 0
                            ? handleClick(bookDetails.id, 'notify')
                            : handleClick(bookDetails.id, 'issue')
                        }
                        disabled={notifiedBooks.includes(bookDetails.id)}>
                        {bookDetails.count <= 0
                          ? notifiedBooks.includes(bookDetails.id)
                            ? 'Will be Notified'
                            : 'Notify Me'
                          : 'Issue'}
                      </Button>
                    )}
                  </CardActions>
                )}
              </CardContent>
            </Grid>
          </Grid>
        </Card>

        <Box sx={{ textAlign: 'right', marginBottom: '10px' }}>
          <IconButton
            size="small"
            variant="contained"
            color="primary"
            disabled={showSummary}
            onClick={handleOpenDialog}>
            <IconSparkles />
            Generate Summary
          </IconButton>
        </Box>

        {/* Show the summary in a card if available */}
        {showSummary && (
          <Card
            sx={{
              backgroundColor: 'white',
              padding: '16px',
              marginTop: '16px',
              marginBottom: '16px',
            }}>
            <CardContent>
              <Typography
                variant="body1"
                sx={{ color: 'black', fontSize: '1.1rem' }}>
                {isLoading ? 'Loading...' : summary.summary}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Dialog for language selection */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Select Language</DialogTitle>
          <DialogContent>
            <RadioGroup
              value={selectedLanguage}
              onChange={handleLanguageChange}>
              <FormControlLabel
                value="english"
                control={<Radio />}
                label="English"
              />
              <FormControlLabel
                value="hindi"
                control={<Radio />}
                label="Hindi"
              />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleGenerateSummary} color="primary">
              Generate Summary
            </Button>
          </DialogActions>
        </Dialog>

        {/* Bottom Section - Divided into Two Parts */}
        <Grid container spacing={3}>
          {/* Left Section - User Reviews */}
          <Grid
            item
            xs={12}
            md={userRole !== 'student' ? 6 : 12} // Full width if no user history
          >
            <Paper sx={{ padding: '16px', borderRadius: '12px' }}>
              <Typography variant="h3" gutterBottom>
                Reviews
              </Typography>
              <List>
                {reviews.map((review, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <Avatar
                        alt={review.userName}
                        src={review.userAvatar || '/avatar.png'}
                        sx={{ mr: 2 }} // Adds space between profile picture and name/email
                      />
                      <ListItemText
                        primary={
                          <>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{ fontWeight: 'bold' }}>
                              {review.userName}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="div"
                              color="textSecondary">
                              {review.userEmail}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              {renderBookRating(review.rating)}{' '}
                              {/* Display stars instead of numbers */}
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{
                                color: 'black',
                                fontSize: '1.1rem',
                                marginTop: '8px',
                              }}>
                              {review.comment}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < reviews.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Right Section - User History */}
          {userRole !== 'student' && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ padding: '16px', borderRadius: '12px' }}>
                <Typography variant="h3" gutterBottom>
                  History
                </Typography>
                <List>
                  {userHistory.map((history, index) => (
                    <React.Fragment key={index}>
                      <ListItem alignItems="flex-start">
                        <Avatar
                          alt={history.userName}
                          src={history.userAvatar || '/avatar.png'}
                          sx={{ mr: 2 }} // Adds space between profile picture and name/email
                        />
                        <ListItemText
                          primary={
                            <>
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{ fontWeight: 'bold' }}>
                                {history.userName}
                              </Typography>
                              <Typography
                                variant="body2"
                                component="div"
                                color="textSecondary">
                                {history.userEmail}
                              </Typography>
                            </>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'black',
                                  fontSize: '1.1rem',
                                  marginTop: '8px',
                                }}>
                                {formatDate(history.issueDate)} -{' '}
                                {formatDate(history.returnDate)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < reviews.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            borderRadius: 6,
            p: 4,
          }}>
          <Typography
            variant="h4"
            component="h2"
            color={theme.palette.error.main}>
            Return Book
          </Typography>
          <Grid container gap={2} alignItems="center">
            <img
              src={bookDetails.cover}
              alt="Cover"
              height={50}
              width={50}
              className="mb-3 mt-5"
            />
            <Grid>
              <Typography variant="h3" component="h2">
                {bookDetails.name}
              </Typography>
              <Typography color="textSecondary">
                {bookDetails.author}
              </Typography>
            </Grid>
          </Grid>

          {/* Star Rating */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>{renderStars()}</Box>

          <TextField
            label="Comment"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  )
}

export default IndiBook
