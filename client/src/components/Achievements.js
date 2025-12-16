import React, { useState } from 'react';

const achievements = [
  {
    title: "TechXcelerate 2025",
    position: '2nd Place',
    description: 'Developed a blockchain-based voting system tailored for university elections using JavaScript blockchain. Integrated a chatbot to assist users in selecting candidates by answering common queries. Awarded a cash prize of ₹25,000.',
    certificate: '/Hackathons and Achivements/TechXcelerate.jpg',
    type: 1
  },
  {
    title: "L&T Hack Appsters '25",
    position: '1st Place',
    description: 'Designed a skill-sharing platform that allows users to teach and learn from one another. Introduced a barter-style knowledge exchange system. Integrated Gemini API to enable AI mentorship and generate quizzes. Secured a cash prize of ₹25,000.',
    certificate: '/Hackathons and Achivements/L&T Hack Appsters.jpg',
    type: 1
  },
  {
    title: "SRCAS Hackathon 2024",
    position: 'Finalist',
    description: 'Built a decentralized renewable energy trading platform using React.js, Node.js, MongoDB, and Socket.io. Enabled real-time bidding for energy transactions. Achieved a 10% improvement in transaction efficiency and a 15% cost reduction through optimized algorithms.',
    certificate: '/Hackathons and Achivements/SRCAS hackathon.jpg',
    type: 1
  },
  {
    title: "SREC INNOVATE 2024",
    position: 'The Best Innovation Award',
    description: 'Created a web-based Deepfake detection system using HTML, CSS, and the open-source MesoNet algorithm. Focused on identifying manipulated media through visual pattern analysis',
    certificate: '/Hackathons and Achivements/Best Innovation award.jpg',
    type: 2
  },
  {
    title: "ICMRSH 2024 - International Conference",
    position: 'Best Paper Award',
    description: 'Published a research paper on "Digital Identity Verification Using Blockchain," detailing a secure and intelligent verification process leveraging smart contracts and AI-driven security bots.',
    certificate: '/Hackathons and Achivements/Best Paper Award.jpg',
    type: 2
  },
  {
    title: "Design Thinking Challenge 6.0",
    position: '2nd Place',
    description: 'Developed a civic engagement platform named Portal India to enable citizens to propose and discuss government schemes. Integrated interactive features such as polls, quizzes, forums, webinars, and live feedback. Received a cash award of ₹750.',
    certificate: '/Hackathons and Achivements/Best design Challange.jpg',
    type: 2
  },
  {
    title: "Tech Sprint Phase-1",
    position: 'Top Performer',
    description: 'Proposed an innovative idea titled "AI-Powered Firewall Protection Suite", which incorporates AI to dynamically detect and respond to emerging cyber threats, offering a smarter and adaptive security solution.',
    certificate: '/Hackathons and Achivements/Tech Sprint.jpg',
    type: 2
  },
  {
    title: "Curio Prompt cynosure 2k23 (Prompt Engineering contest)",
    position: '2nd Place',
    description: 'Participated in a prompt engineering contest where I successfully crafted creative strategies to elicit responses from ChatGPT on prompts typically restricted or unanswered.',
    certificate: '/Hackathons and Achivements/Curio Prompt - kgisl.jpg',
    type: 2
  },
  {
    title: "Web Design cynosure 2k23",
    position: '2nd Place',
    description: 'Tasked with designing an e-commerce platform on the spot. Developed a responsive homepage featuring top-banner image sliders and a structured product listing section.',
    certificate: '/Hackathons and Achivements/web design - kgisl.jpg',
    type: 2
  },
  {
    title: "Q'CIPHER quiz competition",
    position: '2nd Place',
    description: 'Competed in a technical quiz organized by the FOSS Club, focusing on Free and Open Source Software tools and technologies commonly used in development.',
    certificate: '/Hackathons and Achivements/Q CIPHER.jpg',
    type: 2
  },
];

const Achievements = () => {
  const [modalImage, setModalImage] = useState(null);
  const hackathons = achievements.filter(item => item.type === 1);
  const otherAchievements = achievements.filter(item => item.type === 2);

  const openModal = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const renderCards = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
        >
          {/* Image Container with Zoom Indicator */}
          <div 
            className="relative w-full h-64 bg-slate-800 flex justify-center items-center overflow-hidden cursor-pointer"
            onClick={() => openModal(item.certificate)}
          >
            <img 
              src={item.certificate} 
              alt={item.title} 
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" 
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
            <h2 className="text-xl font-bold text-white mb-2">{item.title}</h2>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {item.position}
              </p>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex flex-col min-h-screen w-full py-20 px-6 md:px-12 lg:px-24 items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      {/* Page Header */}
      <div className="relative text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-3">
          Achievements & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Participation</span>
        </h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
      </div>

      {/* Hackathons Section */}
      <div className="relative w-full max-w-7xl mb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Hackathons
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
        </div>
        {renderCards(hackathons)}
      </div>

      {/* Other Achievements Section */}
      <div className="relative w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Other Achievements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
        </div>
        {renderCards(otherAchievements)}
      </div>

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

          {/* Image container */}
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={modalImage} 
              alt="Certificate" 
              className="w-full h-full object-contain rounded-lg shadow-2xl"
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

export default Achievements;
