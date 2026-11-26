
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Brain,
  CheckCircle2,
  LockKeyhole,
  Microscope,
  ShieldCheck,
  UserRound,
  Mail,
  KeyRound
} from 'lucide-react';

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:8000';

export default function AuthPages({ mode }) {
  const [searchParams] = useSearchParams();

  const [role, setRole] = useState(
    () => searchParams.get('role') === 'researcher'
      ? 'researcher'
      : 'patient'
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // OTP verification states
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  const navigate = useNavigate();
  const isRegister = mode === 'register';

  // ---------------------------------------
  // 1. REGISTRATION FORM SUBMISSION
  // ---------------------------------------

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(form);

    const data = {
      email: formData.get('email').trim(),
      password: formData.get('password')
    };

    if (isRegister) {
      data.name = formData.get('name').trim();

      if (role === 'researcher') {
        data.institution =
          formData.get('institution')?.trim() || null;
      }
    }

    try {
      if (!isRegister) {
        setError(
          'Login API is not connected yet. Registration is available.'
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/register/${role}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || 'Registration failed. Please try again.'
        );
      }

      // Backend has sent OTP
      if (result.otp_sent) {
        setPendingEmail(result.email);
        setOtp('');
        setOtpStep(true);

        setSuccess('Verification OTP sent successfully!');
        return;
      }

      throw new Error('OTP could not be sent. Please try again.');

    } catch (err) {
      setError(
        err.message || 'Unable to connect to the server.'
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------
  // 2. VERIFY OTP
  // ---------------------------------------

  async function handleVerifyOTP(event) {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `${API_URL}/verify-registration-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            email: pendingEmail,
            otp: otp
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || 'OTP verification failed.'
        );
      }

      if (!result.email_verified) {
        throw new Error('Email verification was unsuccessful.');
      }

      setSuccess(
        'Email verified! Your account has been created successfully.'
      );

      setTimeout(() => {
        navigate(`/${result.role}`);
      }, 1500);

    } catch (err) {
      setError(
        err.message || 'Unable to verify OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------
  // 3. MAIN UI
  // ---------------------------------------

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}

      <section className="auth-story">

        <Link className="auth-back-link" to="/">
          <ArrowLeft size={16} /> Back to MedVision
        </Link>

        <Link className="auth-brand" to="/">
          <span><Activity size={21} /></span>
          MedVision
        </Link>

        <div className="auth-story-content">

          <div className="auth-story-icon">
            <Brain size={28} />
          </div>

          <p className="auth-eyebrow">
            MEDICAL IMAGING, WITH PURPOSE
          </p>

          <h1>A thoughtful workspace for better research.</h1>

          <p className="auth-story-copy">
            Explore a privacy-first medical imaging platform
            concept, designed around clear patient choice
            and responsible research.
          </p>

          <div className="auth-story-points">

            <div>
              <ShieldCheck size={18} />
              <span>Consent-led research access</span>
            </div>

            <div>
              <LockKeyhole size={18} />
              <span>Privacy boundaries built into the experience</span>
            </div>

            <div>
              <CheckCircle2 size={18} />
              <span>Secure account registration</span>
            </div>

          </div>

        </div>

        <p className="auth-story-footer">
          Educational and research prototype · Not a diagnostic service
        </p>

      </section>


      {/* RIGHT SIDE */}

      <section className="auth-form-side">

        <div className="auth-form-wrap">

          <div className="auth-mobile-brand">
            <Activity size={20} /> MedVision
          </div>


          {/* OTP VERIFICATION SCREEN */}

          {isRegister && otpStep ? (

            <>

              <div className="auth-form-heading">

                <div className="auth-story-icon">
                  <Mail size={25} />
                </div>

                <p className="auth-eyebrow">
                  EMAIL VERIFICATION
                </p>

                <h2>Verify your email address</h2>

                <p>
                  We've sent a 6-digit verification code to
                  your registered email address.
                </p>

              </div>


              <div className="auth-demo-note">
                <ShieldCheck size={17} />

                <span>
                  <strong>Check your inbox.</strong>
                  {' '}Your OTP is valid for 5 minutes.
                </span>
              </div>


              <div className="auth-form">

                <label>
                  Email address

                  <input
                    type="email"
                    value={pendingEmail}
                    readOnly
                  />
                </label>

                <form onSubmit={handleVerifyOTP}>

                  <label>
                    Enter 6-digit OTP

                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="Enter your OTP"
                      value={otp}
                      onChange={(event) => {
                        const value = event.target.value
                          .replace(/\D/g, '')
                          .slice(0, 6);

                        setOtp(value);
                      }}
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                    />
                  </label>


                  {error && (
                    <p className="auth-error" role="alert">
                      {error}
                    </p>
                  )}

                  {success && (
                    <p className="auth-success" role="status">
                      <CheckCircle2 size={19} />
                      {success}
                    </p>
                  )}


                  <button
                    className="auth-submit"
                    type="submit"
                    disabled={loading || otp.length !== 6}
                  >
                    {loading
                      ? 'Verifying...'
                      : 'Verify OTP'}

                    <ArrowRight size={17} />
                  </button>

                </form>

                <button
                  type="button"
                  className="auth-back-link"
                  style={{
                    marginTop: '20px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setOtpStep(false);
                    setOtp('');
                    setError('');
                    setSuccess('');
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to registration
                </button>

              </div>

            </>

          ) : (

            /* REGISTRATION / LOGIN SCREEN */

            <>

              <div className="auth-form-heading">

                <p className="auth-eyebrow">
                  {isRegister ? 'GET STARTED' : 'WELCOME BACK'}
                </p>

                <h2>
                  {isRegister
                    ? 'Create your workspace'
                    : 'Sign in to MedVision'}
                </h2>

                <p>
                  {isRegister
                    ? 'Choose how you plan to use the platform.'
                    : 'Select your account type to continue.'}
                </p>

              </div>


              <div
                className="auth-role-picker"
                role="group"
                aria-label="Choose account type"
              >

                <button
                  type="button"
                  className={role === 'patient' ? 'selected' : ''}
                  onClick={() => {
                    setRole('patient');
                    setError('');
                    setSuccess('');
                  }}
                >
                  <UserRound size={18} />

                  <span>
                    <strong>Patient</strong>
                    <small>Manage your imaging journey</small>
                  </span>
                </button>


                <button
                  type="button"
                  className={role === 'researcher' ? 'selected' : ''}
                  onClick={() => {
                    setRole('researcher');
                    setError('');
                    setSuccess('');
                  }}
                >
                  <Microscope size={18} />

                  <span>
                    <strong>Researcher</strong>
                    <small>Explore approved research</small>
                  </span>
                </button>

              </div>


              <div className="auth-demo-note">
                <ShieldCheck size={17} />

                <span>
                  <strong>Secure registration.</strong>
                  {' '}Your account details will be saved according
                  to your selected role.
                </span>
              </div>


              <form className="auth-form" onSubmit={handleSubmit}>

                {isRegister && (
                  <label>
                    {role === 'patient'
                      ? 'Your name'
                      : 'Researcher name'}

                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Enter your name"
                      required
                    />
                  </label>
                )}


                <label>
                  Email address

                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>


                {isRegister && role === 'researcher' && (
                  <label>
                    Research institution
                    <span className="auth-optional">(optional)</span>

                    <input
                      type="text"
                      name="institution"
                      autoComplete="organization"
                      placeholder="Institution or research group"
                    />
                  </label>
                )}


                <label>
                  Password

                  <input
                    type="password"
                    name="password"
                    autoComplete={
                      isRegister ? 'new-password' : 'current-password'
                    }
                    placeholder="Enter your password"
                    minLength={isRegister ? 8 : 6}
                    required
                  />
                </label>


                {isRegister && role === 'patient' && (
                  <p className="auth-consent-note">
                    <LockKeyhole size={15} />
                    Research participation is optional and managed
                    separately. Creating an account does not grant
                    research access.
                  </p>
                )}


                {error && (
                  <p className="auth-error" role="alert">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="auth-success" role="status">
                    <CheckCircle2 size={19} />
                    {success}
                  </p>
                )}


                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? 'Please wait...'
                    : isRegister
                      ? `Create ${role} account`
                      : `Continue as ${role}`}

                  <ArrowRight size={17} />
                </button>

              </form>


              <p className="auth-switch">
                {isRegister
                  ? 'Already have an account?'
                  : 'New to MedVision?'}

                {' '}

                <Link to={isRegister ? '/login' : '/register'}>
                  {isRegister ? 'Sign in' : 'Create an account'}
                </Link>
              </p>


              <p className="auth-privacy-footnote">
                Do not enter real patient details or upload private
                medical images in this demonstration.
              </p>

            </>

          )}

        </div>

      </section>

    </div>
  );
}
