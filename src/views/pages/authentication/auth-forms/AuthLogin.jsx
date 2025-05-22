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
import { loginStart, loginSuccess, loginFailure } from 'store/auth'
import { loginApi } from 'api/auth'
import AnimateButton from 'ui-component/extended/AnimateButton'
import { useNavigate } from 'react-router-dom'

const AuthLogin = () => {
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
    dispatch(loginStart())
    try {
      const data = await loginApi(values.email, values.password)
      dispatch(loginSuccess(data.user, data.refreshToken))
      const userRole = localStorage.getItem('userRole')
      if (userRole === 'student') {
        navigate('/student')
      } else if (userRole === 'librarian') {
        navigate('/librarian')
      } else if (userRole === 'admin') {
        navigate('/admin')
      }
    } catch (error) {
      dispatch(loginFailure(error.message))
      setErrors({ submit: error.message })
    }
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().required('Email is required'),
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
            error={Boolean(touched.email && errors.email)}
            sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-phone-login">
              Email
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-phone-login"
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
            error={Boolean(touched.password && errors.password)}
            sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-login">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
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
                Login
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  )
}

export default AuthLogin
