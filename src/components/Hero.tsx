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
              alt="Anime World"
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
            <button className="bg-violetBrand text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity duration-200 shadow-lg">
              <a href="#contact">Contact Us</a>
            </button>
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
