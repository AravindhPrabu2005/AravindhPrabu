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

    return <section id='projects' className="flex flex-col py-20 px-5 justify-center bg-secondary text-white">
        <div className="w-full">
            <div className="flex flex-col px-10 py-5">
                <h1 className="text-4xl border-b-4 border-secondary mb-5 w-[150px] font-bold">Projects</h1>
                <p>These are some of my best projects. Check them out.</p>
            </div>
        </div>
        <div className="w-full">
            <div className='flex flex-col md:flex-row px-10 gap-5'>
                {config.projects.map((project) => (
                    <div className='relative' key={project.link}>
                        <img className='h-[200px] w-[500px]' src={project.image} />
                        <div className='project-desc'>
                            <p className='text-center px-5 py-5'>{project.description}</p>
                            <div className='flex justify-center'>
                                <a className='btn' target='_blank' href={project.link}>View Project</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="w-full mt-10 flex justify-center">
            <Link
                to="/allprojects"
                className="bg-secondary border-4 border-white text-white font-semibold px-10 py-3 hover:bg-opacity-80 transition flex items-center gap-3"
            >
                View All Projects <FaLongArrowAltRight size={20} />
            </Link>
        </div>
    </section>
}
