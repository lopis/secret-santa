import { useState } from 'react'
import { useCookies } from 'react-cookie';

import './App.css'
import Login from './pages/Login';
import Loading from './pages/Loading';
import Home from './pages/Home';
import { login } from './api';

function App() {
  const [state, setState] = useState({ loading: true, username: '', users: [] as string[]});
  const [cookies,, removeCookie] = useCookies(['authToken']);
  const [isTransitioning, setTransitioninig] = useState(true);
  const { loading, username, users } = state

  if (loading) {
    if (cookies.authToken) {
      login({authToken: cookies.authToken}).then(async (response) => {
        const json = await response.json()
        if (response.ok && json.username) {
          const { users = [], username } = json
          setState({ ...state, username, users, loading: false })
          setTimeout(() => {
            setTransitioninig(false)
          }, 200);
        } else {
          removeCookie('authToken')
          setState({ ...state, loading: false })
        }
      });
    } else {
      setState({ ...state, loading: false })
    }
  }

  const onLogin = (username: string, users: string[]) => {
    setTransitioninig(true)
    setTimeout(() => {
      setTransitioninig(false)
      setState({ ...state, username, users })
    }, 100);
  }

  const onLogout = () => {
    setTransitioninig(true)
    setTimeout(() => {
      setTransitioninig(false)
      removeCookie('authToken')
      setState({
        username: '',
        users: [],
        loading: false,
      })
    }, 100);
  }

  return (
    <>
      <h1>Amigo Secreto</h1>
      { loading && <Loading /> }
      { !loading && (
        <div className={isTransitioning ? 'fade-out' : 'fade-in'}>
          { username && (
            <Home username={username} users={users} onLogout={onLogout}/>
          )}
          { !username && (
            <Login onLogin={onLogin} />
          )}
        </div>
      )}
    </>
  )
}

export default App
