import User from '../components/User'
import './Pages.css'

interface HomeProps {
  username: string
  users: string[]
  onLogout: () => void
}

function Home ({username, users, onLogout}: HomeProps) {

  return (
    <>
      <p>
        👋 Olá {username}!
      </p>
      <h2>
        Participantes 
      </h2>
      <p className="users">
        {users.map(user => <User user={user} />)}
      </p>
      <button onClick={onLogout}>
        sair
      </button>
    </>
  )
}

export default Home