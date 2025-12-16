import { AiOutlineLinkedin, AiOutlineGithub } from "react-icons/ai";
import { SiLeetcode, SiMedium } from "react-icons/si";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    const socialLinks = {
        linkedin: 'https://www.linkedin.com/in/aravindhprabu-full-stack-developer/',
        github: 'https://github.com/AravindhPrabu2005',
        leetcode: 'https://leetcode.com/u/aravindhprabu2005/',
        medium: "https://medium.com/@aravindhprabu2005"
    };

    return (
        <footer className="relative bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
            {/* Subtle top border gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-3">
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Aravindh Prabu
                        </h3>
                        <p className="text-gray-400 text-sm">Full-stack Developer</p>
                    </div>

                    {/* Quick Links */}
                    <nav className="flex flex-wrap justify-center gap-6 text-sm">
                        <a href="/#about" className="text-gray-400 hover:text-white transition-colors duration-300">
                            About
                        </a>
                        <a href="/#skills" className="text-gray-400 hover:text-white transition-colors duration-300">
                            Skills
                        </a>
                        <a href="/#experience" className="text-gray-400 hover:text-white transition-colors duration-300">
                            Experience
                        </a>
                        <a href="/#projects" className="text-gray-400 hover:text-white transition-colors duration-300">
                            Projects
                        </a>
                        <a href="/#contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                            Contact
                        </a>
                    </nav>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        <a 
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                            aria-label="LinkedIn"
                        >
                            <AiOutlineLinkedin className="text-gray-400 group-hover:text-purple-300 transition-colors" size={20} />
                        </a>
                        <a 
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                            aria-label="GitHub"
                        >
                            <AiOutlineGithub className="text-gray-400 group-hover:text-purple-300 transition-colors" size={20} />
                        </a>
                        <a 
                            href={socialLinks.leetcode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                            aria-label="LeetCode"
                        >
                            <SiLeetcode className="text-gray-400 group-hover:text-purple-300 transition-colors" size={20} />
                        </a>
                        <a 
                            href={socialLinks.medium}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-3 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-110"
                            aria-label="Medium"
                        >
                            <SiMedium className="text-gray-400 group-hover:text-purple-300 transition-colors" size={20} />
                        </a>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                    <p>
                        &copy; {currentYear} Aravindh Prabu. All rights reserved.
                    </p>
                    <p className="flex items-center gap-2">
                        Built with 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                            React
                        </span> 
                        & 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                            Tailwind CSS
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
