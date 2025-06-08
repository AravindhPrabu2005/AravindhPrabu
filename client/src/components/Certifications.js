import React from 'react';

const certifications = [
  {
    title: 'The Complete Full-Stack Web Development Bootcamp',
    provider: 'Udemy',
    image: '/Certifications/full stack development.png',
    description: 'A comprehensive course covering both frontend and backend technologies, including HTML, CSS, JavaScript, React, Node.js, and more.'
  },
  {
    title: 'Software Development Lifecycle Fundamentals',
    provider: 'Great Learning',
    image: '/Certifications/SDLC principles.jpg',
    description: 'An introduction to the software development lifecycle, covering methodologies, processes, and best practices for software development.'
  }
];

const Certifications = () => {
  return (
    <div className="flex flex-col min-h-screen w-full py-20 px-5 items-center bg-secondary text-white">
      <h1 className="text-4xl font-bold mb-10">My Certifications</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {certifications.map((cert, index) => (
          <div key={index} className="bg-white text-black rounded-xl shadow-md overflow-hidden w-full max-w-[300px] mx-auto">
            <img src={cert.image} alt={cert.title} className="w-full h-[200px] object-contain bg-white" />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-purple-700">{cert.title}</h2>
              <p className="text-sm text-gray-700 underline">{cert.provider}</p>
              <p className="text-sm text-gray-800 mt-2 leading-relaxed">{cert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
