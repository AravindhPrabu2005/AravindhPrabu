import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
import axiosInstance from "./components/axiosInstance";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Resume from "./components/Resume";
import Admin from "./components/Admin";
import Allprojects from "./components/Allprojects";
import ScrollToTop from "./components/ScrollToTop";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import Achievements from "./components/Achievements";
import AdminResumePage from "./components/Adminresume";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import ResumeSettings from "./components/ResumeSettings";
import AdminProjects from "./components/AdminProjects";
import AdminCertifications from "./components/AdminCertifications";
import AdminAchievements from "./components/AdminAchievements";
import AdminExperience from "./components/AdminExperience";
import AdminVisitors from "./components/AdminVisitors";

function LayoutWrapper() {
  const location = useLocation();

  useEffect(() => {
    // Only track visitors on the production domain (not localhost/127.0.0.1)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      if (!sessionStorage.getItem("portfolio_visited")) {
        const reportVisit = async () => {
          let geoData = {
            ip: "Unknown",
            country: "Unknown",
            city: "Unknown",
            region: "Unknown",
            isp: "Unknown"
          };

          // 1. Try primary geolocation service (ipapi.co supports HTTPS & CORS)
          try {
            const response = await fetch("https://ipapi.co/json/");
            if (response.ok) {
              const data = await response.json();
              geoData = {
                ip: data.ip || "Unknown",
                country: data.country_name || "Unknown",
                city: data.city || "Unknown",
                region: data.region || "Unknown",
                isp: data.org || "Unknown"
              };
            }
          } catch (err) {
            console.error("Primary client-side geolocation failed, attempting fallback...", err);
            // 2. Try fallback geolocation service (freeipapi.com)
            try {
              const response = await fetch("https://freeipapi.com/api/json");
              if (response.ok) {
                const data = await response.json();
                geoData = {
                  ip: data.ipAddress || "Unknown",
                  country: data.countryName || "Unknown",
                  city: data.cityName || "Unknown",
                  region: data.regionName || "Unknown",
                  isp: "Unknown"
                };
              }
            } catch (fallbackErr) {
              console.error("Fallback geolocation failed:", fallbackErr);
            }
          }

          try {
            await axiosInstance.post("/api/visit", {
              userAgent: navigator.userAgent,
              referrer: document.referrer || "Direct",
              screenResolution: `${window.screen.width}x${window.screen.height}`,
              language: navigator.language,
              path: window.location.pathname,
              geoData // Send geolocation retrieved from client-side
            });
            sessionStorage.setItem("portfolio_visited", "true");
          } catch (err) {
            console.error("Failed to log visit:", err);
          }
        };
        reportVisit();
      }
    }
  }, []);
  const hideHeaderFooter =
    location.pathname === "/allprojects" ||
    location.pathname === "/achivements" ||
    location.pathname === "/certificates" ||
    location.pathname.startsWith("/admin") ||
    location.pathname === "/adminresume";

  return (
    <div className="App">
      <ScrollToTop />
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <About />
              <Resume />
              <Skills />
              <Experience />
              <Projects />
              <Contact />
            </>
          }
        />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Redirect old routes to the consistent ones */}
        <Route path="/admin" element={<Navigate to="/admin/messages" replace />} />
        <Route path="/adminresume" element={<Navigate to="/admin/resume-requests" replace />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/admin/messages" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/resume-requests" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminResumePage />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/resume-settings" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <ResumeSettings />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/projects" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProjects />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/certifications" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminCertifications />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/achievements" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminAchievements />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/experience" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminExperience />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/visitors" 
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminVisitors />
              </AdminLayout>
            </ProtectedRoute>
          } 
        />

        <Route path="/allprojects" element={<Allprojects />} />
        <Route path="/certificates" element={<Certifications />} />
        <Route path="/achivements" element={<Achievements />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
      <SpeedInsights />
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
      <Analytics /> {/* ← This is required */}
    </Router>
  );
}

export default App;
