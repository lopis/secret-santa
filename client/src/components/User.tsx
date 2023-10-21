import './User.css'

interface UserProps {
  user: string
}

function User ({ user }: UserProps) {
  return <div className="user">
    {user}
  </div>
}

export default User