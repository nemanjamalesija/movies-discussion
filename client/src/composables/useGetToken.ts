export default function useGetToken() {
  const jwtToken = localStorage.getItem('jwt')

  if (!jwtToken) {
    return
  } else return jwtToken
}
