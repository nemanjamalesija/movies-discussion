import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

// !!!
export default function useAppNavigation() {
  const toast = useToast() // !!!
  const router = useRouter() // !!!
  const route = useRoute() // !!!

  return { toast, router, route }
}
