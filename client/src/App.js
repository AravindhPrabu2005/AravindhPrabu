import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import "./App.css";
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

function LayoutWrapper() {
  const location = useLocation();
  const hideHeaderFooter =
    location.pathname === "/allprojects" ||
    location.pathname === "/achivements" ||
    location.pathname === "/certificates";

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
        <Route path="/admin" element={<Admin />} />
        <Route path="/allprojects" element={<Allprojects />} />
        <Route path="/certificates" element={<Certifications />} />
        <Route path="/achivements" element={<Achievements />} />
        <Route path='/adminresume' element={<AdminResumePage />} />
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
