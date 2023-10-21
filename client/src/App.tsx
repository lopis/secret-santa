import { useState } from 'react'
import { useCookies } from 'react-cookie';

import './App.css'
import Login from './pages/Login';
import Loading from './pages/Loading';
import Home from './pages/Home';

const LOGIN = 'http://localhost:3000/login'


function App() {
  const [state, setState] = useState({ loading: true, username: '', users: [] as string[]});
  const [cookies,, removeCookie] = useCookies(['authToken']);
  const { loading, username, users } = state

  if (loading) {
    if (cookies.authToken) {
      fetch(LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ authToken: cookies.authToken }),
      }).then(async (response) => {
        const json = await response.json()
        if (response.ok && json.username) {
          const { users = [], username } = json
          setState({ ...state, username, users, loading: false })
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
    setState({ ...state, username, users })
  }

  const onLogout = () => {
    setTimeout(() => {
      removeCookie('authToken')
      setState({
        username: '',
        users: [],
        loading: false,
      })
    }, 500);
  }

  return (
    <>
      <h1>Amigo Secreto</h1>
      { loading && <Loading /> }
      { !loading && (
        <>
          { username && (
            <Home username={username} users={users} onLogout={onLogout}/>
          )}
          { !username && (
            <Login onLogin={onLogin} />
          )}
        </>
      )}
    </>
  )
}

export default App
