import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import validator from 'api/validator'

const useAuthValidation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const validation = async () => {
      try {
        const user = await validator()
        const person = user.role
        if (
          person === 'student' &&
          (location.pathname.startsWith('/admin') ||
            location.pathname.startsWith('/librarian'))
        ) {
          window.location.pathname = '/student'
        }
        if (
          person === 'librarian' &&
          (location.pathname.startsWith('/admin') ||
            location.pathname.startsWith('/student'))
        ) {
          window.location.pathname = '/librarian'
        }
        if (
          person === 'admin' &&
          (location.pathname.startsWith('/librarian') ||
            location.pathname.startsWith('/student'))
        ) {
          window.location.pathname = '/admin'
        }
      } catch (error) {
        console.log('errorr aa gayisss')
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userRole')
          localStorage.removeItem('firstVisit')
          localStorage.removeItem('user')
          navigate('/login', { replace: true })
        } else if (
          error.response &&
          error.response.data &&
          error.response.data.msg
        ) {
          const errorMessage = error.response.data.msg
          alert(errorMessage)
        } else {
          console.error(error)
        }
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('firstVisit')
        localStorage.removeItem('user')
        navigate('/login', { replace: true })
      }
    }
    if (location.pathname === '/') location.pathname = '/login'
    if (location.pathname !== '/login' && location.pathname !== '/signup') validation()
  }, [navigate, location.pathname, location])
}

export default useAuthValidation
