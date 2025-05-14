// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dash from './components/Dash';
import { Login } from './components/Login'; // ✅ Import Login

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dash />} />
        <Route path="/Login" element={<Login />} /> {/* ✅ Add Login route */}
        <Route path="*" element={<div className="p-6 text-red-600 text-center text-xl">404 - Page Not Found</div>} /> {/* Optional 404 */}
      </Routes>
    </Router>
  );
}
