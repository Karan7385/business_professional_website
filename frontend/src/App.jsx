import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


// Pages
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About/About.jsx";
import { Certificates } from "./pages/Certs/Certificates.jsx";
import Contact from "./components/Contact.jsx";
import Product from "./pages/Products/Product.jsx";
import AllProducts from "./components/products/AllProducts.jsx";

// Admin
import LoginPage from "./admin/LoginPage";
import AdminLayout from "./admin/layouts/AdminLayout";
import ProtectedRoute from "./admin/components/auth/ProtectedRoute";

// Navbar + Context
import NavbarA from "./components/Navbar.jsx";
import ContactModalContext from "./context/ContactModalContext.jsx";

import { Toaster } from "react-hot-toast";

/* ================= WRAPPER ================= */

const BASE_SERVER_URL = import.meta.env.VITE_BASE_SERVER_URL;

function AppContent() {
  const location = useLocation();

  /* ================= PRODUCTS ================= */
  const [productData, setProductData] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  /* ================= CONTACT MODAL ================= */
  const [openModal, setOpenModal] = useState(false);

  // 🔹 Hide navbar on admin routes
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BASE_SERVER_URL}/api/products`);
        setProductData(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 8000,
          style: {
            fontSize: "14px",
          },
        }}
      />

      <ContactModalContext.Provider
        value={{
          openContactModal: () => setOpenModal(true),
          products: productData,
        }}
      >
        {/* ✅ Navbar only for public pages */}
        {!hideNavbar && (
          <NavbarA openModal={openModal} setOpenModal={setOpenModal} />
        )}

        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home products={productData} />} />
          <Route path="/about" element={<About />} />
          <Route path="/certs" element={<Certificates />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/products"
            element={
              <Product
                products={productData}
                isLoading={loadingProducts}
              />
            }
          />
          <Route
            path="/all-products"
            element={
              <AllProducts
                products={productData}
              />
            }
          />

          {/* Admin */}
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ContactModalContext.Provider>
    </>
  );
}

/* ================= ROOT ================= */

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;