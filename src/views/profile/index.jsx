import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Avatar,
  Grid,
  Paper,
  useTheme,
  IconButton,
  Button,
} from '@mui/material'
import { CameraAlt as CameraIcon } from '@mui/icons-material'
import MainCard from 'ui-component/cards/MainCard'
import { getIndiBook, getIndiUser, updateUser, uploadImage } from 'api'
import BookCard from 'ui-component/cards/BookCard'

const UserProfile = () => {
  const theme = useTheme()
  const [UserProfile, setUserProfile] = useState({})
  const [role, setRole] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await getIndiUser(localStorage.getItem('id'))
      setUserProfile(response)
      const bookIds = response.history.map((book) => book.bookId)
      const fetchedBooks = await Promise.all(
        bookIds.map(async (bookId) => await getIndiBook(bookId))
      )
      setBooks(fetchedBooks)
    } catch (error) {
      console.error('Error fetching user profile:', error.message)
    }
  }
  

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (userRole) {
      const formattedRole =
        userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()
      setRole(formattedRole)
    }
  }, [])

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0])
  }

  const handleImageUpload = async () => {
    if (!selectedImage) return
    setUploading(true)

    try {
      const imageUrl = await uploadImage(selectedImage)
      console.log(imageUrl)

      // Update the profile with the new image URL
      await updateUser(localStorage.getItem('id'), { profile: imageUrl })

      // Update the state to show the new image
      setUserProfile((prevProfile) => ({
        ...prevProfile,
        profile: imageUrl,
      }))
      setUploading(false)
      setSelectedImage(null) // Reset after upload
    } catch (error) {
      console.error('Error uploading image:', error.message)
      setUploading(false)
    }
  }

  return (
    <MainCard title={`${role} Profile`}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 900,
          margin: 'auto',
          padding: 0,
          my: 5,
          borderRadius: 3,
        }}>
        <Card sx={{ padding: 0 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              {/* Profile Picture */}
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    margin: 'auto',
                    border: `4px solid ${theme.palette.primary.main}`,
                  }}
                  src={
                    UserProfile.profile ||
                    'https://res.cloudinary.com/dipqjlyj2/image/upload/v1733733540/xehutfiegx0gukttbbil.png'
                  }
                  alt={UserProfile.name || 'Profile Picture'}
                />

                {/* Camera Icon for Image Upload */}
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="profile-image-upload"
                />
                <label htmlFor="profile-image-upload">
                  {!selectedImage && (
                    <IconButton
                      component="span"
                      sx={{
                        backgroundColor: theme.palette.background.default,
                        borderRadius: '50%',
                        p: 1,
                      }}>
                      <CameraIcon />
                    </IconButton>
                  )}
                </label>

                {/* Upload Button */}
                {selectedImage && (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 2 }}
                    onClick={handleImageUpload}
                    disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                )}
              </Grid>

              {/* Profile Details */}
              <Grid item xs={16} md={8} sx={{ padding: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    padding: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                  }}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body1">
                    <strong>Name:</strong> {UserProfile.name || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>ID:</strong> {UserProfile.Id || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {UserProfile.email || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {UserProfile.phone || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
      {books.length > 0 && <Typography variant="h2">History</Typography>} <br/>
      {books.length > 0 && <Grid container spacing={3} sx={{ p: 3, height: '700px', overflow: 'auto' }}>
        {books.reverse().map((book) => (
          <BookCard book={book} />
        ))}
      </Grid>}
    </MainCard>
  )
}

export default UserProfile
