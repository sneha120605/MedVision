import { Outlet, Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import PortalLayout from './components/PortalLayout';
import About from './pages/About';
import AuthPages from './pages/AuthPages';
import Contact from './pages/Contact';
import Documents from './pages/Documents';
import { FeaturesPage, HowItWorksPage } from './pages/PublicPages';
import Home from './pages/Home';
import ImageAnalysis from './pages/ImageAnalysis';
import MedicalLibrary from './pages/MedicalLibrary';
import ModelInsights from './pages/ModelInsights';
import NotFound from './pages/NotFound';
import PortalPage from './pages/PortalPages';
import ReportExplainer from './pages/ReportExplainer';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout><Outlet /></MainLayout>}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/login" element={<AuthPages mode="login" />} />
        <Route path="/register" element={<AuthPages mode="register" />} />
        <Route path="/image-analysis" element={<ImageAnalysis />} />
        <Route path="/report-explainer" element={<ReportExplainer />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/model-insights" element={<ModelInsights />} />
        <Route path="/medical-library" element={<MedicalLibrary />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/patient" element={<PortalLayout role="patient" />}>
        <Route index element={<PortalPage role="patient" pageId="dashboard" />} />
        <Route path="upload-mri" element={<PortalPage role="patient" pageId="upload-mri" />} />
        <Route path="image-analysis" element={<PortalPage role="patient" pageId="image-analysis" />} />
        <Route path="analysis-results" element={<PortalPage role="patient" pageId="analysis-results" />} />
        <Route path="analysis-history" element={<PortalPage role="patient" pageId="analysis-history" />} />
        <Route path="previous-reports" element={<PortalPage role="patient" pageId="previous-reports" />} />
        <Route path="research-consent" element={<PortalPage role="patient" pageId="research-consent" />} />
        <Route path="profile" element={<PortalPage role="patient" pageId="profile" />} />
        <Route path="settings" element={<PortalPage role="patient" pageId="settings" />} />
        <Route path="*" element={<PortalPage role="patient" pageId="not-found" />} />
      </Route>
      <Route path="/researcher" element={<PortalLayout role="researcher" />}>
        <Route index element={<PortalPage role="researcher" pageId="dashboard" />} />
        <Route path="overview" element={<PortalPage role="researcher" pageId="overview" />} />
        <Route path="approved-dataset" element={<PortalPage role="researcher" pageId="approved-dataset" />} />
        <Route path="case-explorer" element={<PortalPage role="researcher" pageId="case-explorer" />} />
        <Route path="similar-cases" element={<PortalPage role="researcher" pageId="similar-cases" />} />
        <Route path="mri-comparison" element={<PortalPage role="researcher" pageId="mri-comparison" />} />
        <Route path="research-analytics" element={<PortalPage role="researcher" pageId="research-analytics" />} />
        <Route path="saved-cases" element={<PortalPage role="researcher" pageId="saved-cases" />} />
        <Route path="profile" element={<PortalPage role="researcher" pageId="profile" />} />
        <Route path="settings" element={<PortalPage role="researcher" pageId="settings" />} />
        <Route path="*" element={<PortalPage role="researcher" pageId="not-found" />} />
      </Route>
    </Routes>
  );
}
