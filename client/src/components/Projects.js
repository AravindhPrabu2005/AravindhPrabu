import { Link } from 'react-router-dom';
import websiteImg1 from '../assets/ecommerce-websites.jpg';
import websiteImg2 from '../assets/food-ecommerce.jpg';
import websiteImg3 from '../assets/website-blog.jpg';
import { FaLongArrowAltRight } from "react-icons/fa";


export default function Projects() {

    const config = {
        projects: [
            {
                image: websiteImg1,
                description: 'A Ecommerce Website. Built with MERN Stack.',
                link: 'https://github.com/jvlcode/jvlcart'
            },
            {
                image: websiteImg2,
                description: 'Food Ecommerce website like Swiggy, Built with Angular & .Net',
                link: 'https://github.com/jvlcode/food'
            },
            {
                image: websiteImg3,
                description: 'Basic Blog Website . Built with Next JS and MongoDB',
                link: 'https://github.com/jvlcode/blog'
            },
        ]
    }

    return (
        <section id='projects' className="relative py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className="relative max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-6xl font-bold mb-3">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Projects</span>
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
                    <p className="text-gray-400 mt-4 text-lg">Some of my best work. Check them out.</p>
                </div>

                {/* Projects Grid */}
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
                    {config.projects.map((project, index) => (
                        <div 
                            key={project.link}
                            className='group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20'
                        >
                            {/* Gradient border effect on hover */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                            
                            <div className="relative">
                                {/* Image Container */}
                                <div className='relative h-[200px] overflow-hidden'>
                                    <img 
                                        className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500' 
                                        src={project.image}
                                        alt="Project thumbnail"
                                    />
                                    {/* Gradient overlay */}
                                    <div className='absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500'></div>
                                    
                                    {/* View Project Button Overlay */}
                                    <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500'>
                                        <a 
                                            href={project.link}
                                            target='_blank'
                                            rel="noopener noreferrer"
                                            className='px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:from-purple-600 hover:to-pink-600 flex items-center gap-2 shadow-lg'
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View Project
                                        </a>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className='p-6'>
                                    <p className='text-gray-300 text-sm leading-relaxed'>
                                        {project.description}
                                    </p>
                                    
                                    {/* Tech stack indicator (optional visual enhancement) */}
                                    <div className='mt-4 flex items-center gap-2'>
                                        <div className='flex-1 h-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full'></div>
                                        <span className='text-xs text-purple-400 font-medium'>Project #{index + 1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Projects CTA */}
                <div className="w-full flex justify-center">
                    <Link
                        to="/allprojects"
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full overflow-hidden shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 pulse-glow"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        
                        {/* Shimmer effect */}
                        <span className="shimmer-effect"></span>
                        
                        {/* Pulsing ring */}
                        <span className="pulse-ring"></span>
                        
                        <span className="relative flex items-center gap-3">
                            View All Projects
                            <FaLongArrowAltRight className="group-hover:translate-x-1 transition-transform duration-300 bounce-arrow" size={20} />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
