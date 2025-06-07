import React from 'react';

const projects = [
  {
    title: 'Mealzy Health',
    image: '/path/to/your/image.png', // replace with actual image path
    description: 'Mealzy Health is a health and wellness companion powered by AI, designed to help users make smarter food choices, monitor their nutritional intake, and build sustainable habits.',
    stack: ['React Native', 'Node js', 'MongoDb', 'Next js'],
    github: 'https://github.com/your-repo/mealzy-health'
  },
  {
    title: 'Mealzy Health',
    image: '/path/to/your/image.png', // replace with actual image path
    description: 'Mealzy Health is a health and wellness companion powered by AI, designed to help users make smarter food choices, monitor their nutritional intake, and build sustainable habits.',
    stack: ['React Native', 'Node js', 'MongoDb', 'Next js'],
    github: 'https://github.com/your-repo/mealzy-health'
  },
  {
    title: 'Mealzy Health',
    image: '/path/to/your/image.png', // replace with actual image path
    description: 'Mealzy Health is a health and wellness companion powered by AI, designed to help users make smarter food choices, monitor their nutritional intake, and build sustainable habits.',
    stack: ['React Native', 'Node js', 'MongoDb', 'Next js'],
    github: 'https://github.com/your-repo/mealzy-health'
  },
  {
    title: 'Mealzy Health',
    image: '/path/to/your/image.png', // replace with actual image path
    description: 'Mealzy Health is a health and wellness companion powered by AI, designed to help users make smarter food choices, monitor their nutritional intake, and build sustainable habits.',
    stack: ['React Native', 'Node js', 'MongoDb', 'Next js'],
    github: 'https://github.com/your-repo/mealzy-health'
  },
];

const Allprojects = () => {
  return (
    <div className="flex flex-col min-h-screen w-full py-20 px-5 items-center bg-secondary text-white">
      <h1 className="text-4xl font-bold mb-10 text-white">All Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {projects.map((project, index) => (
          <div key={index} className="bg-white text-black rounded-xl shadow-md overflow-hidden w-full max-w-[300px] mx-auto">
            <img src={project.image} alt={project.title} className="w-full h-[160px] object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-purple-700">{project.title}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.stack.map((tech, i) => (
                  <span key={i} className="text-xs text-blue-700 underline">{tech}</span>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-700">{project.description}</p>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-3 py-1.5 text-sm bg-black text-white rounded-md"
              >
                Github
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allprojects;
