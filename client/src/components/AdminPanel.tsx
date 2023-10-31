import { assignSantas } from "../api"

interface AdminPanelProps {
  status?: string
}

function AdminPanel ({status}: AdminPanelProps) {
  const shuffle = async () => {
    await assignSantas()
  }

  return (
    <div>
      <button disabled={status === 'started'} className="secondary" onClick={shuffle}>
        Atribuir Amigos
      </button>
    </div>
  )
}

export default AdminPanel