import React, { useState } from 'react';

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
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = (image, title) => {
    setModalImage(image);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalTitle('');
  };

  return (
    <div className="relative flex flex-col min-h-screen w-full py-20 px-6 md:px-12 lg:px-24 items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      {/* Page Header */}
      <div className="relative text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-3">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Certifications</span>
        </h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-4 text-lg">Professional development and continuous learning</p>
      </div>

      {/* Certifications Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {certifications.map((cert, index) => (
          <div 
            key={index} 
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Image Container with Zoom Indicator */}
            <div 
              className="relative w-full h-64 bg-slate-800 flex justify-center items-center overflow-hidden cursor-pointer"
              onClick={() => openModal(cert.image, cert.title)}
            >
              <img 
                src={cert.image} 
                alt={cert.title} 
                className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-500" 
              />
              
              {/* Zoom overlay indicator */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                  <span className="text-white text-sm font-semibold">Click to zoom</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-2 leading-tight">{cert.title}</h2>
              
              {/* Provider Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-3">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-sm font-semibold text-purple-300">{cert.provider}</span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">{cert.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Message (if needed for future) */}
      {certifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400 text-lg">More certifications coming soon...</p>
        </div>
      )}

      {/* Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110 z-10"
            aria-label="Close modal"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal content */}
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate title */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-t-lg px-6 py-4 mb-2">
              <h3 className="text-white text-lg font-semibold text-center">{modalTitle}</h3>
            </div>

            {/* Image */}
            <img 
              src={modalImage} 
              alt="Certificate" 
              className="w-full h-full object-contain rounded-b-lg shadow-2xl bg-white/5"
            />
          </div>

          {/* Click outside hint */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
            Click anywhere to close
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
