import HeroImg from '../assets/hero.png';
import { AiOutlineLinkedin, AiOutlineGithub } from "react-icons/ai";
import { SiLeetcode } from "react-icons/si";
import { SiMedium } from "react-icons/si";


export default function Hero() {
    const config = {
        subtitle: "I'm a Full-stack web developer",
        social: {
            linkedin: 'https://www.linkedin.com/in/aravindhprabu-full-stack-developer/',
            github: 'https://github.com/AravindhPrabu2005',
            leetcode: 'https://leetcode.com/u/aravindhprabu2005/',
            Medium: "https://medium.com/@aravindhprabu2005"
        }
    };


    return (
        <section className="relative min-h-screen flex items-center px-6 md:px-12 lg:px-24 py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12">
                {/* Text Content */}
                <div className="flex-1 space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-xl md:text-2xl font-light text-purple-300 tracking-wide">
                            Hi, I'm
                        </h2>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Aravindh
                            </span>
                            <br />
                            Prabu
                        </h1>
                        <p className="text-2xl md:text-3xl text-gray-300 font-light">
                            {config.subtitle}
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4 pt-4">
                        <a 
                            href={config.social.linkedin} 
                            className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
                            aria-label="LinkedIn"
                        >
                            <AiOutlineLinkedin className="text-white group-hover:text-purple-300 transition-colors" size={32} />
                        </a>
                        <a 
                            href={config.social.github} 
                            className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
                            aria-label="GitHub"
                        >
                            <AiOutlineGithub className="text-white group-hover:text-purple-300 transition-colors" size={32} />
                        </a>
                        {/* <a 
                            href={config.social.leetcode} 
                            className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
                            aria-label="LeetCode"
                        >
                            <SiLeetcode className="text-white group-hover:text-purple-300 transition-colors" size={32} />
                        </a> */}
                        <a 
                            href={config.social.Medium} 
                            className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/50"
                            aria-label="Medium"
                        >
                            <SiMedium className="text-white group-hover:text-purple-300 transition-colors" size={32} />
                        </a>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="flex-1 flex justify-center items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <img 
                            className="relative w-80 h-80 md:w-96 md:h-96 object-cover rounded-full border-4 border-purple-400/30 shadow-2xl shadow-purple-500/50" 
                            src={HeroImg} 
                            alt="Aravindh Prabu" 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
