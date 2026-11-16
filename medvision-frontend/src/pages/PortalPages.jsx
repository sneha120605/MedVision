import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Bookmark,
  Brain,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileClock,
  FileImage,
  FileText,
  Filter,
  HeartHandshake,
  Info,
  LockKeyhole,
  Microscope,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserRound,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="portal-page-header">
      <div><p className="portal-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="portal-page-description">{description}</p></div>
      {children && <div className="portal-page-actions">{children}</div>}
    </div>
  );
}

function Panel({ title, description, action, children, className = '' }) {
  return (
    <section className={`portal-panel ${className}`}>
      {(title || description || action) && <div className="portal-panel-header"><div>{title && <h2>{title}</h2>}{description && <p>{description}</p>}</div>{action}</div>}
      {children}
    </section>
  );
}

function MetricCard({ label, value = '—', note, icon: Icon, tone = 'blue' }) {
  return <article className={`portal-metric-card ${tone}`}><div className="portal-metric-top"><span>{label}</span><Icon size={18} /></div><strong>{value}</strong><small>{note}</small></article>;
}

function EmptyState({ icon: Icon = FileImage, title, description, action }) {
  return <div className="portal-empty-state"><span className="portal-empty-icon"><Icon size={22} /></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

function PlaceholderVisual({ label = 'IMAGE PREVIEW UNAVAILABLE', className = '' }) {
  return <div className={`portal-placeholder-visual ${className}`}><div className="portal-placeholder-grid" /><Brain size={33} strokeWidth={1.2} /><span>{label}</span></div>;
}

function DemoLabel({ children = 'DEMO PLACEHOLDER' }) {
  return <span className="portal-demo-label"><span />{children}</span>;
}

function PatientDashboard() {
  return (
    <>
      <PageHeader eyebrow="PATIENT WORKSPACE" title="Your imaging overview" description="A clear view of your MRI activity, analysis status, and research choices." >
        <Link className="portal-button primary" to="/patient/upload-mri"><Plus size={16} /> Upload MRI</Link>
      </PageHeader>
      <div className="portal-metric-grid">
        <MetricCard label="Images uploaded" note="No account data connected" icon={FileImage} />
        <MetricCard label="Analyses" note="No model connected" icon={Activity} tone="teal" />
        <MetricCard label="Available reports" note="No reports available" icon={FileText} tone="violet" />
        <MetricCard label="Research choice" value="Not set" note="Demo consent status" icon={HeartHandshake} tone="amber" />
      </div>
      <div className="portal-dashboard-grid">
        <Panel title="Recent imaging activity" description="Your uploads and analysis status will appear here.">
          <EmptyState icon={FileClock} title="Nothing here yet" description="When connected, your submitted scans and analysis progress will be listed here." action={<Link className="portal-text-link" to="/patient/upload-mri">Go to MRI upload <ArrowRight size={15} /></Link>} />
        </Panel>
        <Panel title="Research participation" description="Your choice is always separate from your care.">
          <div className="portal-consent-summary"><span className="portal-consent-icon"><LockKeyhole size={20} /></span><div><DemoLabel>NO CONSENT RECORD</DemoLabel><h3>Research participation is optional</h3><p>No consent or research access has been recorded in this demo.</p></div></div>
          <Link className="portal-button secondary portal-full-button" to="/patient/research-consent">Review consent information <ChevronRight size={16} /></Link>
        </Panel>
      </div>
      <PrivacyNotice text="This demo does not store patient information. Do not select or upload real medical images here." />
    </>
  );
}

function UploadMRIPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const progressTimer = useRef(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    window.clearInterval(progressTimer.current);
  }, [previewUrl]);

  function clearFile() {
    window.clearInterval(progressTimer.current);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setProgress(0);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  function acceptFile(chosen) {
    setError('');
    if (!chosen) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(chosen.type)) {
      setError('Choose a JPG, PNG, or WebP image for this browser preview. DICOM files are not supported in this demo.');
      return;
    }
    if (chosen.size > 20 * 1024 * 1024) {
      setError('Choose an image smaller than 20 MB.');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    window.clearInterval(progressTimer.current);
    setFile(chosen);
    setPreviewUrl(URL.createObjectURL(chosen));
    setProgress(0);
    let value = 0;
    progressTimer.current = window.setInterval(() => {
      value = Math.min(value + 20, 100);
      setProgress(value);
      if (value >= 100) window.clearInterval(progressTimer.current);
    }, 90);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  return (
    <>
      <PageHeader eyebrow="PATIENT WORKSPACE" title="Upload a brain MRI" description="Select an image to preview the planned workflow. No file is sent, saved, or analyzed." />
      <div className="portal-notice warning"><AlertCircle size={18} /><p><strong>Please do not use real or identifiable medical images.</strong> This prototype has no secure storage or upload service. Only use non-sensitive sample images for the local preview.</p></div>
      <div className="portal-upload-grid">
        <Panel title="Select an image" description="Browser-only preview · JPG, PNG, or WebP · Up to 20 MB">
          <div className={`portal-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
            {previewUrl ? <img className="portal-upload-preview" src={previewUrl} alt="Local browser preview of selected image" /> : <><span className="portal-upload-icon"><Upload size={23} /></span><h3>Drag an image here</h3><p>or browse for a non-sensitive sample image</p></>}
            <button type="button" className="portal-button primary" onClick={() => inputRef.current?.click()}><FileImage size={16} /> Choose image</button>
            <input ref={inputRef} className="portal-visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => acceptFile(event.target.files?.[0])} aria-label="Select an image to preview" />
          </div>
          {error && <p className="portal-form-error" role="alert">{error}</p>}
          {file && <div className="portal-file-row"><span><FileImage size={19} /></span><div><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(2)} MB · local preview only</small></div><button type="button" className="portal-icon-button" aria-label="Remove selected file" onClick={clearFile}><X size={17} /></button></div>}
          {file && <div className="portal-progress"><div className="portal-progress-heading"><span>Local demo progress</span><strong>{progress}%</strong></div><div className="portal-progress-track"><span style={{ width: `${progress}%` }} /></div><small>This visual progress is simulated in your browser. No upload or analysis is taking place.</small></div>}
        </Panel>
        <Panel title="Analysis workflow" description="Planned steps — not yet connected">
          <div className="portal-workflow-list">
            {[['01', 'Local image preview', 'Browser-only · no transfer'], ['02', 'Secure image processing', 'Not connected'], ['03', 'Brain MRI analysis', 'No model connected'], ['04', 'Results and report', 'Not available']].map(([number, title, detail], index) => <div className="portal-workflow-step" key={number}><span className={index === 0 && file ? 'done' : ''}>{index === 0 && file ? <Check size={14} /> : number}</span><div><strong>{title}</strong><small>{detail}</small></div></div>)}
          </div>
        </Panel>
      </div>
      <div className="portal-action-row"><Link className="portal-button secondary" to="/patient/analysis-results">View results placeholder <ArrowRight size={15} /></Link></div>
    </>
  );
}

function ImageAnalysisPage() {
  return (
    <>
      <PageHeader eyebrow="PATIENT WORKSPACE" title="Image analysis" description="Review the status and interpretation areas for your brain MRI analysis." />
      <div className="portal-notice info"><Info size={18} /><p><strong>No analysis has been run.</strong> This frontend does not contain a connected model or clinical interpretation service.</p></div>
      <div className="portal-dashboard-grid">
        <Panel title="Analysis status" description="No analysis job is available for this demo account.">
          <div className="portal-status-card"><span className="portal-status-icon"><Clock3 size={20} /></span><div><DemoLabel>NOT STARTED</DemoLabel><h3>Waiting for a connected analysis service</h3><p>When implemented, processing state and next steps will be shown here.</p></div></div>
          <Link className="portal-button primary" to="/patient/upload-mri"><Upload size={16} /> Go to MRI upload</Link>
        </Panel>
        <Panel title="Planned analysis details" description="Brain MRI is the initial project focus.">
          <InfoRows rows={[['Imaging category', 'Brain MRI'], ['Analysis output', 'Not available'], ['Model version', 'Not connected'], ['Last updated', 'No analysis date']]} />
        </Panel>
      </div>
    </>
  );
}

function AnalysisResultsPage() {
  return (
    <>
      <PageHeader eyebrow="PATIENT WORKSPACE" title="Analysis results" description="Model output will be displayed here only after a validated model is integrated." />
      <div className="portal-notice warning"><ShieldCheck size={18} /><p><strong>Clinical output is unavailable.</strong> No diagnosis, prediction, confidence value, or clinical finding is generated in this frontend.</p></div>
      <div className="portal-result-grid">
        <Panel title="Uploaded MRI image" description="Image preview is unavailable until an image is selected locally."><PlaceholderVisual label="NO IMAGE SELECTED" /></Panel>
        <Panel title="Model prediction" description="No prediction has been generated."><div className="portal-result-placeholder"><Brain size={23} /><DemoLabel>MODEL OUTPUT PLACEHOLDER</DemoLabel><strong>Not available</strong><span>A model has not been connected.</span></div></Panel>
      </div>
      <div className="portal-result-grid">
        <Panel title="Possible abnormality information" description="Clinical findings are not generated by this demo."><PlaceholderText title="No findings available" text="This section will display model output only after a validated model and appropriate clinical review process are connected." /></Panel>
        <Panel title="Suspected region visualization" description="No region-of-interest overlay is available."><PlaceholderVisual label="VISUALIZATION NOT AVAILABLE" className="compact" /></Panel>
        <Panel title="Confidence score" description="No model score is available."><div className="portal-confidence-placeholder"><span>—</span><DemoLabel>NO SCORE GENERATED</DemoLabel><small>Confidence scoring is not connected.</small></div></Panel>
      </div>
      <Panel title="Relevant medical information" description="General project context, not individual medical advice."><div className="portal-medical-context"><Info size={18} /><p>Brain MRI examinations can use different sequences and protocols. Their interpretation depends on the full clinical context and review by a qualified professional. This demonstration does not interpret images or provide medical advice.</p></div></Panel>
    </>
  );
}

function AnalysisHistoryPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  return (
    <>
      <PageHeader eyebrow="PATIENT WORKSPACE" title="Analysis history" description="Search and filter your past imaging analyses and access their reports." />
      <Panel title="Your analysis records" description="Dates, analysis types, statuses, and report links will appear when account data is connected.">
        <div className="portal-filter-row"><label className="portal-search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by date or analysis type" /></label><label className="portal-select-field"><Filter size={16} /><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All analysis types</option><option value="brain-mri">Brain MRI</option><option value="report">Reports</option></select></label></div>
        <EmptyState icon={Search} title={query || type !== 'all' ? 'No matching analyses' : 'No analysis history yet'} description="No records are connected to this demo. Filters are ready for use with real account data later." />
      </Panel>
    </>
  );
}

function PreviousReportsPage() {
  return (
    <>
      <PageHeader eyebrow="PATIENT WORKSPACE" title="Previous reports" description="Access available analysis reports and review their status." />
      <Panel title="Your reports" description="Reports will be listed here when securely connected.">
        <EmptyState icon={FileText} title="No reports available" description="There are no reports in this demo workspace. We will not generate sample clinical documents or findings." />
      </Panel>
    </>
  );
}

function ConsentPage() {
  const [choice, setChoice] = useState('unset');
  const statusText = choice === 'unset' ? 'No demo choice recorded' : choice === 'yes' ? 'Demo preference: interested' : 'Demo preference: not interested';
  return (
    <>
      <PageHeader eyebrow="PATIENT WORKSPACE" title="Research participation & consent" description="Research participation is optional and separate from your care and analysis." />
      <div className="portal-notice info"><LockKeyhole size={18} /><p><strong>Consent is not authorization in this demo.</strong> Your selection below only changes this page locally. It is not saved, verified, or used to grant research access.</p></div>
      <Panel title="Your research choice" description="No actual consent record exists in this frontend.">
        <div className="portal-consent-status"><span className={choice === 'yes' ? 'selected' : ''}><HeartHandshake size={23} /></span><div><DemoLabel>DEMO UI STATE ONLY</DemoLabel><h3>{statusText}</h3><p>Real participation requires clear information, explicit consent capture, a way to withdraw, and secure authorization checks.</p></div></div>
        <div className="portal-consent-options"><button type="button" aria-pressed={choice === 'yes'} className={choice === 'yes' ? 'selected' : ''} onClick={() => setChoice(choice === 'yes' ? 'unset' : 'yes')}><CheckCircle2 size={17} /> I am interested in learning about research participation</button><button type="button" aria-pressed={choice === 'no'} className={choice === 'no' ? 'selected' : ''} onClick={() => setChoice(choice === 'no' ? 'unset' : 'no')}><X size={17} /> I do not want to participate in research</button></div>
        <div className="portal-inline-note"><Info size={16} /><span>This local demo preference has no effect on access, data visibility, or any real consent record.</span></div>
      </Panel>
      <Panel title="How privacy is intended to work" description="The future backend must enforce each control; the UI alone cannot protect data.">
        <div className="portal-privacy-grid"><div><ShieldCheck size={19} /><strong>Explicit opt-in</strong><p>Research use should require a clearly documented, revocable permission.</p></div><div><UserRound size={19} /><strong>De-identification</strong><p>Direct identifiers must be removed before any research view is available.</p></div><div><LockKeyhole size={19} /><strong>Access checks</strong><p>Only eligible, authorized research use should expose approved cases.</p></div></div>
      </Panel>
    </>
  );
}

function InfoRows({ rows }) {
  return <dl className="portal-info-rows">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

function PlaceholderText({ title, text }) {
  return <div className="portal-placeholder-text"><span><Info size={19} /></span><div><strong>{title}</strong><p>{text}</p></div></div>;
}

function ResearcherDashboard() {
  return (
    <>
      <PageHeader eyebrow="RESEARCH WORKSPACE" title="Research overview" description="A focused workspace for consented, de-identified imaging research." />
      <div className="portal-notice info"><ShieldCheck size={18} /><p><strong>Dataset access is not connected.</strong> No patient cases, images, or consent records are available in this frontend demo.</p></div>
      <div className="portal-metric-grid">
        <MetricCard label="Approved cases" note="Dataset not connected" icon={ShieldCheck} />
        <MetricCard label="Available MRI studies" note="No research data" icon={Brain} tone="teal" />
        <MetricCard label="Saved cases" note="No cases saved" icon={Bookmark} tone="violet" />
        <MetricCard label="Research activity" note="No analytics data" icon={BarChart3} tone="amber" />
      </div>
      <div className="portal-dashboard-grid">
        <Panel title="Approved dataset" description="Only consented, de-identified records may appear here." action={<Link className="portal-text-link" to="/researcher/approved-dataset">View dataset <ArrowRight size={15} /></Link>}>
          <EmptyState icon={ShieldCheck} title="No approved cases available" description="The research dataset is not connected. No case records are being shown." />
        </Panel>
        <Panel title="Research activity" description="Analytics will appear when an authorized dataset is connected.">
          <div className="portal-chart-empty"><div className="portal-chart-grid"><span /><span /><span /><span /></div><div className="portal-chart-center"><BarChart3 size={25} /><strong>No dataset connected</strong><small>No research activity to visualize</small></div></div>
        </Panel>
      </div>
      <PrivacyNotice text="This workspace must never display patient names, contact details, addresses, or other identifying information." />
    </>
  );
}

function ResearchOverviewPage() {
  return (
    <>
      <PageHeader eyebrow="RESEARCH WORKSPACE" title="Research overview" description="Understand dataset readiness, access scope, and the current research workflow." />
      <div className="portal-notice info"><Microscope size={18} /><p><strong>Research environment preview.</strong> All activity and dataset metrics are empty until authorized data is connected.</p></div>
      <div className="portal-dashboard-grid">
        <Panel title="Workspace readiness" description="Current integration status">
          <InfoRows rows={[['Imaging focus', 'Brain MRI'], ['Dataset connection', 'Not connected'], ['Consent verification', 'Backend not implemented'], ['De-identification pipeline', 'Not implemented'], ['Model outputs', 'Unavailable']]} />
        </Panel>
        <Panel title="Access principles" description="Expected controls for all research workflows">
          <div className="portal-principle-list"><p><ShieldCheck size={17} /><span>Cases require explicit research consent.</span></p><p><UserRound size={17} /><span>Research records must be de-identified.</span></p><p><LockKeyhole size={17} /><span>Server-side authorization must enforce access.</span></p></div>
        </Panel>
      </div>
      <Link className="portal-button secondary" to="/researcher/approved-dataset">Review dataset access <ArrowRight size={15} /></Link>
    </>
  );
}

function ApprovedDatasetPage() {
  return (
    <>
      <PageHeader eyebrow="RESEARCH WORKSPACE" title="Approved research dataset" description="Cases in this space are intended to be explicitly consented, de-identified, and authorized for research use." />
      <div className="portal-notice warning"><LockKeyhole size={18} /><p><strong>No access is granted by this interface.</strong> Consent verification, data de-identification, and authorization must be implemented and enforced securely in the backend.</p></div>
      <div className="portal-metric-grid compact"><MetricCard label="Available cases" note="No dataset connected" icon={ShieldCheck} /><MetricCard label="Research scope" value="Brain MRI" note="Initial project focus" icon={Brain} tone="teal" /><MetricCard label="Access status" value="Not connected" note="Backend authorization required" icon={LockKeyhole} tone="amber" /></div>
      <Panel title="Dataset records" description="No case information is available in this sample frontend.">
        <EmptyState icon={ShieldCheck} title="No approved research data" description="When the backend is ready, only explicitly consented, properly de-identified, research-authorized cases should appear here." action={<Link className="portal-text-link" to="/researcher/case-explorer">Open case explorer <ArrowRight size={15} /></Link>} />
      </Panel>
    </>
  );
}

function CasePlaceholderCard() {
  return (
    <article className="portal-case-card">
      <div className="portal-case-preview"><PlaceholderVisual label="SAMPLE PREVIEW PLACEHOLDER" /></div>
      <div className="portal-case-body"><div className="portal-case-meta"><DemoLabel>LAYOUT SAMPLE · NOT A RECORD</DemoLabel><span><LockKeyhole size={13} /> Access not connected</span></div><h3>No case data available</h3><p>This card demonstrates the case layout only. No patient record, scan, or finding is included.</p><div className="portal-case-facts"><span><strong>Imaging</strong>Not available</span><span><strong>Findings</strong>Not provided</span><span><strong>Consent</strong>Not verified</span></div><Link className="portal-button secondary" to="/researcher/mri-comparison">Open comparison layout <ArrowRight size={15} /></Link></div>
    </article>
  );
}

function ResearchCaseExplorerPage({ similar = false }) {
  const [query, setQuery] = useState('');
  const [sequence, setSequence] = useState('all');
  const title = similar ? 'Similar case explorer' : 'Research case explorer';
  return (
    <>
      <PageHeader eyebrow="RESEARCH WORKSPACE" title={title} description={similar ? 'Explore similarity-based case discovery when authorized MRI data is available.' : 'Filter and browse anonymized case records after consent and access checks.'} />
      <div className="portal-notice warning"><ShieldCheck size={18} /><p><strong>Sample placeholders only.</strong> There are no consented or de-identified research cases connected to this demo.</p></div>
      <Panel title="Find a case" description="Filters are interface examples; no case search is performed.">
        <div className="portal-filter-row"><label className="portal-search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anonymized case identifiers" /></label><label className="portal-select-field"><SlidersHorizontal size={16} /><select value={sequence} onChange={(event) => setSequence(event.target.value)}><option value="all">All MRI sequences</option><option value="t1">T1-weighted</option><option value="t2">T2-weighted</option><option value="flair">FLAIR</option></select></label><button className="portal-button secondary" type="button" onClick={() => { setQuery(''); setSequence('all'); }}><Filter size={15} /> Reset filters</button></div>
      </Panel>
      <div className="portal-case-grid"><CasePlaceholderCard /></div>
      <div className="portal-inline-note"><LockKeyhole size={16} /><span>Patient names, phone numbers, emails, addresses, and direct identifiers are not part of this researcher interface.</span></div>
    </>
  );
}

function MRIComparisonPage() {
  return (
    <>
      <PageHeader eyebrow="RESEARCH WORKSPACE" title="MRI image comparison" description="A comparison workspace for authorized, de-identified cases." />
      <div className="portal-notice warning"><Info size={18} /><p><strong>No research images are loaded.</strong> Comparison controls are unavailable until a secure, consent-verified dataset is connected.</p></div>
      <div className="portal-comparison-grid"><Panel title="Image A" description="No case selected"><PlaceholderVisual label="MRI IMAGE A · NOT AVAILABLE" className="comparison" /></Panel><div className="portal-comparison-center"><ArrowDownRight size={20} /><span>Side-by-side<br />comparison</span></div><Panel title="Image B" description="No case selected"><PlaceholderVisual label="MRI IMAGE B · NOT AVAILABLE" className="comparison" /></Panel></div>
      <Panel title="Comparison findings" description="No measurements or clinical observations are available."><EmptyState icon={Activity} title="No comparison data" description="This demo does not compare images or generate clinical findings." /></Panel>
    </>
  );
}

function ResearchAnalyticsPage() {
  return (
    <>
      <PageHeader eyebrow="RESEARCH WORKSPACE" title="Research analytics" description="Review aggregate research metrics from authorized and de-identified datasets." />
      <div className="portal-notice info"><BarChart3 size={18} /><p><strong>No metrics are generated.</strong> Charts and values will remain empty until authorized research data is available.</p></div>
      <div className="portal-metric-grid"><MetricCard label="Cases in scope" note="No dataset connected" icon={Brain} /><MetricCard label="Analysis coverage" note="No analysis records" icon={Activity} tone="teal" /><MetricCard label="Data completeness" note="Not calculated" icon={CheckCircle2} tone="violet" /></div>
      <Panel title="Research activity" description="No real or sample analytics are displayed."><div className="portal-chart-empty large"><div className="portal-chart-grid"><span /><span /><span /><span /></div><div className="portal-chart-center"><BarChart3 size={26} /><strong>Waiting for authorized research data</strong><small>No synthetic counts or chart values are shown</small></div></div></Panel>
    </>
  );
}

function SavedCasesPage() {
  return (
    <>
      <PageHeader eyebrow="RESEARCH WORKSPACE" title="Saved cases" description="Return to cases you have bookmarked for approved research use." />
      <Panel title="Your saved cases" description="Saved items will be limited to cases you are authorized to access.">
        <EmptyState icon={Bookmark} title="No saved cases" description="There are no cases or account records in this frontend demo." action={<Link className="portal-text-link" to="/researcher/case-explorer">Explore case layout <ArrowRight size={15} /></Link>} />
      </Panel>
      <PrivacyNotice text="Saving a case in a future version must not bypass consent status, de-identification rules, or access permissions." />
    </>
  );
}

function AccountPage({ pageId, role }) {
  const isSettings = pageId === 'settings';
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({ updates: false, accessibility: false });
  return (
    <>
      <PageHeader eyebrow={role === 'patient' ? 'PATIENT WORKSPACE' : 'RESEARCH WORKSPACE'} title={isSettings ? 'Settings' : 'Profile'} description={isSettings ? 'Manage demo interface preferences.' : 'Review the account details area for this workspace.'} />
      {isSettings ? (
        <Panel title="Interface preferences" description="These settings apply only in this browser session.">
          <div className="portal-settings-list">
            <label><span><strong>Product updates</strong><small>Show interface announcements in this demo.</small></span><input type="checkbox" checked={preferences.updates} onChange={(event) => setPreferences({ ...preferences, updates: event.target.checked })} /></label>
            <label><span><strong>Enhanced accessibility contrast</strong><small>Use stronger contrast for key interface elements.</small></span><input type="checkbox" checked={preferences.accessibility} onChange={(event) => setPreferences({ ...preferences, accessibility: event.target.checked })} /></label>
          </div>
          <p className="portal-inline-note"><Info size={15} /> Preferences are not saved to an account.</p>
        </Panel>
      ) : (
        <Panel title="Profile information" description="No profile data is collected or displayed in this demo.">
          <div className="portal-profile-placeholder"><span><UserRound size={24} /></span><div><DemoLabel>NO ACCOUNT DATA</DemoLabel><h3>{role === 'patient' ? 'Patient profile placeholder' : 'Researcher profile placeholder'}</h3><p>Connect an account service in a future phase to securely manage profile details.</p></div></div>
        </Panel>
      )}
      {!isSettings && <Panel title={role === 'patient' ? 'Your privacy' : 'Research access'} description="Important information about this demo."><div className="portal-inline-note"><ShieldCheck size={16} />{role === 'patient' ? 'Avoid entering personal or health information in this frontend.' : 'Frontend role selection is not authentication and does not authorize access to real data.'}</div></Panel>}
      <button className="portal-button secondary" type="button" onClick={() => setSaved(true)}>{saved ? <><Check size={15} /> Preference noted for this demo</> : <><Settings size={15} /> {isSettings ? 'Save demo preferences' : 'Edit profile placeholder'}</>}</button>
    </>
  );
}

function PrivacyNotice({ text }) {
  return <div className="portal-privacy-notice"><ShieldCheck size={19} /><span><strong>Privacy-first by design</strong>{text}</span></div>;
}

const pageComponents = {
  patient: {
    dashboard: PatientDashboard,
    'upload-mri': UploadMRIPage,
    'image-analysis': ImageAnalysisPage,
    'analysis-results': AnalysisResultsPage,
    'analysis-history': AnalysisHistoryPage,
    'previous-reports': PreviousReportsPage,
    'research-consent': ConsentPage,
  },
  researcher: {
    dashboard: ResearcherDashboard,
    overview: ResearchOverviewPage,
    'approved-dataset': ApprovedDatasetPage,
    'case-explorer': ResearchCaseExplorerPage,
    'similar-cases': () => <ResearchCaseExplorerPage similar />,
    'mri-comparison': MRIComparisonPage,
    'research-analytics': ResearchAnalyticsPage,
    'saved-cases': SavedCasesPage,
  },
};

export default function PortalPage({ role, pageId }) {
  if (pageId === 'profile' || pageId === 'settings') return <AccountPage pageId={pageId} role={role} />;
  const Page = pageComponents[role]?.[pageId];
  if (!Page) return <PageHeader eyebrow="WORKSPACE" title="Page unavailable" description="Choose a page from the navigation menu." />;
  return <Page />;
}
