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
      <div className="users">
        <h2>
          Participantes 
        </h2>
        {users.map((user, i) => <User key={i} user={user} />)}
      </div>
      <button onClick={onLogout}>
        Sair
      </button>
    </>
  )
}

export default Home