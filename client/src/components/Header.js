import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'


export default function Header() {
    const [toggleMenu, setToggleMenu] = useState(false);


    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4 flex justify-between items-center">
                {/* Logo */}
                <a 
                    className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 transition-all duration-300" 
                    href="/"
                >
                    aravindhprabu.me
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex items-center gap-8 text-gray-300">
                        <li>
                            <a 
                                href="/" 
                                className="relative group text-base font-medium hover:text-white transition-colors duration-300"
                            >
                                Home
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#skills" 
                                className="relative group text-base font-medium hover:text-white transition-colors duration-300"
                            >
                                Skills
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#experience" 
                                className="relative group text-base font-medium hover:text-white transition-colors duration-300"
                            >
                                Experience
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#projects" 
                                className="relative group text-base font-medium hover:text-white transition-colors duration-300"
                            >
                                Projects
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#contact" 
                                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setToggleMenu(!toggleMenu)} 
                    className='block md:hidden p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors duration-300'
                    aria-label="Toggle menu"
                >
                    {toggleMenu ? (
                        <XMarkIcon className='text-white h-6 w-6'/>
                    ) : (
                        <Bars3Icon className='text-white h-6 w-6'/>
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {toggleMenu && (
                <nav className="block md:hidden bg-slate-900/95 backdrop-blur-md border-t border-purple-500/20">
                    <ul 
                        onClick={() => setToggleMenu(!toggleMenu)} 
                        className="flex flex-col py-4"
                    >
                        <li>
                            <a 
                                href="/" 
                                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-300 border-l-4 border-transparent hover:border-purple-400"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#skills" 
                                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-300 border-l-4 border-transparent hover:border-purple-400"
                            >
                                Skills
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#experience" 
                                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-300 border-l-4 border-transparent hover:border-purple-400"
                            >
                                Experience
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#projects" 
                                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-300 border-l-4 border-transparent hover:border-purple-400"
                            >
                                Projects
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/#contact" 
                                className="block px-6 py-3 text-gray-300 hover:text-white hover:bg-purple-500/10 transition-all duration-300 border-l-4 border-transparent hover:border-purple-400"
                            >
                                Contact
                            </a>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
