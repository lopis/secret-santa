import { useState } from 'react'
import { useCookies } from 'react-cookie';

import './App.css'
import Login, { User } from './pages/Login';
import Loading from './pages/Loading';
import Home from './pages/Home';
import { login } from './api';

function App() {
  const [state, setState] = useState({ loading: true, user: {}, users: [] as string[]});
  const [cookies,, removeCookie] = useCookies(['authToken']);
  const [isTransitioning, setTransitioninig] = useState(true);
  const { loading, users } = state
  const user: User = state.user

  if (loading) {
    if (cookies.authToken) {
      login({authToken: cookies.authToken}).then(async (response) => {
        const json = await response.json()
        if (response.ok && json.user) {
          const { users = [], user } = json
          setState({ ...state, user, users, loading: false })
          setTimeout(() => {
            setTransitioninig(false)
          }, 200);
        } else {
          setTransitioninig(false)
          removeCookie('authToken')
          setState({ ...state, loading: false })
        }
      });
    } else {
      setState({ ...state, loading: false })
      setTimeout(() => {
        setTransitioninig(false)
      }, 200);
    }
  }

  const onLogin = (user: User, users: string[]) => {
    setTransitioninig(true)
    
    setTimeout(() => {
      setTransitioninig(false)
      setState({ ...state, user, users })
    }, 100);
  }

  const onLogout = () => {
    setTransitioninig(true)
    setTimeout(() => {
      setTransitioninig(false)
      removeCookie('authToken')
      setState({
        user: {},
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
          { user.name && (
            <Home user={user} users={users} onLogout={onLogout}/>
          )}
          { !user.name && (
            <Login onLogin={onLogin} />
          )}
        </div>
      )}
    </>
  )
}

export default App
