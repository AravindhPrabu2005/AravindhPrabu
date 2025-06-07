import AboutImg from '../assets/about.png';

export default function About () {
    const config  = {
        line1: "I'm Aravindh Prabu, a passionate software developer and computer science student driven by curiosity and creativity. I love turning complex problems into simple, elegant solutions through code. With hands-on experience in both frontend and backend technologies like React and Node.js, I’ve developed the ability to adapt quickly to any tech stack. This flexibility, combined with my full-stack knowledge, makes me stand out as a developer who can seamlessly bridge the gap between design and functionality. Whether it's building intuitive interfaces or robust backend systems, I’m always ready to learn, build, and grow. Let’s create something amazing together."
    }

    return <section className='flex flex-col md:flex-row bg-secondary px-5' id='about'>
        <div className='py-5 md:w-1/2'>
            <img src={AboutImg} />
        </div>
        <div className='md:w-1/2 flex justify-center'>
            <div className='flex flex-col justify-center text-white'>
                <h1 className='text-4xl border-b-4 border-primary mb-5 w-[170px] font-bold'>About Me</h1>
                <p className='pb-5'>{config.line1}</p>
                {/* <p className='pb-5'>{config.line2}</p>
                <p className='pb-5'>{config.line3}</p> */}
            </div>
        </div>
    </section>
}