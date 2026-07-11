import { useEffect, useRef } from "react";
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
  const sessionActiveRef = useRef(false);
  const prevPathRef = useRef(location.pathname);
  const pageLoadTimeRef = useRef(Date.now());
  const maxScrollDepthRef = useRef(0);

  useEffect(() => {
    // Only track visitors on the production domain (not localhost/127.0.0.1)
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      // Get or create unique session ID
      let sessionId = sessionStorage.getItem("portfolio_session_id");
      if (!sessionId) {
        sessionId = "sess_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
        sessionStorage.setItem("portfolio_session_id", sessionId);
      }

      // Handle page transitions & duration updates
      if (sessionActiveRef.current) {
        const duration = Math.round((Date.now() - pageLoadTimeRef.current) / 1000);
        axiosInstance.post("/api/visit/event", {
          sessionId,
          eventType: "pageview",
          data: {
            path: prevPathRef.current,
            duration,
            maxScrollDepth: maxScrollDepthRef.current
          }
        }).catch(err => console.error("Failed to log page transition:", err));
      }

      // Update refs for new page load
      prevPathRef.current = location.pathname;
      pageLoadTimeRef.current = Date.now();
      maxScrollDepthRef.current = 0;
      sessionActiveRef.current = true;

      // Geolocation reporting
      const reportVisit = async () => {
        let geoData = null;
        const cachedGeo = sessionStorage.getItem("portfolio_geodata");
        
        if (cachedGeo) {
          try {
            geoData = JSON.parse(cachedGeo);
          } catch (e) {
            geoData = null;
          }
        }

        // If we don't have geoData yet, query it once per session
        if (!geoData) {
          geoData = {
            ip: "Unknown",
            country: "Unknown",
            city: "Unknown",
            region: "Unknown",
            isp: "Unknown",
            org: "Unknown",
            latitude: null,
            longitude: null
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
                isp: data.org || "Unknown",
                org: data.org || "Unknown",
                latitude: data.latitude || null,
                longitude: data.longitude || null
              };
              sessionStorage.setItem("portfolio_geodata", JSON.stringify(geoData));
            } else {
              throw new Error("ipapi not ok");
            }
          } catch (err) {
            console.error("Primary client-side geolocation failed, attempting fallback 1...", err);
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
                  isp: "Unknown",
                  org: "Unknown",
                  latitude: data.latitude || null,
                  longitude: data.longitude || null
                };
                sessionStorage.setItem("portfolio_geodata", JSON.stringify(geoData));
              } else {
                throw new Error("freeipapi not ok");
              }
            } catch (fallbackErr) {
              console.error("Fallback 1 geolocation failed, attempting fallback 2 (ipwho.is)...", fallbackErr);
              // 3. Try ipwho.is as third fallback
              try {
                const response = await fetch("https://ipwho.is/");
                if (response.ok) {
                  const data = await response.json();
                  if (data.success) {
                    geoData = {
                      ip: data.ip || "Unknown",
                      country: data.country || "Unknown",
                      city: data.city || "Unknown",
                      region: data.region || "Unknown",
                      isp: data.connection?.isp || "Unknown",
                      org: data.connection?.org || "Unknown",
                      latitude: data.latitude || null,
                      longitude: data.longitude || null
                    };
                    sessionStorage.setItem("portfolio_geodata", JSON.stringify(geoData));
                  }
                }
              } catch (fallbackErr2) {
                console.error("Fallback 2 geolocation failed:", fallbackErr2);
              }
            }
          }
        }

        // Telemetry Feature Detections
        const cookieSupport = navigator.cookieEnabled;
        const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        let visitorType = "New";
        try {
          if (localStorage.getItem("portfolio_returning_visitor")) {
            visitorType = "Returning";
          } else {
            localStorage.setItem("portfolio_returning_visitor", "true");
          }
        } catch (e) {}

        let utmParams = { source: "", medium: "", campaign: "", term: "", content: "" };
        try {
          const cachedUtm = sessionStorage.getItem("portfolio_utm_params");
          if (cachedUtm) {
            utmParams = JSON.parse(cachedUtm);
          } else {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("utm_source") || urlParams.get("utm_medium") || urlParams.get("utm_campaign")) {
              utmParams = {
                source: urlParams.get("utm_source") || "",
                medium: urlParams.get("utm_medium") || "",
                campaign: urlParams.get("utm_campaign") || "",
                term: urlParams.get("utm_term") || "",
                content: urlParams.get("utm_content") || ""
              };
              sessionStorage.setItem("portfolio_utm_params", JSON.stringify(utmParams));
            }
          }
        } catch (e) {}

        let networkType = "Unknown";
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
          networkType = `${conn.effectiveType || "unknown"} (downlink: ${conn.downlink || 0}Mbps, rtt: ${conn.rtt || 0}ms)`;
        }

        const browserVendor = navigator.vendor || "Unknown";
        const platform = navigator.platform || "Unknown";

        let renderingEngine = "Unknown";
        const ua = navigator.userAgent;
        if (ua.indexOf("Edge") > -1 || ua.indexOf("Edg") > -1) renderingEngine = "Blink (Edge)";
        else if (ua.indexOf("Chrome") > -1) renderingEngine = "Blink (Chrome)";
        else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) renderingEngine = "WebKit";
        else if (ua.indexOf("Firefox") > -1) renderingEngine = "Gecko";
        else if (ua.indexOf("Trident") > -1 || ua.indexOf("MSIE") > -1) renderingEngine = "Trident (IE)";

        try {
          await axiosInstance.post("/api/visit", {
            sessionId,
            userAgent: navigator.userAgent,
            referrer: document.referrer || "Direct",
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language,
            path: location.pathname,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
            visitorTime: new Date().toString(),
            geoData,
            cookieSupport,
            touchSupport,
            visitorType,
            utmParams,
            networkType,
            browserVendor,
            renderingEngine,
            platform
          });
        } catch (err) {
          console.error("Failed to log visit:", err);
        }
      };
      
      reportVisit();

      // Scroll event tracker (debounced to avoid database spam)
      let scrollTimeout;
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (scrollHeight > 0) {
          const pct = Math.round((scrollTop / scrollHeight) * 100);
          if (pct > maxScrollDepthRef.current) {
            maxScrollDepthRef.current = Math.min(pct, 100);
            
            // Debounce server update to 2 seconds
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              const duration = Math.round((Date.now() - pageLoadTimeRef.current) / 1000);
              axiosInstance.post("/api/visit/event", {
                sessionId,
                eventType: "pageview",
                data: {
                  path: location.pathname,
                  duration,
                  maxScrollDepth: maxScrollDepthRef.current
                }
              }).catch(() => {});
            }, 2000);
          }
        }
      };
      window.addEventListener("scroll", handleScroll);

      // Outbound Click event tracker
      const handleGlobalClick = (e) => {
        const target = e.target.closest("a, button");
        if (!target) return;

        let elementId = target.id || target.getAttribute("name") || "";
        let label = target.innerText.trim() || target.getAttribute("aria-label") || "";
        const href = target.getAttribute("href") || "";

        if (href.includes("github.com")) {
          elementId = elementId || "github_link";
          label = label || "GitHub Link";
        } else if (href.includes("linkedin.com")) {
          elementId = elementId || "linkedin_link";
          label = label || "LinkedIn Link";
        } else if (href.includes("leetcode.com")) {
          elementId = elementId || "leetcode_link";
          label = label || "LeetCode Link";
        } else if (href.includes("Resume") || target.innerText.toLowerCase().includes("resume")) {
          elementId = elementId || "resume_link";
          label = label || "Resume Download/Request";
        } else if (target.type === "submit" && target.closest("form")) {
          elementId = elementId || "submit_button";
          label = label || "Form Submit Button";
        }

        if (elementId || label) {
          axiosInstance.post("/api/visit/event", {
            sessionId,
            eventType: "click",
            data: {
              elementId: elementId || "generic_click",
              label: label || target.tagName
            }
          }).catch(err => console.error("Failed to log click event:", err));
        }
      };
      document.addEventListener("click", handleGlobalClick);

      // Visibility Change event tracker (tab close or hidden page)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          const duration = Math.round((Date.now() - pageLoadTimeRef.current) / 1000);
          const payload = {
            sessionId,
            eventType: "pageview",
            data: {
              path: location.pathname,
              duration,
              maxScrollDepth: maxScrollDepthRef.current
            }
          };
          const apiUrl = axiosInstance.defaults.baseURL || "";
          fetch(`${apiUrl}/api/visit/event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true
          }).catch(() => {});
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        clearTimeout(scrollTimeout);
        window.removeEventListener("scroll", handleScroll);
        document.removeEventListener("click", handleGlobalClick);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }
  }, [location.pathname]);
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
