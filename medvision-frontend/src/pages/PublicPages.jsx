import { ArrowRight, Brain, Check, FileImage, HeartHandshake, LockKeyhole, Microscope, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const featureCards = [
  { icon: Brain, title: 'Brain MRI first', text: 'A focused first imaging workflow, with future scope for chest and bone X-ray research.' },
  { icon: HeartHandshake, title: 'Consent-led research', text: 'Research access is designed around explicit patient participation and a clear permission boundary.' },
  { icon: ShieldCheck, title: 'De-identified by design', text: 'Research views are intended to contain only authorized, de-identified case information.' },
  { icon: FileImage, title: 'Understandable analysis', text: 'Image previews, model output, and limitations each have a distinct place in the future workflow.' },
];

export function FeaturesPage() {
  return (
    <div className="public-info-page">
      <header className="public-info-hero"><span className="home-kicker">PLATFORM FEATURES</span><h1>Built for clarity, care, and responsible research.</h1><p>MedVision brings patient-facing imaging tools and researcher workflows together, while keeping their data access boundaries distinct.</p><Link className="home-button primary" to="/register">Choose your workspace <ArrowRight size={16} /></Link></header>
      <div className="public-feature-list">{featureCards.map(({ icon: Icon, title, text }) => <article className="public-feature-item" key={title}><span><Icon size={22} /></span><div><h2>{title}</h2><p>{text}</p></div><Check size={17} /></article>)}</div>
      <div className="public-info-callout"><LockKeyhole size={20} /><p><strong>Privacy principle:</strong> Researcher screens must not show names, contact details, addresses, or other direct identifiers. This frontend illustrates the intended workflow only; actual consent verification and access control belong in a secure backend.</p></div>
    </div>
  );
}

export function HowItWorksPage() {
  const steps = [
    ['01', 'Patients stay in control', 'Patients can review the research participation information and manage their choice independently from image analysis.'],
    ['02', 'Cases require authorization', 'Only data with explicit research consent and appropriate de-identification is intended to enter the researcher workspace.'],
    ['03', 'Researchers explore responsibly', 'Authorized research interfaces can support case exploration and comparison without exposing patient identity.'],
    ['04', 'Outputs remain transparent', 'Analysis findings, confidence, and visual overlays will appear only when a validated model is connected.'],
  ];

  return (
    <div className="public-info-page">
      <header className="public-info-hero"><span className="home-kicker">HOW IT WORKS</span><h1>A careful path from imaging to research.</h1><p>A proposed, privacy-first workflow for the future MedVision platform. The current website is a frontend demonstration; it does not process or authorize real data.</p></header>
      <div className="how-steps">{steps.map(([number, title, text]) => <article className="how-step" key={number}><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></article>)}</div>
      <div className="public-info-callout"><Microscope size={20} /><p><strong>Current focus:</strong> Brain MRI analysis. Chest X-rays and bone X-rays are future-scope categories and are not represented as available analysis today.</p></div>
    </div>
  );
}
