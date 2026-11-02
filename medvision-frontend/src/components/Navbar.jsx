import { Activity, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { label: 'Home', path: '/' },
  { label: 'Image Analysis', path: '/image-analysis' },
  { label: 'Report Explainer', path: '/report-explainer' },
  { label: 'Medical Library', path: '/medical-library' },
  { label: 'Documents', path: '/documents' },
  { label: 'Model Insights', path: '/model-insights' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-navbar">
      <div className="site-navbar-inner">
        <Link className="site-brand" to="/" onClick={() => setOpen(false)}>
          <span className="site-brand-mark"><Activity size={21} strokeWidth={2.5} /></span>
          <span>MedVision</span>
        </Link>

        <button
          className="site-menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav id="primary-navigation" className={`site-nav ${open ? 'site-nav-open' : ''}`} aria-label="Primary navigation">
          {links.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) => `site-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <Link className="site-nav-cta" to="/contact" onClick={() => setOpen(false)}>
            Contact <ArrowRight size={15} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
