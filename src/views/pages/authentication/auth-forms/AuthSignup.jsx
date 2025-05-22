import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Stack,
  FormHelperText,
} from '@mui/material'
import * as Yup from 'yup'
import { Formik } from 'formik'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { SignupApi } from 'api/auth'
import AnimateButton from 'ui-component/extended/AnimateButton'
import { useNavigate } from 'react-router-dom'

const AuthSignup = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event) => event.preventDefault()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const userRole = localStorage.getItem('userRole')
    if (accessToken && userRole) {
      if (userRole === 'student') {
        navigate('/student')
      } else if (userRole === 'librarian') {
        navigate('/librarian')
      } else if (userRole === 'admin') {
        navigate('/admin')
      }
    }
  }, [navigate])

  const handleSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      await SignupApi(values.name, values.email, values.phone, values.Id, values.password)
      localStorage.setItem(userRole, 'student')
      navigate('/student')
    } catch (error) {
      console.error('Form submission failed:', error)
      setErrors({ submit: error.message })
    }
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        phone: '',
        Id: '',
        password: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Must be a valid email').required('Email is required'),
        phone: Yup.string().matches(/^[0-9]{10}$/, 'Must be a valid phone number').required('Phone is required'),
        Id: Yup.string().required('ID is required'),
        password: Yup.string().required('Password is required'),
      })}
      onSubmit={handleSubmit}>
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <FormControl
            fullWidth
            error={Boolean(touched.name && errors.name)}
            sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
            <OutlinedInput
              Id="outlined-adornment-name"
              type="text"
              value={values.name}
              name="name"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Name"
            />
            {touched.name && errors.name && (
              <FormHelperText error>{errors.name}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.email && errors.email)}
            sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
            <OutlinedInput
              Id="outlined-adornment-email"
              type="text"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Email"
            />
            {touched.email && errors.email && (
              <FormHelperText error>{errors.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.phone && errors.phone)}
            sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-phone">Phone</InputLabel>
            <OutlinedInput
              Id="outlined-adornment-phone"
              type="text"
              value={values.phone}
              name="phone"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Phone"
            />
            {touched.phone && errors.phone && (
              <FormHelperText error>{errors.phone}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.Id && errors.Id)}
            sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-Id">ID</InputLabel>
            <OutlinedInput
              Id="outlined-adornment-Id"
              type="text"
              value={values.Id}
              name="Id"
              onBlur={handleBlur}
              onChange={handleChange}
              label="ID"
            />
            {touched.Id && errors.Id && (
              <FormHelperText error>{errors.Id}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            fullWidth
            error={Boolean(touched.password && errors.password)}
            sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              Id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}>
                    {showPassword ? <Visibility color='secondary' /> : <VisibilityOff color='secondary'/>}
                  </Button>
                </InputAdornment>
              }
              label="Password"
            />
            {touched.password && errors.password && (
              <FormHelperText error>{errors.password}</FormHelperText>
            )}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting || authState.loading}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="secondary">
                Sign Up
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  )
}

export default AuthSignup
