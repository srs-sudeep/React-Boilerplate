import PropTypes from 'prop-types'
import { memo } from 'react'

// material-ui
import { useTheme } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

// assets
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({ value, ...others }) {
  return (
    <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
      <Grid item>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="h6" sx={{ color: 'primary.800' }}>
              SLOK TULSYAN
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h6" sx={{ color: 'grey' }}>
          Phone Number - +91 9931085103
        </Typography>
        <Typography variant="h6" sx={{ color: 'grey' }}>
          Email - sloktulsyan@gmail.com
        </Typography>
      </Grid>
    </Grid>
  )
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number,
}

// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
  const theme = useTheme()

  return (
    <Card
      sx={{
        bgcolor: 'primary.light',
        mb: 2.75,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 157,
          height: 157,
          bgcolor: 'primary.200',
          borderRadius: '50%',
          top: -105,
          right: -96,
        },
      }}>
      <Box sx={{ p: 2 }}>
        <List disablePadding sx={{ m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters disablePadding>
            <ListItemAvatar sx={{ mt: 0 }}>
              <img src="/logo.png" alt="ज्ञान वाटिका" height={50} width={50} />
            </ListItemAvatar>
            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography variant="subtitle1" sx={{ color: 'primary.800' }}>
                  <strong>ज्ञान वाटिका</strong> <br /> GOALS Library
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ fontSize: 8 }}>
                  {' '}
                  For IIT Bhilai
                </Typography>
              }
            />
          </ListItem>
        </List>
        <LinearProgressWithLabel value={80} />
      </Box>
    </Card>
  )
}

export default memo(MenuCard)
