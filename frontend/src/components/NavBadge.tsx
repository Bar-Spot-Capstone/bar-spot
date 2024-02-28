interface Props{
    isLoggedIn: boolean
}

const NavBadge = ({isLoggedIn}:Props) => {
  if (isLoggedIn == true) {
    return <p> Logged in as ...</p>
  } else {
    return <button>Login</button>
  }
}

export default NavBadge
