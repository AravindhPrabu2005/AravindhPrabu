import React from 'react';

const achievements = [
  {
    title: 'SRCAS Hackathon 2024',
    position: 'Finalist',
    description: 'Built a full-stack decentralized energy trading platform using MERN and Coinbase payment API. Presented a working prototype to the jury.',
    certificate: '/certificates/srcas-hackathon.png',
    link: 'https://example.com/srcas-certificate'
  },
  {
    title: 'WOW Tamil Nadu - GDSE',
    position: 'Participant',
    description: 'Represented college in the GDSE WOW Tamil Nadu state-level tech event. Contributed to problem-solving and team-building exercises.',
    certificate: '/certificates/wow-tn.png',
    link: 'https://example.com/wowtn-certificate'
  },
  {
    title: 'Datathon Challenge by SmartInternz',
    position: 'Top 5% Performer',
    description: 'Cleaned large datasets, applied ML techniques and built data dashboards using Python and PowerBI.',
    certificate: '/certificates/datathon.png',
    link: 'https://example.com/datathon-certificate'
  }
];

const Achievements = () => {
  return (
    <div className="flex flex-col min-h-screen w-full py-20 px-5 items-center bg-primary text-white">
      <h1 className="text-4xl font-bold mb-10 text-white">My Achievements</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {achievements.map((item, index) => (
          <div key={index} className="bg-white text-black rounded-xl shadow-md overflow-hidden w-full max-w-[300px] mx-auto">
            <img src={item.certificate} alt={item.title} className="w-full h-[160px] object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-purple-700">{item.title}</h2>
              <p className="text-sm text-blue-800 font-semibold">{item.position}</p>
              <p className="mt-2 text-sm text-gray-700">{item.description}</p>
              <a
                href={item.link}
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

export default Achievements;
