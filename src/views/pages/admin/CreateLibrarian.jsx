import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
  } from '@mui/material'
  import { useEffect, useState } from 'react'
  import createLibrarian from 'api/admin/createLibrarian'
  
  const CreateLibrarian = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: '',
      phone: '',
      Id: '',
      sot: '',
      eot: '',
    })
  
    const [errors, setErrors] = useState({})
  
    const validateForm = () => {
      const newErrors = {}
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
  
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          'Password must be at least 8 characters with one letter and one number'
      }
  
      const phoneRegex = /^[0-9]{10}$/
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits'
      }
  
      Object.keys(formData).forEach((key) => {
        if (!formData[key] && formData[key] !== 0) {
          newErrors[key] = 'This field is required'
        }
      })
  
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
          try {
            await createLibrarian(formData); // Wait for the function to complete
            alert('Librarian created successfully'); // Only show this on success
            setFormData({
              email: '',
              password: '',
              name: '',
              phone: '',
              Id: '',
              sot: '',
              eot: '',
            });
          } catch (error) {
            console.error('Form submission failed:', error);
            alert('Failed to create librarian');
          }
        } else {
          console.log('Form validation failed');
        }
      };      
  
    const handleChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  
    return (
      <Paper elevation={3} sx={{ p: 3, m: 3 }}>
        <Typography variant="h4" gutterBottom>
          Librarian Creation
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Required Information
              </Typography>
            </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="text"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
              />
            </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ID Number"
                name="Id"
                value={formData.Id}
                onChange={handleChange}
                error={!!errors.Id}
                helperText={errors.Id}
                required
              />
            </Grid>
  
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start of Tenure"
                name="sot"
                value={formData.sot}
                onChange={handleChange}
                error={!!errors.sot}
                helperText={errors.sot}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End of Tenure"
                name="eot"
                value={formData.eot}
                onChange={handleChange}
                error={!!errors.eot}
                helperText={errors.eot}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
  
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    )
  }
  
  export default CreateLibrarian
  