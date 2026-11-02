import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="public-shell">
      <Navbar />
      <main className="public-main">{children}</main>
      <Footer />
    </div>
  );
}
