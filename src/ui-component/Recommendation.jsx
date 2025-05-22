import React, { useEffect, useState } from 'react'
import { getAllBooks, getIndiUser, getIndiBook } from 'api'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
} from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'
import { useTheme } from '@mui/system'

const Recommendation = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const theme = useTheme()

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        // Fetch all books and user data
        const allBooks = await getAllBooks()
        const user = await getIndiUser(localStorage.getItem('id')) // Assuming it gets current user

        // Sort books based on demand (book.history.length + book.students.length) and rating
        const sortedBooks = allBooks
          .map((book) => ({
            ...book,
            demandScore: book.history.length + book.students.length,
          }))
          .sort((a, b) => b.demandScore - a.demandScore || b.rating - a.rating)
          .slice(0, 5) // Get top 5 books

        // Fetch user history and book tags to match recommendations
        const userHistoryBooks = await Promise.all(
          user.history.map(async (item) => {
            const book = await getIndiBook(item.bookId)
            return book
          }),
        )

        const recommendedBooks = sortedBooks
          .map((book) => ({
            ...book,
            tagMatchScore: userHistoryBooks.reduce((acc, userBook) => {
              const commonTags = userBook.tags.filter((tag) =>
                book.tags.includes(tag),
              )
              return acc + commonTags.length
            }, 0),
          }))
          .sort((a, b) => b.tagMatchScore - a.tagMatchScore)
          .slice(0, 3) // Get top 3 books with most tag matches

        setRecommendedBooks(recommendedBooks)
      } catch (error) {
        console.error('Error fetching recommended books:', error)
      }
    }

    fetchRecommendedBooks()
  }, [])

  const renderBookRating = (rating) => {
    return [...Array(5)].map((_, index) => (
      <IconButton key={index} sx={{ p: 0, color: theme.palette.warning.dark }}>
        {index < rating ? <Star /> : <StarBorder />}
      </IconButton>
    ))
  }

  return (
    <Grid
  container
  spacing={2}
  direction="row"
  style={{ padding: '20px', whiteSpace: 'nowrap', display: 'flex' }}
>
  {recommendedBooks.map((book) => (
    <Grid
      item
      xs={12}
      sm={4}
      md={3}
      lg={4}
      key={book.id}
      style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }} // Added center alignment
    >
      <Card style={{ width: '90%' }} onClick={() => window.location.href = `/${localStorage.getItem('userRole')}/book/${book.id}`}>
  {/* Ensure card takes most of the available space */}
        <CardMedia
          style={{
            width: '100%',    // Make the image width 100% of the card width
            height: '200px',   // Set a fixed height for better layout control
            padding: '5px',
            borderRadius: '20px',
            objectFit: 'cover',  // Ensure image doesn't stretch awkwardly
          }}
          component="img"
          image={book.cover}
          alt={book.name}
        />
        <CardContent
          style={{ padding: '10px', textWrap: 'wrap' }}
        >
          <Typography variant="h6" gutterBottom>  {/* Adjusted font size */}
            {book.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.author}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {renderBookRating(book.rating)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

  )
}

export default Recommendation
