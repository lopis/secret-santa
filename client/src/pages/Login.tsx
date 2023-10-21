import { ChangeEvent, useState, FormEvent } from 'react'
import { useCookies } from 'react-cookie';
import { login } from '../api';

interface LoginProps {
  onLogin: (username: string, users: string[]) => void
}

function Login({ onLogin }: LoginProps) {
  const [cookies, setCookie] = useCookies(['authToken']);
  const [state, setState] = useState({
    username: '',
    password: '',
    error: '',
  });
  const [active, setActive] = useState(false)

  const handleInputChange = (event: ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setActive(true);

    try {
      const response = await login(state);

      const json = await response.json();
  
      setTimeout(() => {
        setActive(false);
      }, 250);
      if (response.ok) {
        setTimeout(() => {
          setCookie('authToken', json.authToken)
          onLogin(json.username, json.users)
        }, 500);
      } else {
        setActive(false);
        setCookie('authToken', undefined)
        setState({ ...state, error: json.message });
      }
    } catch (error) {
      setActive(false);
      setState({ ...state, error: (error as Error).message });
    }
  }

  return (
    <>
      <div className="card">
        <span className="error">{ state.error }</span>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="username"
              placeholder="exemplo: joaquim"
              value={state.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Palavra passe</label>
            <input
              type="password"
              name="password"
              placeholder="exemplo: broasdemel"
              value={state.password}
              onChange={handleInputChange}
            />
          </div>
          <input type="hidden" name="authToken" value={cookies.authToken} />
          <button type="submit" className={active ? 'active' : undefined} disabled={active}>
            Entrar
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
