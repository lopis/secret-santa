import UserItem from '../components/User'
import AdminPanel from '../components/AdminPanel'
import './Pages.css'
import { User } from './Login'
import { useState } from 'react'
import { reset } from '../api';

interface HomeProps {
  user: User
  users: string[]
  onLogout: () => void
}

function Home ({user, users, onLogout}: HomeProps) {
  const [revealed, setReleaved] = useState('')
  const [msg, setMsg] = useState('')
  const isAdmin = user.name === 'admin'

  const reveal = (name: string) => {
    setReleaved(revealed == name ? '' : name)
  }

  const classes = (revealName: string) => {
    return ['secret', revealName == revealed ? 'open' : ''].join(' ')
  }

  const onReset = async (username: string) => {
    const { message } = await reset(username);
    setMsg(message)
    setTimeout(() => {
      setMsg('')
    }, 1500)
  }

  return (
    <>
      <span className="info">{ msg }</span>
      <p>
        👋 Olá {user.name}!
      </p>
      {user.secretFriend && user.helper && (
        <div className="users assignment">
          <div className={classes('secretFriend')} onClick={() => reveal('secretFriend')}>
            <div className="envelope-back"></div>
            <UserItem user={user.secretFriend} />
            <div className="envelope-front"></div>
            <div className="envelope-flap"></div>
            <div className="label">Amigo Secreto</div>
          </div>
          <div className={classes('helper')} onClick={() => reveal('helper')}>
            <div className="envelope-back"></div>
            <UserItem user={user.helper} />
            <div className="envelope-front"></div>
            <div className="envelope-flap"></div>
            <div className="label">Ajudante</div>
          </div>
        </div>
      )}
      <div className="users">
        <h2>
          Participantes
        </h2>
        {users.map((user, i) => (
          <>
            <UserItem key={i} user={user} />
            {isAdmin && <button onClick={() => onReset(user)}>
              Reset pasword
            </button>}
          </>
        ))}
      </div>
      {isAdmin && <AdminPanel status={user.status} />}
      <button onClick={onLogout}>
        Sair
      </button>
    </>
  )
}

export default Home