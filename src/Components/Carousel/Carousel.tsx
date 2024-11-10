import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import { useNavigate } from "react-router-dom";

type Slide = {
  imageUrl: string;
};

const slides: Slide[] = [
  {
    imageUrl: "/images/caurousel/m1acnkuz77djwysa293cta1800x833.webp",
  },
  {
    imageUrl: "/images/caurousel/m1h7ajcd0sottxawyzu9a_Heroweb.webp",
  },
  {
    imageUrl: "/images/caurousel/m1ra3e0i7won6u05a1qJ1800x833.webp",
  },
  {
    imageUrl: "/images/caurousel/m1h5t6esl6r65pev2xp1800x833b.webp",
  },
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  return (
    <div className="relative w-full h-[700px] mb-8">
      <img
        src={slides[currentSlide].imageUrl}
        alt="hình ảnh carousel"
        className="w-full h-full object-cover cursor-pointer"
     
      />

      <button
        onClick={handlePrevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-3 rounded-full"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 text-black p-3 rounded-full"
      >
        <FaChevronRight />
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 mx-2 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
