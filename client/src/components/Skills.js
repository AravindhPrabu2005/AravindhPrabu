import React from 'react'
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link } from 'react-router-dom';



const SkillItem = ({ iconClass, name, desc }) => (
  <div className="flex items-center space-x-2 min-w-[140px]">
    <i className={`text-3xl ${iconClass}`}></i>
    <div>
      <p className="font-semibold text-sm">{name}</p>
      <p className="text-xs text-gray-300">{desc}</p>
    </div>
  </div>
)

const SkillCategory = ({ title, children }) => (
  <div className="flex flex-col space-y-4 min-w-[180px]">
    <h3 className="text-xl font-semibold mb-2 border-b-2 border-white w-fit">{title}</h3>
    <div className="flex flex-col space-y-3">{children}</div>
  </div>
)

const Skills = () => (
  <section id="skills" className="flex flex-col py-12 px-6 justify-center bg-secondary text-white overflow-x-auto">
    <h2 className="text-4xl font-bold mb-8 border-b-4 border-white w-fit self-center">My Skills</h2>
    <div className="flex space-x-16">
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
    <div className="w-full mt-10 flex justify-center">
            <Link
                to="/certificates"
                className="bg-secondary border-4 border-white text-white font-semibold px-10 py-3 hover:bg-opacity-80 transition flex items-center gap-3"
            >
                View my certifications <FaLongArrowAltRight size={20} />
            </Link>
        </div>
  </section>
)

export default Skills
