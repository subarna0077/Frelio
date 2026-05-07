
import { useAuthStore } from '../../auth/stores/authStore'

export const Dashboard = () => {
    const {user} = useAuthStore()
  return (
    <div>
        Welcome to dashboard, {user?.name}
    </div>
  )
}

