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
    <div className="relative flex flex-col min-h-screen w-full py-20 px-6 md:px-12 lg:px-24 items-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      {/* Page Header */}
      <div className="relative text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-3">
          All <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Projects</span>
        </h1>
        <div className="w-32 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
        <p className="text-gray-400 mt-4 text-lg">Complete portfolio of my work</p>
      </div>

      {/* Projects Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20"
          >
            {/* Gradient border effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
            
            <div className="relative">
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60"></div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                  {project.title}
                </h2>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-colors duration-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* GitHub Button */}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no projects) */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="w-24 h-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-400 text-lg">Projects coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Allprojects;
