import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export const AuthCallback = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const accessToken = urlParams.get('token')
    const refreshToken = urlParams.get('refresh')
    const userString = urlParams.get('user')

    
    if (accessToken && userString) {
      // console.log('Tokens found, storing and redirecting to dashboard')
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken!)
      
      try {
        const userData = JSON.parse(decodeURIComponent(userString))
        console.log('User data parsed:', userData)
        queryClient.setQueryData(['user'], userData)
        
        navigate('/whiteboard', { replace: true })
      } catch (error) {
        console.error('Error parsing user data:', error)
        navigate('/login?error=parse_failed', { replace: true })
      }
    } else {
      console.log('Missing tokens - accessToken:', !!accessToken, 'userString:', !!userString)
      navigate('/login?error=auth_failed', { replace: true })
    }
  }, [location, navigate, queryClient])
  
  return <div>Completing Google login...</div>
}