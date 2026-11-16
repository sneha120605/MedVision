import {
  Activity,
  BarChart3,
  Bookmark,
  Brain,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  FileClock,
  FileImage,
  FileText,
  FolderSearch,
  HeartHandshake,
  LayoutDashboard,
  Menu,
  Microscope,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import './Portal.css';

const portalNavigation = {
  patient: [
    { group: 'WORKSPACE', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'upload-mri', label: 'Upload MRI', icon: FileImage },
      { id: 'image-analysis', label: 'Image analysis', icon: ScanLine },
      { id: 'analysis-results', label: 'Analysis results', icon: Brain },
      { id: 'analysis-history', label: 'Analysis history', icon: FileClock },
      { id: 'previous-reports', label: 'Previous reports', icon: FileText },
    ] },
    { group: 'YOUR ACCOUNT', items: [
      { id: 'research-consent', label: 'Research & consent', icon: HeartHandshake },
      { id: 'profile', label: 'Profile', icon: UserRound },
      { id: 'settings', label: 'Settings', icon: Settings },
    ] },
  ],
  researcher: [
    { group: 'RESEARCH', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'overview', label: 'Research overview', icon: BarChart3 },
      { id: 'approved-dataset', label: 'Approved dataset', icon: ShieldCheck },
      { id: 'case-explorer', label: 'Case explorer', icon: FolderSearch },
      { id: 'similar-cases', label: 'Similar cases', icon: Search },
      { id: 'mri-comparison', label: 'MRI comparison', icon: ScanLine },
      { id: 'research-analytics', label: 'Research analytics', icon: ChartNoAxesCombined },
      { id: 'saved-cases', label: 'Saved cases', icon: Bookmark },
    ] },
    { group: 'YOUR ACCOUNT', items: [
      { id: 'profile', label: 'Profile', icon: UserRound },
      { id: 'settings', label: 'Settings', icon: Settings },
    ] },
  ],
};

const pageTitles = {
  dashboard: 'Dashboard',
  'upload-mri': 'Upload MRI',
  'image-analysis': 'Image analysis',
  'analysis-results': 'Analysis results',
  'analysis-history': 'Analysis history',
  'previous-reports': 'Previous reports',
  'research-consent': 'Research participation & consent',
  overview: 'Research overview',
  'approved-dataset': 'Approved research dataset',
  'case-explorer': 'Research case explorer',
  'similar-cases': 'Similar case explorer',
  'mri-comparison': 'MRI image comparison',
  'research-analytics': 'Research analytics',
  'saved-cases': 'Saved cases',
  profile: 'Profile',
  settings: 'Settings',
};

export default function PortalLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const roleName = role === 'patient' ? 'Patient portal' : 'Researcher portal';
  const basePath = `/${role}`;
  const currentPage = location.pathname.split('/').filter(Boolean).at(-1) || 'dashboard';
  const pageTitle = pageTitles[currentPage] || 'Dashboard';

  return (
    <div className={`portal-shell portal-${role}`}>
      {sidebarOpen && <button className="portal-sidebar-scrim" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`portal-sidebar ${sidebarOpen ? 'portal-sidebar-open' : ''}`}>
        <div className="portal-brand-row">
          <Link className="portal-brand" to="/">
            <span className="portal-brand-mark"><Activity size={21} strokeWidth={2.5} /></span>
            <span><strong>MedVision</strong><small>IMAGING & RESEARCH</small></span>
          </Link>
          <button className="portal-close-menu" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={19} /></button>
        </div>

        <div className={`portal-role-tag ${role}`}><span />{roleName}</div>
        <nav className="portal-nav" aria-label={`${roleName} navigation`}>
          {portalNavigation[role].map(({ group, items }) => (
            <div className="portal-nav-group" key={group}>
              <div className="portal-nav-label">{group}</div>
              {items.map(({ id, label, icon: Icon }) => {
                const to = id === 'dashboard' ? basePath : `${basePath}/${id}`;
                return (
                  <NavLink
                    key={id}
                    to={to}
                    end={id === 'dashboard'}
                    className={({ isActive }) => `portal-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="portal-sidebar-bottom">
          <div className="portal-sidebar-help"><CircleHelp size={17} /><span><strong>Need a hand?</strong><small>Explore the project guide</small></span></div>
          <Link className="portal-switch-link" to="/">Back to MedVision website</Link>
        </div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <button className="portal-menu-trigger" type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={21} /></button>
          <div className="portal-breadcrumb"><span>{roleName}</span><span className="portal-breadcrumb-separator">/</span><strong>{pageTitle}</strong></div>
          <div className="portal-topbar-actions">
            <span className="portal-demo-indicator"><span /> Demo workspace</span>
            <Link className="portal-help-button" to="/contact" aria-label="Contact MedVision project team"><CircleHelp size={18} /></Link>
            <div className={`portal-avatar ${role}`} aria-hidden="true">{role === 'patient' ? 'P' : <Microscope size={17} />}</div>
            <span className="portal-account-label">{role === 'patient' ? 'Patient account' : 'Research account'}</span>
            <ChevronDown size={15} className="portal-account-chevron" />
          </div>
        </header>

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
