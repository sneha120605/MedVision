import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileImage,
  FileText,
  HeartPulse,
  Info,
  LayoutDashboard,
  ShieldCheck,
  Stethoscope,
  Upload,
  X,
  BookOpen,
  ChartNoAxesCombined,
  Mail,
} from 'lucide-react';

function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="heading-action">{children}</div>}
    </div>
  );
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function WorkflowStep({ number, title, description }) {
  return (
    <div className="workflow-step">
      <span className="workflow-number">{number}</span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </div>
  );
}

function ImageAnalysisPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  function handleFile(event) {
    const chosen = event.target.files?.[0];
    setMessage('');

    if (!chosen) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(chosen.type)) {
      setMessage('Please select a JPG, PNG, or WebP image.');
      setFile(null);
      setPreview('');
      return;
    }

    if (chosen.size > 10 * 1024 * 1024) {
      setMessage('Please select an image smaller than 10 MB.');
      setFile(null);
      setPreview('');
      return;
    }

    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  return (
    <>
      <PageHeading
        eyebrow="IMAGE WORKSPACE"
        title="Medical Image Analysis"
        description="Explore the planned medical-image upload and research workflow."
      />

      <div className="disclaimer-banner">
        <ShieldCheck size={20} />
        <div>
          <strong>Research prototype — no diagnosis is generated</strong>
          <p>
            Uploading an image here only previews it in your browser.
            The machine-learning backend is not connected yet.
          </p>
        </div>
      </div>

      <div className="analysis-layout">
        <section className="panel">
          <SectionTitle
            title="Upload an image"
            description="Supported formats: JPG, PNG and WebP. Maximum size: 10 MB."
          />

          <label className="dropzone">
            {preview ? (
              <img src={preview} alt="Selected medical image preview" className="image-preview" />
            ) : (
              <>
                <div className="dropzone-icon"><Upload size={29} /></div>
                <h3>Choose an image to preview</h3>
                <p>Click below to select a file from your computer.</p>
              </>
            )}
            <span className="button button-primary">
              <FileImage size={17} /> Browse files
            </span>
            <input type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={handleFile} />
          </label>

          {message && <p className="form-error">{message}</p>}

          {file && (
            <div className="file-details">
              <FileImage size={21} />
              <div>
                <strong>{file.name}</strong>
                <span>{(file.size / 1024).toFixed(1)} KB · Preview only</span>
              </div>
              <button
                className="icon-button"
                onClick={() => {
                  URL.revokeObjectURL(preview);
                  setFile(null);
                  setPreview('');
                  setMessage('');
                }}
                aria-label="Remove selected image"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </section>

        <section className="panel workflow-panel">
          <div className="eyebrow">HOW IT WILL WORK</div>
          <h2>Analysis workflow</h2>
          <WorkflowStep number="01" title="Image upload" description="Select a supported image and check its format and size." />
          <WorkflowStep number="02" title="Image preparation" description="The future backend will prepare the image for the model." />
          <WorkflowStep number="03" title="Model evaluation" description="A connected model will process the image when implemented." />
          <WorkflowStep number="04" title="Explainable output" description="Research outputs and limitations will be presented clearly." />
        </section>
      </div>

      <section className="panel info-panel">
        <Info size={21} />
        <div>
          <h3>About supported medical images</h3>
          <p>
            The planned first research task is chest X-ray classification.
            Ordinary photographs and unrelated images are not appropriate
            medical inputs. No clinical conclusion can be drawn from this
            frontend.
          </p>
        </div>
      </section>
    </>
  );
}

function ReportExplainerPage() {
  const [term, setTerm] = useState('');
  const [selected, setSelected] = useState(null);

  const terms = [
    { name: 'Radiology', category: 'Imaging', description: 'The medical specialty that uses imaging methods to help examine the body.' },
    { name: 'Findings', category: 'Reports', description: 'The observations described by the reporting healthcare professional.' },
    { name: 'Impression', category: 'Reports', description: 'A concise summary of the main observations and their possible significance.' },
    { name: 'Contrast', category: 'Imaging', description: 'A substance sometimes used in imaging examinations to make certain structures easier to see.' },
    { name: 'Opacity', category: 'Imaging', description: 'An area that appears less transparent than surrounding regions on an image. Its meaning depends on context.' },
    { name: 'Sensitivity', category: 'Research', description: 'A model-evaluation measure describing the proportion of actual positive cases correctly identified.' },
    { name: 'Specificity', category: 'Research', description: 'A model-evaluation measure describing the proportion of actual negative cases correctly identified.' },
    { name: 'Precision', category: 'Research', description: 'The proportion of positive predictions that are correct in the evaluated dataset.' },
  ];

  const filtered = terms.filter((item) =>
    `${item.name} ${item.category} ${item.description}`.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <>
      <PageHeading
        eyebrow="LEARNING CENTRE"
        title="Medical Report Explainer"
        description="Learn the meaning of common medical and research terms in plain language."
      />

      <div className="disclaimer-banner">
        <Info size={20} />
        <div>
          <strong>Educational information only</strong>
          <p>
            These explanations provide general background. Only a qualified
            healthcare professional can interpret a report in its clinical context.
          </p>
        </div>
      </div>

      <section className="panel glossary-panel">
        <label className="search-box">
          <BookOpen size={19} />
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Search a term, e.g. findings or sensitivity..."
          />
        </label>

        <SectionTitle
          title="Medical terminology library"
          description={`${filtered.length} educational terms`}
        />

        <div className="term-grid">
          {filtered.map((item) => (
            <button
              className={`term-card ${selected?.name === item.name ? 'term-selected' : ''}`}
              key={item.name}
              onClick={() => setSelected(selected?.name === item.name ? null : item)}
            >
              <span className="term-category">{item.category}</span>
              <strong>{item.name}</strong>
              <span className="term-open">
                {selected?.name === item.name ? 'Close explanation' : 'View explanation'}
                <ChevronRight size={15} />
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <BookOpen size={30} />
            <h3>No matching terms</h3>
            <p>Try a different search word.</p>
          </div>
        )}

        {selected && (
          <div className="term-explanation">
            <div className="feature-icon purple"><BookOpen size={22} /></div>
            <div>
              <div className="eyebrow">PLAIN-LANGUAGE EXPLANATION</div>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
              <span className="small-muted">
                This general definition is not an interpretation of an individual report.
              </span>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);

  function handleFiles(event) {
    const files = Array.from(event.target.files || []);
    const next = files.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      name: file.name,
      size: file.size,
      type: file.type || 'Unknown file type',
    }));

    setDocuments((previous) => [...previous, ...next]);
    event.target.value = '';
  }

  return (
    <>
      <PageHeading
        eyebrow="PERSONAL WORKSPACE"
        title="My Documents"
        description="A local session-based interface for exploring document organisation."
      >
        <label className="button button-primary">
          <Upload size={17} /> Add documents
          <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" hidden onChange={handleFiles} />
        </label>
      </PageHeading>

      <div className="disclaimer-banner">
        <ShieldCheck size={20} />
        <div>
          <strong>Privacy notice</strong>
          <p>
            Selected filenames are kept in this page's temporary state.
            No secure account, database, or cloud document storage is connected yet.
            Avoid uploading sensitive personal medical records.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Files in this session" value={documents.length} icon={FileText} />
        <StatCard label="Storage connection" value="Not connected" icon={ShieldCheck} />
        <StatCard label="Cloud backup" value="Not enabled" icon={ClipboardList} />
      </div>

      <section className="panel documents-panel">
        <SectionTitle
          title="Your document list"
          description="Files selected during the current browser session."
        />

        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FileText size={31} /></div>
            <h3>No documents added yet</h3>
            <p>
              Choose a document to see its filename listed here.
              This demonstration does not upload it to a server.
            </p>
            <label className="button button-secondary">
              Select files <ArrowRight size={16} />
              <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp" hidden onChange={handleFiles} />
            </label>
          </div>
        ) : (
          <div className="document-list">
            {documents.map((document) => (
              <div className="document-row" key={document.id}>
                <div className="document-icon"><FileText size={22} /></div>
                <div className="document-info">
                  <strong>{document.name}</strong>
                  <span>{document.type} · {(document.size / 1024).toFixed(1)} KB</span>
                </div>
                <span className="local-badge">Local session</span>
                <button
                  className="icon-button"
                  aria-label={`Remove ${document.name}`}
                  onClick={() => setDocuments((items) => items.filter((item) => item.id !== document.id))}
                >
                  <X size={17} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon"><Icon size={20} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ModelInsightsPage() {
  const metrics = [
    { name: 'Accuracy', description: 'How often predictions are correct across all evaluated examples.' },
    { name: 'Precision', description: 'How often positive predictions are correct in the evaluation dataset.' },
    { name: 'Recall', description: 'How many actual positive examples are identified by the model.' },
    { name: 'F1 score', description: 'A combined measure of precision and recall.' },
  ];

  return (
    <>
      <PageHeading
        eyebrow="MACHINE-LEARNING RESEARCH"
        title="Model Insights"
        description="Learn how a medical image classification model should be evaluated."
      />

      <div className="disclaimer-banner">
        <Info size={20} />
        <div>
          <strong>Evaluation metrics are not clinical guarantees</strong>
          <p>
            This page explains research concepts. No model has been trained or
            evaluated in this initial frontend, so no performance results are claimed.
          </p>
        </div>
      </div>

      <div className="stats-grid metrics-grid">
        {metrics.map((metric, index) => (
          <div className="metric-card" key={metric.name}>
            <span className="metric-index">0{index + 1}</span>
            <h3>{metric.name}</h3>
            <p>{metric.description}</p>
          </div>
        ))}
      </div>

      <section className="panel evaluation-panel">
        <SectionTitle
          title="Planned evaluation dashboard"
          description="The following components can be populated after model training."
        />

        <div className="evaluation-grid">
          <div className="evaluation-placeholder">
            <ChartNoAxesCombined size={29} />
            <h3>Performance charts</h3>
            <p>Compare training and validation metrics.</p>
            <span>Awaiting evaluation data</span>
          </div>
          <div className="evaluation-placeholder">
            <LayoutDashboard size={29} />
            <h3>Confusion matrix</h3>
            <p>Inspect correct and incorrect classifications.</p>
            <span>Awaiting evaluation data</span>
          </div>
          <div className="evaluation-placeholder">
            <Brain size={29} />
            <h3>Model comparison</h3>
            <p>Compare a baseline with a transfer-learning model.</p>
            <span>Awaiting evaluation data</span>
          </div>
        </div>
      </section>

      <section className="panel info-panel">
        <BookOpen size={22} />
        <div>
          <h3>Why use more than accuracy?</h3>
          <p>
            Medical datasets may have imbalanced classes. Precision, recall,
            specificity, F1 score, class-level results and external validation
            provide additional context. Performance on a research dataset does
            not establish real-world clinical safety.
          </p>
        </div>
      </section>
    </>
  );
}

function MedicalLibraryPage() {
  const resources = [
    {
      icon: BookOpen,
      title: 'Understanding medical imaging',
      description: 'Learn the general purpose of X-rays and how medical imaging is used in healthcare.',
      category: 'IMAGING BASICS',
    },
    {
      icon: Brain,
      title: 'Introduction to machine learning',
      description: 'Explore datasets, training, validation, testing and model generalisation.',
      category: 'ML FUNDAMENTALS',
    },
    {
      icon: ChartNoAxesCombined,
      title: 'Evaluating classification models',
      description: 'Understand confusion matrices, precision, recall, specificity and F1 score.',
      category: 'MODEL EVALUATION',
    },
    {
      icon: ShieldCheck,
      title: 'Responsible use of health information',
      description: 'Learn about privacy, uncertainty, data quality and the limits of automated tools.',
      category: 'RESPONSIBLE RESEARCH',
    },
  ];

  return (
    <>
      <PageHeading
        eyebrow="KNOWLEDGE CENTRE"
        title="Medical Library"
        description="Explore introductory learning resources for medical imaging and machine learning."
      />

      <div className="library-intro">
        <div className="library-intro-icon"><BookOpen size={32} /></div>
        <div>
          <h2>Learn the concepts behind the project</h2>
          <p>
            These learning cards introduce the topics the MedVision project
            explores. They are educational summaries, not personal medical advice.
          </p>
        </div>
      </div>

      <div className="library-grid">
        {resources.map(({ icon: Icon, title, description, category }) => (
          <article className="library-card" key={title}>
            <div className="feature-icon blue"><Icon size={23} /></div>
            <span className="eyebrow">{category}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="library-footer">
              <span>Learning resource</span>
              <CheckCircle2 size={17} />
            </div>
          </article>
        ))}
      </div>

      <section className="panel info-panel">
        <Info size={22} />
        <div>
          <h3>Using this library</h3>
          <p>
            The cards provide a starting point for learning. The full project
            can later include reviewed references, a search function and
            additional explanations.
          </p>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  const principles = [
    ['Transparency', 'Clearly explain what the system does and what it cannot do.'],
    ['Responsible research', 'Evaluate models using appropriate datasets and metrics.'],
    ['Privacy awareness', 'Avoid unnecessary collection of sensitive health information.'],
    ['Accessible design', 'Present technical concepts in a clear, understandable interface.'],
  ];

  return (
    <>
      <PageHeading
        eyebrow="ABOUT MEDVISION"
        title="Technology with transparency"
        description="An MCA major project exploring a web-based medical information and machine-learning research platform."
      />

      <section className="about-hero panel">
        <div className="about-symbol"><HeartPulse size={51} /></div>
        <div>
          <div className="eyebrow">PROJECT OVERVIEW</div>
          <h2>Bringing medical information and ML research into one workspace.</h2>
          <p>
            MedVision is designed to combine a medical image workflow,
            plain-language terminology explanations, document organisation
            and an educational model-evaluation dashboard in one website.
          </p>
        </div>
      </section>

      <SectionTitle
        title="Project objectives"
        description="The principles guiding the development of MedVision."
      />

      <div className="principles-grid">
        {principles.map(([title, description], index) => (
          <article className="principle-card" key={title}>
            <span>0{index + 1}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>

      <section className="panel scope-panel">
        <div className="eyebrow">PROJECT SCOPE</div>
        <h2>What the first version includes</h2>
        <div className="scope-list">
          {[
            'Multi-page React frontend with responsive navigation',
            'Medical image upload and browser preview',
            'Educational medical terminology library',
            'Document list demonstration',
            'Model-evaluation concepts and dashboard placeholders',
            'Future integration with a Python ML backend',
          ].map((item) => (
            <div className="scope-item" key={item}>
              <CheckCircle2 size={19} /><span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="disclaimer-banner">
        <ShieldCheck size={21} />
        <div>
          <strong>Scope and limitations</strong>
          <p>
            This student project is not a validated medical device or
            diagnostic service. Future model outputs must be evaluated carefully
            and must not replace professional medical judgement.
          </p>
        </div>
      </div>
    </>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <PageHeading
        eyebrow="GET IN TOUCH"
        title="Contact & Project Enquiries"
        description="Use this demonstration form to explore the contact-page design."
      />

      <div className="contact-layout">
        <section className="panel contact-info">
          <div className="feature-icon blue"><Mail size={24} /></div>
          <h2>About this contact page</h2>
          <p>
            This form currently demonstrates the frontend interaction only.
            It does not send emails or store messages on a server.
          </p>

          <div className="contact-detail">
            <ShieldCheck size={21} />
            <div>
              <strong>Privacy first</strong>
              <span>Do not submit sensitive medical information.</span>
            </div>
          </div>

          <div className="contact-detail">
            <Stethoscope size={21} />
            <div>
              <strong>Medical assistance</strong>
              <span>This website does not provide clinical advice or emergency support.</span>
            </div>
          </div>
        </section>

        <section className="panel contact-form-panel">
          <h2>Send a project enquiry</h2>
          <p className="form-intro">Fields marked with * are required.</p>

          {submitted ? (
            <div className="success-state">
              <CheckCircle2 size={39} />
              <h3>Form demonstration complete</h3>
              <p>
                Your form passed frontend validation. No message was sent or saved.
              </p>
              <button className="button button-secondary" onClick={() => setSubmitted(false)}>
                Return to form
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <label>
                Your name *
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Enter your name"
                />
              </label>
              <label>
                Email address *
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Subject *
                <input
                  required
                  value={form.subject}
                  onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  placeholder="Project enquiry"
                />
              </label>
              <label>
                Message *
                <textarea
                  required
                  rows="5"
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Write your message..."
                />
              </label>
              <button type="submit" className="button button-primary">
                Validate form <ArrowRight size={17} />
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  );
}

function NotFoundPage() {
  return (
    <div className="not-found panel">
      <div className="not-found-code">404</div>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist in this workspace.</p>
      <Link to="/" className="button button-primary">Return to overview <ArrowRight size={16} /></Link>
    </div>
  );
}

export { PageHeading, SectionTitle, WorkflowStep, ImageAnalysisPage, ReportExplainerPage, DocumentsPage, StatCard, ModelInsightsPage, MedicalLibraryPage, AboutPage, ContactPage, NotFoundPage };
