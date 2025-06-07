import React from 'react';

const certifications = [
  {
    title: 'AI-ML Virtual Internship',
    provider: 'Eduskills & AWS Academy',
    date: 'March 2024',
    certificateLink: 'https://example.com/certificates/ai-ml',
    image: '/certificates/aiml.png'
  },
  {
    title: 'Google Cloud Arcade Program',
    provider: 'Google',
    date: 'April 2024',
    certificateLink: 'https://example.com/certificates/gcp',
    image: '/certificates/gcp.png'
  },
  {
    title: 'Frontend Development Bootcamp',
    provider: 'DevTown',
    date: 'February 2024',
    certificateLink: 'https://example.com/certificates/frontend',
    image: '/certificates/frontend.png'
  }
];

const Certifications = () => {
  return (
    <div className="flex flex-col min-h-screen w-full py-20 px-5 items-center bg-secondary text-white">
      <h1 className="text-4xl font-bold mb-10">My Certifications</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {certifications.map((cert, index) => (
          <div key={index} className="bg-white text-black rounded-xl shadow-md overflow-hidden w-full max-w-[300px] mx-auto">
            <img src={cert.image} alt={cert.title} className="w-full h-[160px] object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-purple-700">{cert.title}</h2>
              <p className="text-sm text-gray-700">{cert.provider}</p>
              <p className="text-xs text-gray-600 mt-1">{cert.date}</p>
              <a
                href={cert.certificateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-3 py-1.5 text-sm bg-black text-white rounded-md"
              >
                View Certificate
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
