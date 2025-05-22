import {
    Box,
    Button,
    CircularProgress,
    Grid,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    InputLabel,
    FormControl,
    OutlinedInput,
    Chip,
    IconButton,
  } from '@mui/material'
  import PhotoCamera from '@mui/icons-material/PhotoCamera' // Import Camera Icon
  import PhotoLibrary from '@mui/icons-material/PhotoLibrary' // Import Gallery Icon
  import { registerBook, uploadImage } from 'api'
  import { useState } from 'react'
  
  const RegisterBooks = () => {
    const [formData, setFormData] = useState({
      name: '',
      author: '',
      count: 0,
      cover: '',
      tags: [],
    })
  
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
  
    const books = [
      'Fiction',
      'Non-Fiction',
      'Science',
      'Technology',
      'Engineering',
      'Mathematics',
      'History',
      'Biography',
      'Fantasy',
      'Adventure',
      'Mystery',
      'Thriller',
      'Romance',
      'Self-help',
      'Philosophy',
      'Psychology',
      'Poetry',
      'Drama',
      'Classics',
      'Science Fiction',
      'Horror',
      'Travel',
      'Children',
      'Young Adult',
      'Art',
      'Business',
      'Religion',
      'Politics',
      'Cookbooks',
      'Comics',
      'Graphic Novels',
      'Others',
    ]
  
    // Updated validation function
    const validateForm = () => {
      const newErrors = {}
      
      if (!formData.name.trim()) {
        newErrors.name = 'Book name is required'
      }
      
      if (!formData.author.trim()) {
        newErrors.author = 'Author name is required'
      }
      
      if (formData.count <= 0) {
        newErrors.count = 'The number of copies must be greater than zero'
      }
  
      if (formData.tags.length === 0) {
        newErrors.tags = 'At least one tag is required'
      }
  
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      if (validateForm()) {
        try {
          await registerBook(formData)
          alert('Book registered successfully')
          setFormData({
            name: '',
            author: '',
            count: 0,
            cover: '',
            tags: [],
          })
        } catch (error) {
          console.error('Form submission failed:', error)
          alert('Failed to register book')
        }
      } else {
        console.log('Form validation failed')
      }
    }
  
    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  
    const handleTagChange = (event) => {
      const { value } = event.target
      setFormData((prev) => ({
        ...prev,
        tags: typeof value === 'string' ? value.split(',') : value,
      }))
    }
  
    const handleImageUpload = async (e) => {
      const file = e.target.files[0]
      setLoading(true)
      try {
        const imageUrl = await uploadImage(file)
        setFormData((prev) => ({
          ...prev,
          cover: imageUrl,
        }))
        setLoading(false)
      } catch (error) {
        console.error('Error uploading image:', error)
        setLoading(false)
      }
    }
  
    return (
      <Paper elevation={3} sx={{ p: 3, m: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}>
                {/* Image preview box */}
                <img
                  src={formData.cover || '/book-cover.webp'}
                  alt="Book Cover"
                  style={{
                    height: 'auto',
                    maxHeight: '400px',
                    padding: '1rem',
                    borderRadius: '2rem',
                  }}
                  className="w-full md:w-[60%]"
                />
                {loading && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      borderRadius: '2rem',
                    }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>
              {!formData.cover && (
                <p className="text-xs text-center text-red-500">
                  *This is just a demo image. Actual cover image is required.
                </p>
              )}
            </Grid>
  
            <Grid item xs={12} md={6} sx={{ marginTop: '1rem' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Name of Book"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Author name"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    error={!!errors.author}
                    helperText={errors.author}
                    required
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Number of Copies"
                    type="number"
                    name="count"
                    value={formData.count}
                    onChange={handleChange}
                    error={!!errors.count}
                    helperText={errors.count}
                    required
                  />
                </Grid>
  
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.tags}>
                    <InputLabel id="tags-label">Tags</InputLabel>
                    <Select
                      labelId="tags-label"
                      name="tags"
                      multiple
                      required
                      value={formData.tags}
                      onChange={handleTagChange}
                      input={<OutlinedInput id="select-multiple-chip" label="Tags" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}>
                      {books.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                          {tag}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.tags && (
                      <Typography color="error">{errors.tags}</Typography>
                    )}
                  </FormControl>
                </Grid>
  
                <Grid item xs={12}>
                  <p className="text-sm text-gray-500">Upload Cover Image</p>
                  {/* Camera and Gallery icons */}
                  <Box sx={{ display: 'flex' }}>
                    <input
                      accept="image/*"
                      type="file"
                      id="cameraInput"
                      capture="camera" // This enables the camera on mobile devices
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="cameraInput">
                      <IconButton
                        component="span"
                        sx={{ display: { xs: 'block', md: 'none' } }} // Only show on small devices
                      >
                        <PhotoCamera /> {/* Camera Icon */}
                      </IconButton>
                    </label>
  
                    <input
                      accept="image/*"
                      type="file"
                      id="galleryInput"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="galleryInput">
                      <IconButton component="span">
                        <PhotoLibrary className='mt-2' /> {/* Gallery Icon */}
                      </IconButton>
                    </label>
                  </Box>
                </Grid>
  
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}>
                    {loading ? 'Uploading...' : 'Register'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    )
  }
  
  export default RegisterBooks
  