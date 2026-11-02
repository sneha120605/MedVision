import { Route, Routes } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import About from './pages/About';
import Contact from './pages/Contact';
import Documents from './pages/Documents';
import Home from './pages/Home';
import ImageAnalysis from './pages/ImageAnalysis';
import MedicalLibrary from './pages/MedicalLibrary';
import ModelInsights from './pages/ModelInsights';
import NotFound from './pages/NotFound';
import ReportExplainer from './pages/ReportExplainer';
import './App.css';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image-analysis" element={<ImageAnalysis />} />
        <Route path="/report-explainer" element={<ReportExplainer />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/model-insights" element={<ModelInsights />} />
        <Route path="/medical-library" element={<MedicalLibrary />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}
