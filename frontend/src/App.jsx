import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import { Certificates } from "./pages/Certs/Certificates";
import Product from "./pages/Products/Product";

// Admin Imports
import LoginPage from "./admin/LoginPage";
import AdminLayout from "./admin/layouts/AdminLayout";
import ProtectedRoute from "./admin/components/auth/ProtectedRoute";
import { useState } from "react";
import axios from "axios";

function App() {
  const [productData, setProductData] = useState([]);

  useState(async () => {
    const res = await axios.get("http://localhost:3000/api/products");
    setProductData(res.data.data);    
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/certs" element={<Certificates />} />
          <Route path="/products" element={<Product products={productData} />} />

          {/* Admin */}
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
