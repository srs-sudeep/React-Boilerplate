// material-ui
import { useTheme } from '@mui/material/styles'

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */
import logo from '/logo.png'
// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
  const theme = useTheme()

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={logo} alt="Berry" width="100" />
     *
     */
    <div className="flex items-center justify-center gap-2">
      <img src={logo} alt="ज्ञान वाटिका" width="50" height="50" />
      <div>
      <h1 className='text-2xl font-bold'>ज्ञान वाटिका</h1>
      <p className='text-sm'>GOALS Library</p>
      </div>
    </div>
  )
}

export default Logo
