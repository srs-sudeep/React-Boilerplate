import { Link } from 'react-router-dom'

// material-ui
import ButtonBase from '@mui/material/ButtonBase'

// project imports
import config from '../../../config'
import Logo from 'ui-component/Logo'
import { useNavigate } from 'react-router-dom'

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const navigate = useNavigate()
  const userRole = localStorage.getItem('userRole')
  return (
    <ButtonBase
      disableRipple
      onClick={() => navigate(`/`)}
      component={Link}
      to={config.defaultPath}>
      <Logo />
    </ButtonBase>
  )
}

export default LogoSection
