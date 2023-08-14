import useAppNavigation from '../composables/useAppNavigation'

export default function getTokenLocalsTorage() {
  const jwtToken = localStorage.getItem('jwt')
  const { toast, router } = useAppNavigation()

  if (!jwtToken) {
    toast.error('Could not get your session! Please log in.')
    router.push('/')
  }

  return { jwtToken, toast, router }
}
