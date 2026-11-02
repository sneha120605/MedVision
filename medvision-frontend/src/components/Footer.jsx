import { Activity, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="public-footer">
      <div className="public-footer-inner">
        <div>
          <Link className="footer-brand" to="/"><Activity size={18} /> MedVision</Link>
          <p>Medical information, explained with care.</p>
        </div>
        <div className="footer-links">
          <Link to="/about"><ShieldCheck size={15} /> Responsible use</Link>
          <Link to="/contact"><Mail size={15} /> Contact the project</Link>
        </div>
        <p className="footer-disclaimer">Educational and research prototype. Not a diagnostic service.</p>
      </div>
    </footer>
  );
}
