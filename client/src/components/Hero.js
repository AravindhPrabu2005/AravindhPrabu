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
        <section className="flex flex-col md:flex-row px-5 py-32 bg-primary justify-center">
            <div className="md:w-1/2 flex flex-col">
                <h1 className="text-white text-6xl font-hero-font">
                    Hi, <br /> I'm <span className="text-black">Aravindh</span> Prabu
                    <p className="text-2xl">{config.subtitle}</p>
                </h1>
                <div className="flex py-8 space-x-4">
                    <a href={config.social.linkedin} className="hover:text-white">
                        <AiOutlineLinkedin size={40} />
                    </a>
                    <a href={config.social.github} className="hover:text-white">
                        <AiOutlineGithub size={40} />
                    </a>
                    <a href={config.social.leetcode} className="hover:text-white">
                        <SiLeetcode size={40} />
                    </a>
                    <a href={config.social.Medium} className="hover:text-white">
                        <SiMedium size={40} />
                    </a>
                </div>
            </div>
            <img className="md:w-1/3" src={HeroImg} alt="Hero" />
        </section>
    );
}
