import LandingPage from './components/LandingPage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import UploadResource from './components/UploadResource.jsx';
import MyLibrary from './components/MyLibrary.jsx';
import Profile from './components/Profile.jsx';
import ProductPage from './components/ProductPage.jsx';
import DownloadPage from './components/DownloadPage.jsx';
import CheckoutSuccessPage from './components/CheckoutSuccessPage.jsx';
import BrowsePage from './components/BrowsePage.jsx';
import CreateProductPage from './components/CreateProductPage.jsx';
import EditProductPage from './components/EditProductPage.jsx';
import AdminPage from './components/AdminPage.jsx';
import SellerPage from './components/SellerPage.jsx';
import CartPage from './components/CartPage.jsx';
import ProfileSettings from './components/ProfileSettings.jsx';
import { Toaster } from 'sonner';

import "swiper/css";
import "swiper/css/pagination";
import SignUpPage from './components/auth/SignUpPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import AuthStatusPage from './components/auth/AuthStatusPage.jsx';
import AuthCallbackPage from './components/auth/AuthCallbackPage.jsx';
import VerifyEmailPage from './components/auth/VerifyEmailPage.jsx';
import ContactPage from './components/ContactPage.jsx';
import HelpCenterPage from './components/HelpCenterPage.jsx';
import AboutPage from './components/AboutPage.jsx';
import TermsPage from './components/TermPage.jsx';


function App() {

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/auth/callback' element={<AuthCallbackPage />} />
        <Route path='/auth/verify-email' element={<VerifyEmailPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/upload' element={<UploadResource />} />
        <Route path='/create-product' element={<CreateProductPage />} />
        <Route path='/edit-product/:productId' element={<EditProductPage />} />
        <Route path='/library' element={<MyLibrary />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings/profile' element={<ProfileSettings />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/auth-status' element={<AuthStatusPage />} />
        <Route path='/product/:productId' element={<ProductPage />} />
        <Route path='/seller/:sellerId' element={<SellerPage />} />
        <Route path='/download/:purchaseId' element={<DownloadPage />} />
        <Route path='/checkout/success' element={<CheckoutSuccessPage />} />
        <Route path='/contact' element={<ContactPage/>} />
        <Route path='/help-center' element={<HelpCenterPage/>} />
        <Route path='/about' element={<AboutPage/>}></Route>
        <Route path='/term' element={<TermsPage/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App