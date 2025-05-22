import { Link } from 'react-router-dom'

// material-ui
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

// project imports
import AuthWrapper1 from '../AuthWrapper1'
import AuthCardWrapper from '../AuthCardWrapper'
import AuthLogin from './auth-forms/AuthLogin'
import Logo from 'ui-component/Logo'

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'))

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: '100vh', backgroundImage: 'url(/background.webp)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link to="#" aria-label="logo">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={{ xs: 'column-reverse', md: 'row' }}
                      alignItems="center"
                      justifyContent="center">
                      <Grid item>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}>
                          <Typography
                            color="secondary.main"
                            gutterBottom
                            variant={downMD ? 'h3' : 'h2'}>
                            Hi, Welcome to ज्ञान वाटिका
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize="16px"
                            textAlign={{ xs: 'center', md: 'inherit' }}>
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      style={{
                        color: '#1976d2', // A more visible blue color, or choose one from the theme
                        textDecoration: 'underline', // Ensures underline styling
                      }}>
                      Sign up
                    </Link>
                  </Typography>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </AuthWrapper1>
  )
}

export default Login
