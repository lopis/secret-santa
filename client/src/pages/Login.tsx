import { ChangeEvent, useState, FormEvent } from 'react'
import { useCookies } from 'react-cookie';

const LOGIN = 'http://localhost:3000/login'

interface LoginProps {
  onLogin: (username: string) => void
}

function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState({ username: '', password: '', error: '', authToken: '' });
  const [cookies, setCookie] = useCookies(['authToken']);

  const handleInputChange = (event: ChangeEvent) => {
    const { name, value } = event.target as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();
  
      if (response.ok) {
        setCookie('authToken', json.authToken)
        onLogin(json.username)
      } else {
        setFormData({ ...formData, error: json.message });
      }
    } catch (error) {
      console.error(error);
      
      setFormData({ ...formData, error: (error as Error).message });
    }
  }

  return (
    <>
      <div className="card">
        <div>{ formData.error }</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="username"
              placeholder="exemplo: joaquim"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Palavra passe</label>
            <input
              type="password"
              name="password"
              placeholder="exemplo: broasdemel"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <input type="hidden" name="authToken" value={cookies.authToken} />
          <button type="submit">
            Entrar
          </button>
        </form>
      </div>
    </>
  )
}

export default Login
