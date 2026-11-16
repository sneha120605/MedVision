import { ArrowLeft, ArrowRight, Activity, Brain, CheckCircle2, LockKeyhole, Microscope, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthPages({ mode }) {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(() => searchParams.get('role') === 'researcher' ? 'researcher' : 'patient');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    window.setTimeout(() => navigate(`/${role}`), 650);
  }

  return (
    <div className="auth-page">
      <section className="auth-story">
        <Link className="auth-back-link" to="/"><ArrowLeft size={16} /> Back to MedVision</Link>
        <Link className="auth-brand" to="/"><span><Activity size={21} /></span>MedVision</Link>
        <div className="auth-story-content">
          <div className="auth-story-icon"><Brain size={28} /></div>
          <p className="auth-eyebrow">MEDICAL IMAGING, WITH PURPOSE</p>
          <h1>A thoughtful workspace for better research.</h1>
          <p className="auth-story-copy">Explore a privacy-first medical imaging platform concept, designed around clear patient choice and responsible research.</p>
          <div className="auth-story-points">
            <div><ShieldCheck size={18} /><span>Consent-led research access</span></div>
            <div><LockKeyhole size={18} /><span>Privacy boundaries built into the experience</span></div>
            <div><CheckCircle2 size={18} /><span>Transparent, clearly labelled demo screens</span></div>
          </div>
        </div>
        <p className="auth-story-footer">Educational and research prototype · Not a diagnostic service</p>
      </section>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand"><Activity size={20} /> MedVision</div>
          <div className="auth-form-heading">
            <p className="auth-eyebrow">{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</p>
            <h2>{isRegister ? 'Create your workspace' : 'Sign in to MedVision'}</h2>
            <p>{isRegister ? 'Choose how you plan to use the platform.' : 'Select a demo workspace to continue.'}</p>
          </div>

          <div className="auth-role-picker" role="group" aria-label="Choose account type">
            <button type="button" className={role === 'patient' ? 'selected' : ''} onClick={() => setRole('patient')}>
              <UserRound size={18} /><span><strong>Patient</strong><small>Manage your imaging journey</small></span>
            </button>
            <button type="button" className={role === 'researcher' ? 'selected' : ''} onClick={() => setRole('researcher')}>
              <Microscope size={18} /><span><strong>Researcher</strong><small>Explore approved research</small></span>
            </button>
          </div>

          <div className="auth-demo-note"><ShieldCheck size={17} /><span><strong>Demo flow only.</strong> These forms do not create an account or verify access.</span></div>
          {submitted ? (
            <div className="auth-success" role="status"><CheckCircle2 size={21} /> Opening the {role} demo workspace…</div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {isRegister && (
                <label>{role === 'patient' ? 'Your name' : 'Researcher name'}
                  <input type="text" name="name" autoComplete="name" placeholder="Enter a display name" required />
                </label>
              )}
              <label>Email address
                <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
              </label>
              {isRegister && role === 'researcher' && (
                <label>Research institution <span className="auth-optional">(optional for this demo)</span>
                  <input type="text" name="institution" autoComplete="organization" placeholder="Institution or research group" />
                </label>
              )}
              <label>Password
                <input type="password" name="password" autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder="Enter any demo password" minLength="6" required />
              </label>
              {isRegister && role === 'patient' && <p className="auth-consent-note"><LockKeyhole size={15} /> Research participation is optional and managed separately. Creating a demo profile does not grant research access.</p>}
              <button className="auth-submit" type="submit">{isRegister ? `Create ${role} demo profile` : `Continue as ${role}`} <ArrowRight size={17} /></button>
            </form>
          )}

          <p className="auth-switch">{isRegister ? 'Already have a demo profile?' : 'New to MedVision?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Sign in' : 'Create an account'}</Link></p>
          <p className="auth-privacy-footnote">Do not enter real patient details or upload private medical images in this demonstration.</p>
        </div>
      </section>
    </div>
  );
}
