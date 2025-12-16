import AboutImg from '../assets/about.png';


export default function About () {
    const config  = {
        line1: "I'm Aravindh Prabu, a passionate software developer and computer science student driven by curiosity and creativity. I love turning complex problems into simple, elegant solutions through code. With hands-on experience in both frontend and backend technologies like React and Node.js, I've developed the ability to adapt quickly to any tech stack. This flexibility, combined with my full-stack knowledge, makes me stand out as a developer who can seamlessly bridge the gap between design and functionality. Whether it's building intuitive interfaces or robust backend systems, I'm always ready to learn, build, and grow. Let's create something amazing together."
    }


    return (
        <section className='relative py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden' id='about'>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

            <div className='relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12'>
                {/* Image Section */}
                <div className='flex-1 flex justify-center'>
                    <div className='relative group'>
                        {/* Animated border */}
                        <div className='absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse'></div>
                        
                        {/* Image container */}
                        <div className='relative bg-slate-800 rounded-2xl p-2 overflow-hidden'>
                            <img 
                                src={AboutImg} 
                                alt="About Aravindh Prabu"
                                className='rounded-xl w-full h-auto object-cover transform group-hover:scale-105 transition duration-500'
                            />
                            {/* Gradient overlay on hover */}
                            <div className='absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl'></div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className='flex-1 space-y-6'>
                    <div>
                        <h2 className='text-5xl md:text-6xl font-bold text-white mb-3'>
                            About <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>Me</span>
                        </h2>
                        <div className='w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
                    </div>

                    <p className='text-gray-300 text-lg leading-relaxed'>
                        {config.line1}
                    </p>

                    {/* Stats or highlights (optional enhancement) */}
                    <div className='grid grid-cols-2 gap-4 pt-4'>
                        <div className='bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300'>
                            <div className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>Full-Stack</div>
                            <div className='text-sm text-gray-400 mt-1'>Developer</div>
                        </div>
                        <div className='bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300'>
                            <div className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>Quick</div>
                            <div className='text-sm text-gray-400 mt-1'>Learner</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
