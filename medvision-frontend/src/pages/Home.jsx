import {
  ArrowRight, Brain, CheckCircle2, FileImage, FileText, HelpCircle,
  LockKeyhole, MessageCircleQuestion, Microscope, ShieldCheck, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import './Home.css';

const steps = [
  ['01', 'Choose a starting point', 'Explore an image workflow, learn a report term, or browse the medical library.'],
  ['02', 'Understand the context', 'Review plain-language explanations and the limitations behind each type of information.'],
  ['03', 'Ask better questions', 'Use what you learn to prepare informed conversations with a qualified healthcare professional.'],
];

const faqs = [
  ['Does MedVision diagnose conditions?', 'No. MedVision is an educational and research prototype. It does not diagnose conditions, recommend treatment, or replace professional care.'],
  ['Can I upload a private medical record?', 'Please do not upload sensitive records. Current uploads are only local browser previews or temporary session lists, and no secure patient storage is connected.'],
  ['What does explainable machine learning mean?', 'It means presenting the reasoning context, uncertainty, data limitations, and evaluation measures around a model rather than presenting an unexplained answer.'],
  ['Where should I go for medical advice?', 'Speak with a licensed healthcare professional who can consider your symptoms, history, examination, and appropriate tests. Seek local emergency help for urgent symptoms.'],
];

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <div className="home-eyebrow"><Sparkles size={15} /> AI-powered imaging research, with care</div>
          <h1>Medical imaging research, built around people.</h1>
          <p>MedVision is a privacy-first platform concept for brain MRI analysis and consent-based research — bringing patients and researchers together through clear, responsible workflows.</p>
          <div className="home-hero-actions">
            <Link className="home-button primary" to="/register">Explore the platform <ArrowRight size={17} /></Link>
            <Link className="home-button secondary" to="/how-it-works">How MedVision works</Link>
          </div>
          <div className="home-trust-note"><ShieldCheck size={17} /> Frontend demonstration only — not a diagnostic service.</div>
        </div>
        <div className="home-hero-visual" aria-label="Illustration of connected medical information" role="img">
          <div className="home-visual-ring ring-one" /><div className="home-visual-ring ring-two" />
          <div className="home-visual-core"><Microscope size={58} /><span>Evidence<br />& context</span></div>
          <span className="home-visual-pill pill-one">Images</span>
          <span className="home-visual-pill pill-two">Reports</span>
          <span className="home-visual-pill pill-three">Learning</span>
        </div>
      </section>

      <section className="home-section problem-section">
        <div className="home-section-heading"><span className="home-kicker">The challenge</span><h2>Medical information can be difficult to navigate alone.</h2></div>
        <div className="problem-copy"><p>Imaging terms, clinical report language, and model metrics often carry important context that is easy to miss. MedVision brings these topics together in one calm, structured space so learners can understand the concepts before making decisions.</p><div className="home-callout"><MessageCircleQuestion size={22} /><span>Clarity supports better conversations. It never replaces clinical judgement.</span></div></div>
      </section>

      <section className="home-section">
        <div className="home-section-heading centered"><span className="home-kicker">Explore MedVision</span><h2>A focused workspace for learning and research.</h2><p>Each area has a clear purpose and makes its limitations visible.</p></div>
        <div className="home-feature-grid">
          <FeatureCard icon={FileImage} title="Medical image analysis" description="Preview the upload workflow and learn how image analysis projects are structured without generating a medical prediction." path="/image-analysis" label="Explore image workflow" tone="blue" />
          <FeatureCard icon={FileText} title="Report explainer" description="Look up common imaging and research terms in plain language, with context about what a definition can and cannot tell you." path="/report-explainer" label="Browse terminology" tone="purple" />
          <FeatureCard icon={Brain} title="Model insights" description="Understand evaluation measures, uncertainty, and why responsible machine learning requires more than one score." path="/model-insights" label="Learn about evaluation" tone="orange" />
          <FeatureCard icon={Microscope} title="Medical library" description="Build a foundation in medical imaging, machine learning, and responsible use through concise educational topics." path="/medical-library" label="Visit the library" tone="green" />
        </div>
      </section>

      <section className="home-section workflow-section">
        <div className="home-section-heading"><span className="home-kicker">A thoughtful workflow</span><h2>Start with curiosity. Leave with better context.</h2><p>MedVision is designed to support learning, not to make decisions on your behalf.</p></div>
        <div className="workflow-grid">{steps.map(([number, title, text]) => <article className="workflow-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="home-section explainer-section">
        <div className="explainer-panel"><div className="explainer-icon"><Brain size={28} /></div><div><span className="home-kicker">Explainable machine learning</span><h2>A model output is not the whole story.</h2><p>Responsible analysis asks what data was used, how a model was evaluated, where uncertainty remains, and how a result should be interpreted. MedVision introduces these ideas without presenting invented accuracy claims or clinical validation.</p><Link className="home-text-link" to="/model-insights">Explore model insights <ArrowRight size={16} /></Link></div></div>
        <div className="home-image-report"><div><FileImage size={20} /><strong>Image context</strong><span>Inputs, quality, and limitations matter.</span></div><div><FileText size={20} /><strong>Report context</strong><span>Words need clinical context to be meaningful.</span></div></div>
      </section>

      <section className="home-section privacy-section">
        <div className="privacy-copy"><span className="home-kicker">Privacy & responsible use</span><h2>Trust starts with boundaries.</h2><p>Current features are designed for learning and frontend exploration. Avoid uploading identifiable health information; the prototype does not provide secure patient storage or clinical services.</p><Link className="home-text-link" to="/about">Read our project principles <ArrowRight size={16} /></Link></div>
        <div className="privacy-points"><div><LockKeyhole size={20} /><span><strong>Data minimisation</strong>Share only what is necessary for your learning task.</span></div><div><ShieldCheck size={20} /><span><strong>Visible limitations</strong>Uncertainty and scope are part of the explanation.</span></div><div><CheckCircle2 size={20} /><span><strong>Human oversight</strong>Qualified professionals remain essential for care.</span></div></div>
      </section>

      <section className="home-section portal-entry-section">
        <div className="home-section-heading centered"><span className="home-kicker">Choose your workspace</span><h2>One platform. Two thoughtful experiences.</h2><p>Start with a patient-focused imaging workspace or explore the research portal demo.</p></div>
        <div className="portal-entry-grid">
          <article className="portal-entry-card"><span><FileImage size={22} /></span><div><h3>Patient portal</h3><p>Preview MRI uploads, analysis status, reports, and optional research participation.</p></div><Link to="/login?role=patient">Explore patient demo <ArrowRight size={15} /></Link></article>
          <article className="portal-entry-card researcher"><span><Microscope size={22} /></span><div><h3>Researcher portal</h3><p>Explore a privacy-first interface for approved, de-identified research cases.</p></div><Link to="/login?role=researcher">Explore researcher demo <ArrowRight size={15} /></Link></article>
        </div>
        <div className="home-focus-note"><Brain size={18} /><span><strong>Initial focus: Brain MRI.</strong> Chest X-rays and bone X-rays are future-scope categories, not currently available analyses.</span></div>
      </section>

      <section className="home-section faq-section"><div className="home-section-heading centered"><span className="home-kicker">Questions, answered</span><h2>What MedVision is — and is not.</h2></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary><span>{question}</span><HelpCircle size={18} /></summary><p>{answer}</p></details>)}</div></section>

      <section className="home-disclaimer"><ShieldCheck size={26} /><div><strong>Important medical disclaimer</strong><p>MedVision provides general educational information and research demonstrations. It does not diagnose disease, interpret an individual scan or report, recommend treatment, or provide emergency advice. Always consult a qualified healthcare professional for personal medical guidance.</p></div></section>
    </div>
  );
}
