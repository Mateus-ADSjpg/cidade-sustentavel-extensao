import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Leaf } from 'lucide-react'

const LINKS = [
  ['/', 'Início'],
  ['/sobre', 'Sobre'],
  ['/timeline', 'Guia'],
  ['/projeto', 'Questionário'],
]

export default function Layout() {
  const { pathname } = useLocation()

  // Volta ao topo a cada troca de página
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <span className="brand-mark"><Leaf size={16} /></span>
            Cidade Sustentável
          </Link>
          <nav className="nav" aria-label="Principal">
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>Cidade Sustentável · Projeto de extensão em sustentabilidade urbana</p>
          <p className="muted">Recriado com novo design a partir do projeto original de MAGGZS.</p>
        </div>
      </footer>
    </div>
  )
}
