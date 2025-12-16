import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';


const SkillItem = ({ iconClass, name, desc }) => (
  <div className="group flex items-center space-x-2 p-2 bg-white/5 backdrop-blur-sm rounded-lg border border-purple-500/20 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
      <i className={`text-lg text-purple-300 group-hover:text-purple-200 ${iconClass}`}></i>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-xs text-white">{name}</p>
      <p className="text-[10px] text-gray-400">{desc}</p>
    </div>
  </div>
)


const SkillCategory = ({ title, children }) => (
  <div className="flex flex-col space-y-2">
    <div className="mb-2">
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
    </div>
    <div className="flex flex-col space-y-2">{children}</div>
  </div>
)


const Skills = () => (
  <section id="skills" className="relative py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

    <div className="relative max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-3">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Skills</span>
        </h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-4 text-lg">Technologies and tools I work with</p>
      </div>

      {/* Skills Grid Container with Scroll Hint */}
      <div className="relative">
        {/* Scroll Hint - Only visible on mobile */}
        <div className="md:hidden absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-800 to-transparent pointer-events-none z-10 flex items-center justify-end pr-2">
          <div className="scroll-hint-arrow">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Skills Grid - Desktop: Grid Layout, Mobile: Horizontal Scroll */}
        <div className="overflow-x-auto md:overflow-x-visible pb-6 scrollbar-hide">
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 min-w-max md:min-w-0">
            <SkillCategory title="Frontend">
              <SkillItem iconClass="fab fa-html5" name="HTML" desc="Web structure" />
              <SkillItem iconClass="fab fa-css3-alt" name="CSS" desc="Web styling" />
              <SkillItem iconClass="fab fa-js" name="JavaScript" desc="Interactivity" />
              <SkillItem iconClass="fab fa-react" name="React.js" desc="Frontend Library" />
              <SkillItem iconClass="fas fa-wind" name="Tailwind CSS" desc="Utility-first CSS" />
              <SkillItem iconClass="fab fa-bootstrap" name="Bootstrap" desc="CSS Framework" />
            </SkillCategory>

            <SkillCategory title="Backend">
              <SkillItem iconClass="fab fa-node-js" name="Node.js" desc="JavaScript runtime" />
              <SkillItem iconClass="fas fa-server" name="Express.js" desc="Web framework" />
              <SkillItem iconClass="fas fa-plug" name="REST API" desc="API architecture" />
              <SkillItem iconClass="fas fa-rocket" name="FastAPI" desc="Python API framework" />
              <SkillItem iconClass="fas fa-database" name="Mongoose" desc="MongoDB ODM" />
            </SkillCategory>

            <SkillCategory title="Databases">
              <SkillItem iconClass="fas fa-database" name="MongoDB" desc="NoSQL database" />
              <SkillItem iconClass="fas fa-database" name="PostgreSQL" desc="Relational database" />
              <SkillItem iconClass="fas fa-database" name="MySQL" desc="Relational database" />
            </SkillCategory>

            <SkillCategory title="Tools & Platforms">
              <SkillItem iconClass="fab fa-git-alt" name="Git" desc="Version control" />
              <SkillItem iconClass="fab fa-github" name="GitHub" desc="Code hosting" />
              <SkillItem iconClass="fas fa-vial" name="Postman" desc="API testing" />
              <SkillItem iconClass="fab fa-docker" name="Docker" desc="App containerization" />
              <SkillItem iconClass="fab fa-microsoft" name="Azure" desc="Cloud platform" />
            </SkillCategory>

            <SkillCategory title="Programming Languages">
              <SkillItem iconClass="fab fa-java" name="Java" desc="OOP language" />
              <SkillItem iconClass="fas fa-code" name="SQL" desc="Query language" />
              <SkillItem iconClass="fab fa-js" name="JavaScript" desc="Frontend & backend scripting" />
              <SkillItem iconClass="fas fa-code" name="C" desc="Procedural programming" />
            </SkillCategory>
          </div>
        </div>
      </div>

      {/* Certifications CTA with Attention-Grabbing Animation */}
      <div className="w-full mt-12 flex justify-center">
        <Link
          to="/certificates"
          className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 pulse-glow"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          
          {/* Shimmer effect */}
          <span className="shimmer-effect"></span>
          
          {/* Pulsing ring */}
          <span className="pulse-ring"></span>
          
          <span className="relative flex items-center gap-3">
            View my certifications
            <FaLongArrowAltRight className="group-hover:translate-x-1 transition-transform duration-300 bounce-arrow" size={20} />
          </span>
        </Link>
      </div>
    </div>
  </section>
)


export default Skills
