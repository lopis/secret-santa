import User from '../components/User'
import AdminPanel from '../components/AdminPanel'
import './Pages.css'

interface HomeProps {
  username: string
  users: string[]
  onLogout: () => void
}

function Home ({username, users, onLogout}: HomeProps) {
  const isAdmin = username === 'admin'

  return (
    <>
      <p>
        👋 Olá {username}!
      </p>
      <div className="users">
        <h2>
          Participantes 
        </h2>
        {users.map((user, i) => <User key={i} user={user} />)}
      </div>
      {isAdmin && <AdminPanel />}
      <button onClick={onLogout}>
        Sair
      </button>
    </>
  )
}

export default Home