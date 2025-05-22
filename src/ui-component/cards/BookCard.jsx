import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Modal,
  Box,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Star, StarBorder, Favorite, FavoriteBorder, Bookmark } from '@mui/icons-material'
import { useTheme } from '@mui/system'
import { getIndiUser, requestBook, addtowhishlist, notifyBook } from 'api'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'

const BookCard = ({ book }) => {
  const theme = useTheme()
  const capitalizeFirstLetter = (role) => {
    if (!role) return '' // Handle null or undefined values
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }
  const navigate = useNavigate()
  const userRole = capitalizeFirstLetter(localStorage.getItem('userRole'))
  const [requestedBooks, setRequestedBooks] = useState([]) // Track requested books
  const [issuedBooks, setIssuedBooks] = useState([]) // Track issued books
  const [wishlistBooks, setWishlistBooks] = useState([]) // Track wishlist books
  const [modalOpen, setModalOpen] = useState(false) // Modal visibility state
  const [rating, setRating] = useState(1) // Rating state as an integer (default 0)
  const [comment, setComment] = useState('') // Comment state
  const [currentBookId, setCurrentBookId] = useState(null) // Track the current book for return
  const [notifiedBooks, setNotifiedBooks] = useState([]) // Track notified books

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
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
      user.whishlist.map((book) =>
        setWishlistBooks((prevState) => [...prevState, book.bookId]),
      )
      user.notify.map((book) => 
        setNotifiedBooks((prevState) => [...prevState, book.bookId]),
      )
    } catch (error) {
      console.error('Error fetching user details:', error.message)
    }
  }

  const handleClick = async (bookId, status) => {
    if (status === 'return') {
      setCurrentBookId(bookId);
      setModalOpen(true); // Open the modal
    } else if (status === 'notify') {
      setNotifiedBooks((prevState) => [...prevState, bookId]); // Mark as notified
      try {
        const user = await getIndiUser(localStorage.getItem('id'));
        const body = { userId: localStorage.getItem('id'), email: user.email };
          await notifyBook(bookId, body);
      } catch (error) {
        console.error('Error notifying book:', error.message);
      }
    } else {
      try {
        const body = { userId: localStorage.getItem('id'), status: status };
        await requestBook(bookId, body);
        fetchData();
      } catch (error) {
        console.error('Error requesting book:', error.message);
        alert('Something went wrong! Please try again later.');
      }
    }
  };
  
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

  const handleSubmit = async () => {
    try {
      const body = {
        userId: localStorage.getItem('id'),
        status: 'return',
        rating: rating,
        comment: comment,
      }
      await requestBook(currentBookId, body)
      setModalOpen(false) // Close the modal
      fetchData() // Refresh the data
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

  return (
    <>
      <Grid
        item
        xs={12}
        sm={5}
        md={5}
        lg={2.9}
        key={book.id}
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          margin: '4px',
          marginTop: '16px',
        }}>
        <Card
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}>
          {/* Book Cover */}
          <CardMedia
            onClick={() => navigate(`/${userRole.toLowerCase()}/book/${book.id}`)}
            component="img"
            style={{
              height: '200px',
              width: '90%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            image={book.cover || '/book-cover.webp'}
            alt="Book cover"
          />
          <CardContent
            style={{
              minHeight: '100px',
              padding: '0',
              paddingTop: '16px',
              paddingBottom: '8px',
            }}>
            {/* Book Details */}
            <Typography
              variant="h4"
              component="div"
              onClick={() => navigate(`/${userRole.toLowerCase()}/book/${book.id}`)}>
              {book.name}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              onClick={() => navigate(`/${userRole.toLowerCase()}/book/${book.id}`)}>
              {book.author}
            </Typography>

            <div className="flex items-center justify-between">
              {book.rating > 0 ? (
                <Typography variant="body1">
                  {renderBookRating(book.rating)} {Math.ceil(book.rating)}
                </Typography>
              ) : (
                <Typography variant="body1">Not rated yet</Typography>
              )}
              {/* Wishlist button */}
              {userRole === 'Student' && 
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
                </Tooltip>}
            </div>

            <Typography
              color={
                book.count > 0
                  ? `${theme.palette.success.dark}`
                  : `${theme.palette.error.main}`
              }>
              {book.count > 0 ? 'Available' : 'Not Available'}
            </Typography>
          </CardContent>

          {userRole === 'Student' && requestBook.length > 0 && (
            <CardActions
            style={{
              marginTop: 'auto',
              width: '100%',
              paddingLeft: '0',
            }}>
            {/* Button logic */}
            {/* Check for requestedBooks first */}
            {requestedBooks.includes(book.id) ? (
              <Button
                size="small"
                variant="contained"
                color="warning"
                fullWidth
                disabled>
                Requested
              </Button>
            ) : issuedBooks.includes(book.id) ? (
              // Then check for issuedBooks (Return button)
              <Button
                size="small"
                variant="contained"
                color="error"
                fullWidth
                onClick={() => handleClick(book.id, 'return')}>
                Return
              </Button>
            ) : (
              // Handle notify or issue logic here
              <Button
                size="small"
                variant="contained"
                color={book.count <= 0 ? 'warning' : 'primary'}
                fullWidth
                onClick={() =>
                  book.count <= 0
                    ? handleClick(book.id, 'notify')
                    : handleClick(book.id, 'issue')
                }
                disabled={notifiedBooks.includes(book.id)}>
                {book.count <= 0
                  ? notifiedBooks.includes(book.id)
                    ? 'Will be Notified'
                    : 'Notify Me'
                  : 'Issue'}
              </Button>
            )}
          </CardActions>
          
          )}
        </Card>
      </Grid>

      {/* Modal for rating and comment */}
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
          <Typography variant="h4" sx={{ marginBottom: 2 }} textAlign="center">
            Rate the book
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {renderStars()}
          </Box>
          <TextField
            label="Add Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 2, mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default BookCard

