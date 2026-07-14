import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { getCachedOrFallback, setCache } from "./cacheHelper";

const STATIC_PROJECTS_FALLBACK = [
  {
    "_id": "6a4f3e67d654ec0840418c55",
    "title": "Psychiatrist consultation portal",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783578215/projects/xnkaf2z8dpfewz7i3hjl.png",
    "description": "➔ Built a real-time consultation platform with Socket.IO messenger and patient care module for treatment tracking. \r\n➔ Improved booking reliability by 90% by preventing duplicate bookings and race condition using MongoDB transaction. \r\n➔ Integrated Stripe payment gateway and implemented a psychology consultation chatbot using the GROQ API. ",
    "github": "https://github.com/AravindhPrabu2005/Psychiatrist-Consultation-Portal",
    "stack": ["React.js", "Node.js", "MongoDB", "Socket.IO", "GROQ API.", "Stripe"],
    "featured": true,
    "liveLink": "https://psycareofficial.vercel.app/",
    "videoLink": "",
    "featuredOrder": 0,
    "allOrder": 0
  },
  {
    "_id": "6a4f3c4fd654ec0840418c4c",
    "title": "Event Booking Platform",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783577678/projects/mox61rc6y2x9dve0akdb.png",
    "description": "➔ Built a modular backend using microservices architecture (Auth, Booking, Event) services with custom API Gateway. \r\n➔ Deployed Dockerized services on AWS EC2 with NGINX reverse proxy and full HTTPS configuration. \r\n➔ Implemented CI/CD pipeline in GitHub Actions, used Redis for caching the events and API rate limiting per IP.",
    "github": "https://github.com/AravindhPrabu2005/Event-booking-platform",
    "stack": ["AWS", "microservices", "Docker compose", "Redis", "Rate limiting", "Github Actions", "React.js", "MongoDB", "Node.js"],
    "featured": true,
    "liveLink": "https://kootamx.vercel.app/login",
    "videoLink": "",
    "featuredOrder": 1,
    "allOrder": 1
  },
  {
    "_id": "6a4dedc3d03c5ca165873a1c",
    "title": "Point of sale",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783578886/projects/t4xskmia17pyvvgvidmx.png",
    "description": "A cloud-based Point of Sale system for cafes and restaurants with role-based auth, real-time sync, QR self-ordering, kitchen display, and multi-payment support.",
    "github": "https://github.com/nandhakrishnanp/Odoo-x-KAHE",
    "stack": ["React", "Node.js", "PostgreSQL", "Drizzle ORM"],
    "featured": true,
    "liveLink": "",
    "videoLink": "https://drive.google.com/file/d/1MvltLW-l7fX7Pz5RDLe48zxl2zmKo48a/view With voice",
    "featuredOrder": 2,
    "allOrder": 2
  },
  {
    "_id": "6a4f4383d654ec0840418c5d",
    "title": "Travel companion application",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783579522/projects/szla7n9a4lp8f5yqzyq7.png",
    "description": "Developed Global Trotter, a full-stack travel planning application with secure authentication, trip management, and itinerary creation. Built using the MERN stack with a responsive UI and RESTful APIs for a seamless user experience.",
    "github": "https://github.com/AravindhPrabu2005/Global-trotter-oodo",
    "stack": ["React.js", "Node.js", "PostgreSQL"],
    "featured": false,
    "liveLink": "",
    "videoLink": "https://www.youtube.com/watch?v=pD1fkyAfyhQ&feature=youtu.be",
    "allOrder": 3
  },
  {
    "_id": "6a4f456c29687d3b6238e559",
    "title": "Online learning platform",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783580012/projects/jlimtu0oymzhjaekylzq.png",
    "description": "A comprehensive online learning platform designed for course creation, management, and student engagement.",
    "github": "https://github.com/AravindhPrabu2005/LearnSphere-",
    "stack": ["Next.js", "Go", "PostgreSQL"],
    "featured": false,
    "videoLink": "https://drive.google.com/file/d/1meHdsImJ6q68nywTN0A-ydfOSQz2rEs4/view?usp=sharing",
    "liveLink": "",
    "allOrder": 4
  },
  {
    "_id": "6a4f3a61d654ec0840418c49",
    "title": "Agent assisted E-commerce website",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783577185/projects/gznw6wk8yetezv61ndgl.png",
    "description": "Developed an Agentic RAG chatbot for intelligent product discovery using GROQ API and ChromaDB vector search. \r\nOrchestrated a multi-agent product recommendation system with 2 agents utilizing LangGraph. \r\nImplemented Review Summarization and Inventory Demand Prediction agents using LangChain. ",
    "github": "https://github.com/AravindhPrabu2005/Agent-Assisted_E-commerce_Platform",
    "stack": ["React", "Node", "MongoDB", "ChromaDB", "LangGraph", "LangChain", "GROQ API"],
    "featured": false,
    "liveLink": "https://ekadai.vercel.app/",
    "videoLink": "",
    "allOrder": 5
  },
  {
    "_id": "6a4dee47d03c5ca165873a1f",
    "title": "Food redistribution app",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783492167/projects/flfex4eyesrpvf5wxs90.webp",
    "description": "AkshyaPatra is a Food Distribution App Connects NGO and Food Donors to Distribute Surplus Foods From Events , Hotels etc..,",
    "github": "https://github.com/nandhakrishnanp/akshayapathra",
    "stack": ["React Native", "Node js", "MongoDb", "Next js"],
    "featured": false,
    "allOrder": 6
  },
  {
    "_id": "6a4deec2d03c5ca165873a26",
    "title": "Skill sharing platform",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783492290/projects/bhm83bk6c9gsuyj1vp7l.webp",
    "description": "SkillHive is a skill-sharing platform designed for instructors and learners to connect, share knowledge, and grow together.",
    "github": "https://github.com/nandhakrishnanp/SkillHive",
    "stack": ["React.js", "Express.js", "MongoDb"],
    "featured": false,
    "allOrder": 7
  },
  {
    "_id": "6a4e79a5e1f69379e64462d6",
    "title": "Tenant management system",
    "image": "https://res.cloudinary.com/dpoufodoc/image/upload/v1783527844/projects/d0vg6fyw5vmc545gugve.png",
    "description": "RK Tenants is a property management platform designed for owners to manage portions, tenant profiles, and open-ended rental agreements. The system automates monthly rent invoicing, supports advance payments, and allows owners to quickly record hand-collected cash payments. It calculates prorated rent and deposit refunds during tenant-initiated vacating while preserving invoice access for vacated past tenants.",
    "github": "https://github.com/AravindhPrabu2005/RK-Tenents",
    "stack": ["React.js", "Node.js", "MongoDB"],
    "featured": false,
    "allOrder": 8
  }
];

const Allprojects = () => {
  const [projects, setProjects] = useState(() => {
    const cachedAll = getCachedOrFallback("cache_projects", STATIC_PROJECTS_FALLBACK);
    return (cachedAll || []).sort((a, b) => (a.allOrder || 0) - (b.allOrder || 0));
  });
  const [modalImage, setModalImage] = useState(null);

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  useEffect(() => {
    axiosInstance.get("/api/projects")
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setCache("cache_projects", res.data);
          const sorted = res.data.sort((a, b) => (a.allOrder || 0) - (b.allOrder || 0));
          setProjects(sorted);
        }
      })
      .catch(err => console.error("Error loading projects:", err));
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen w-full py-20 px-6 md:px-12 lg:px-24 items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      {/* Page Header */}
      <div className="relative text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-3">
          All <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Projects</span>
        </h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-4 text-lg">Complete portfolio of my work</p>
      </div>

      {/* Projects Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {projects.map((project, index) => (
          <div 
            key={project._id || index} 
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Gradient border effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
            
            <div className="relative">
              {/* Image Container */}
              <div 
                className="relative h-48 overflow-hidden bg-slate-950 flex items-center justify-center cursor-zoom-in"
                onClick={() => openModal(project.image)}
                title="Click to view full image"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Subtle Hover Zoom Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <span className="p-2.5 bg-slate-900/80 border border-white/10 rounded-full text-white backdrop-blur-xs flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </span>
                </div>

                {/* Indicator Badges (Top-Right) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30">
                  {project.liveLink && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/90 text-white text-[10px] font-bold uppercase rounded-md shadow-sm backdrop-blur-xs tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Live
                    </span>
                  )}
                  {project.videoLink && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/90 text-white text-[10px] font-bold uppercase rounded-md shadow-sm backdrop-blur-xs tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Video
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                  {project.title}
                </h2>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack && project.stack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="whitespace-pre-line text-sm text-gray-300 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>

                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-750 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  )}

                  {project.videoLink && (
                    <a
                      href={project.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-750 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/25"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Video Tour
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400 text-lg">Projects coming soon...</p>
        </div>
      )}
      {/* Image Modal Lightbox */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-10 cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={modalImage} 
              alt="Project" 
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Allprojects;
