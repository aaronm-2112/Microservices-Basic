import Link from 'next/link'

export default ({ currentUser }) => {

  // fun fact: logical and (&&) returns expression 2 if the expression 1 is not false
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' }
  ]
    .filter(linkConfig => linkConfig) //only return the true ones
    .map(({ label, href }) => {
      return <li key={href} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label} </a>
        </Link>
      </li>
    })

  return <nav className="navbar navbar-light bg-light">
    <Link href="/">
      <a className="navbar-brand">GitTix</a>
    </Link>

    <div className="d-flex justify-content-end">
      <ul className="nav d-flex align-items-center">
        {links}
      </ul>
    </div>
  </nav>
}