import React from "react";
import ScratchCard from "./ScratchCard";

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="w-full h-full">
        <ScratchCard
          foregroundImage="/assets/hero_foreground_image.png"
          backgroundImage="/assets/hero_background_image.png"
          brushSize={30}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center  text-center z-10 pointer-events-none">
        <div className=" p-8 rounded-lg max-w-xl mx-4 ">
          <div className="flex flex-row justify-center pointer-events-auto mb-8">
            <img
              src="/assets/yuki_logo.png"
              alt="Yuki"
              className="h-20 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-white -webkit-text-stroke-[2px] -webkit-text-stroke-black bg-clip-text text-transparent">
              YUKI MADNESS
            </span>
          </h1>
          <p className=" font-gilroy text-opacity-50 text-lg md:text-xl text-white mb-8">
            Join the waitlist! To unveil the madness of YUKI craz
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pointer-events-auto">
            <a href="#contact" className="relative inline-block text-lg group">
              <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                <span className="relative">Contact Us</span>
              </span>
              <span
                className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
              ></span>
            </a>

            {/* <button className="bg-transparent text-white font-bold py-3 px-6 rounded-full border-2 border-white hover:bg-white hover:text-violetBrand transition-colors duration-200">
              Watch Trailer
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
