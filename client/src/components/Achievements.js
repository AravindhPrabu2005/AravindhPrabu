import React from 'react';

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
  const hackathons = achievements.filter(item => item.type === 1);
  const otherAchievements = achievements.filter(item => item.type === 2);

  const renderCards = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white text-black rounded-xl shadow-md overflow-hidden w-full max-w-[300px] mx-auto">
          <div className="w-full max-h-[300px] bg-gray-100 flex justify-center items-center">
            <img src={item.certificate} alt={item.title} className="w-full h-auto object-contain" />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold text-purple-700">{item.title}</h2>
            <p className="text-sm text-blue-800 underline font-semibold">{item.position}</p>
            <p className="mt-2 text-sm text-gray-700">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen w-full py-20 px-5 items-center bg-primary text-white">
      <h1 className="text-4xl font-bold mb-10 text-white">Achievements and Participation</h1>

      <h2 className="text-2xl font-semibold underline mb-6 mt-4">Hackathons</h2>
      {renderCards(hackathons)}

      <h2 className="text-2xl font-semibold underline mb-6 mt-16">Other Achievements</h2>
      {renderCards(otherAchievements)}
    </div>
  );
};

export default Achievements;
