import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeatureCard({ icon: Icon, label, title, description, path, tone = 'blue' }) {
  return (
    <article className={`home-feature-card ${tone}`}>
      <div className="home-feature-icon"><Icon size={22} /></div>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={path} className="home-feature-link">{label} <ArrowUpRight size={16} /></Link>
    </article>
  );
}
