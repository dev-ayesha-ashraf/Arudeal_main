import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContent from '@/components/home/home';
import LoginPage from '@/components/login/LoginPage';
import SignupPage from '@/components/signup/SignupPage';
import Navbar from '@/components/navbar/navbar';
import Footer from '@/components/footer/footer';
import AboutUs from './components/about/about';
import BikeListing from './components/bikes/BikeListing';
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Add more routes as needed */}
            <Route path="/bikes/listings" element={<BikeListing />} />
            <Route path="/search" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Search Page - Coming Soon</h1></div>} />
            <Route path="/wishlist" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Wishlist Page - Coming Soon</h1></div>} />
            <Route path="/cart" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Cart Page - Coming Soon</h1></div>} />
            <Route path="/category/:category" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Category Page - Coming Soon</h1></div>} />
            <Route path="/deals" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Deals Page - Coming Soon</h1></div>} />
            <Route path="/new-arrivals" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">New Arrivals - Coming Soon</h1></div>} />
            <Route path="/best-sellers" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Best Sellers - Coming Soon</h1></div>} />
            <Route path="/support" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Support Page - Coming Soon</h1></div>} />
            <Route path="/about" element={
              <AboutUs />
            } />


          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;