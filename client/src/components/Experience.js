import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';


const experiences = [
  {
    role: "FREELANCING | FRONT-END DEVELOPER",
    logo: "/Experience/freelancing.png",
    duration: "July 2024 – Sep 2024",
    location: "Coimbatore, India",
    points: [
      "Collaborated with a freelancer to work on holidayjoy.com project.",
      "Managed tasks via Jira and contributed on GitHub.",
      "Utilized React.js and TailwindCSS in the tech stack."
    ]
  },
  {
    role: "INTERNSHIP | RBG.ai",
    logo: "/Experience/RBG.jpeg",
    duration: "Dec 2024 – Jan 2025",
    location: "Coimbatore, India",
    points: [
      "Worked with MongoDB, Fast API and React.js with TailwindCSS.",
      "Developed a web application for attendance & task management (Internal ERP).",
      "Improved security by creating JWT auth and writing protected routes.",
      "Improved User experience by adding Role based entry."
    ]
  }
]


const Experience = () => {
  return (
    <section id="experience" className="relative py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold mb-3">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Experience</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-4 text-lg">Professional journey and growth</p>
        </div>

        {/* Experience Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {experiences.map(({ role, logo, duration, location, points }, index) => (
            <div 
              key={index} 
              className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
            >
              {/* Gradient border effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
              
              <div className="relative">
                {/* Header with logo */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-2 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                    <img src={logo} alt="Company logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                      {role}
                    </h3>
                    <div className="flex flex-col text-sm text-gray-400 mt-1 space-y-1">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-4"></div>

                {/* Points */}
                <ul className="space-y-3">
                  {points.map((point, i) => (
                    <li key={i} className="flex items-start space-x-2 text-gray-300 text-sm">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mt-2"></span>
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements CTA with Animation */}
        <div className="w-full flex justify-center">
          <Link
            to="/achivements"
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 pulse-glow"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            
            {/* Shimmer effect */}
            <span className="shimmer-effect"></span>
            
            {/* Pulsing ring */}
            <span className="pulse-ring"></span>
            
            <span className="relative flex items-center gap-3">
              Hackathons and achievements
              <FaLongArrowAltRight className="group-hover:translate-x-1 transition-transform duration-300 bounce-arrow" size={20} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}


export default Experience
