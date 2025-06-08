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
    <section id="experience" className="bg-primary text-white py-16 px-6 md:px-20">
      <h2 className="text-4xl font-bold mb-12 border-b-4 border-white w-fit">My Experience</h2>
      <div className="flex flex-col md:flex-row md:space-x-12 space-y-10 md:space-y-0">
        {experiences.map(({ role, logo, duration, location, points }, index) => (
          <div key={index} className="bg-secondary p-6 rounded-lg shadow-lg flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <img src={logo} alt="logo" className="w-6 h-6 object-cover" />
              <h3 className="text-lg font-semibold">{role}</h3>
            </div>
            <p className="text-sm text-gray-300 mb-3">{duration} | {location}</p>
            <ul className="list-disc list-inside space-y-2 text-gray-200">
              {points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="w-full mt-10 flex justify-center">
            <Link
                to="/achivements"
                className="bg-primary border-4 border-white text-white font-semibold px-10 py-3 hover:bg-opacity-80 transition flex items-center gap-3"
            >
                Hackathons and achivements <FaLongArrowAltRight size={20} />
            </Link>
        </div>
    </section>
  )
}

export default Experience
