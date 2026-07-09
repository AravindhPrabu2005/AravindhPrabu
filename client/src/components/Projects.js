import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import { FaLongArrowAltRight } from "react-icons/fa";

export default function Projects() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axiosInstance.get("/api/projects")
            .then(res => {
                const featuredProjects = (res.data || []).filter(p => p.featured);
                setProjects(featuredProjects);
            })
            .catch(err => console.error("Error fetching projects:", err));
    }, []);

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
                    {projects.map((project, index) => (
                        <div 
                            key={project._id || index}
                            className='group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20'
                        >
                            {/* Gradient border effect on hover */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                            
                            <div className="relative">
                                {/* Image Container */}
                                <div className='relative h-[200px] overflow-hidden bg-slate-950 flex items-center justify-center'>
                                    <img 
                                        className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500' 
                                        src={project.image}
                                        alt={project.title}
                                    />
                                    {/* Indicator Badges (Top-Right) */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-30">
                                        {project.liveLink && (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/90 text-white text-[10px] font-bold uppercase rounded-md shadow-sm backdrop-blur-xs tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                                Live
                                            </span>
                                        )}
                                        {project.videoLink && (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/90 text-white text-[10px] font-bold uppercase rounded-md shadow-sm backdrop-blur-xs tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                                Video
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Glassmorphic hover overlay */}
                                    <div className='absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] z-10'></div>
                                    
                                    {/* View Project Action Links Overlay */}
                                    <div className='absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20'>
                                        {/* GitHub Link */}
                                        <a 
                                            href={project.github}
                                            target='_blank'
                                            rel="noopener noreferrer"
                                            className='p-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95'
                                            title="View GitHub Repository"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                        </a>
                                        {/* Live Link */}
                                        {project.liveLink && (
                                            <a 
                                                href={project.liveLink}
                                                target='_blank'
                                                rel="noopener noreferrer"
                                                className='p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-110 active:scale-95'
                                                title="Open Live Demo"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        )}
                                        {project.videoLink && (
                                            <a 
                                                href={project.videoLink}
                                                target='_blank'
                                                rel="noopener noreferrer"
                                                className='p-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center shadow-lg shadow-rose-500/20 cursor-pointer hover:scale-110 active:scale-95'
                                                title="Watch Video Tour"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className='p-6 space-y-2'>
                                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-purple-300 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className='text-gray-300 text-sm leading-relaxed min-h-[48px] line-clamp-2'>
                                        {project.description}
                                    </p>
                                    
                                    {/* Tech stack indicator */}
                                    <div className='pt-2 flex items-center gap-2'>
                                        <div className='flex-1 h-1 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full'></div>
                                        <span className='text-xs text-purple-400 font-medium'>Project #{index + 1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="py-12 text-center text-gray-500">
                        No featured projects found. Check back later!
                    </div>
                )}

                {/* View All Projects CTA */}
                <div className="w-full flex justify-center">
                    <Link
                        to="/allprojects"
                        className="group relative px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg md:text-xl font-bold rounded-full overflow-hidden shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 pulse-glow"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        
                        {/* Shimmer effect */}
                        <span className="shimmer-effect"></span>
                        
                        {/* Pulsing ring */}
                        <span className="pulse-ring"></span>
                        
                        <span className="relative flex items-center gap-3">
                            View All Projects
                            <FaLongArrowAltRight className="group-hover:translate-x-2 transition-transform duration-300 bounce-arrow" size={24} />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
