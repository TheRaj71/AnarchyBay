import LandingPage from './components/LandingPage.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import "swiper/css";
import "swiper/css/pagination";
import SignUpPage from './components/auth/SignUpPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
