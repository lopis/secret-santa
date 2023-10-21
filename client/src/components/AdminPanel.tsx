import { assignSantas } from "../api"

function AdminPanel () {
  const shuffle = async () => {
    await assignSantas()
  }

  return (
    <div>
      <button className="secondary" onClick={shuffle}>
        Atribuir Amigos
      </button>
    </div>
  )
}

export default AdminPanel