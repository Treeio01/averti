import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col w-full p-[25px] bg-[#070707] rounded-[25px] border border-[#1A1A1A] cursor-pointer transition-all duration-300 hover:border-[#1A1A1A]/80"
        >
            <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-[24px]">
                    <div className="flex w-full max-w-[64px] min-h-[64px] overflow-hidden relative">
                        <img src="/assets/img/product--card-img.svg" className="rounded-[16px]" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 8V10H22V11H21V12H20V13H19V14H18V19H19V23H17V22H15V21H13V20H11V21H9V22H7V23H5V19H6V14H5V13H4V12H3V11H2V10H1V8H8V6H9V4H10V2H11V1H13V2H14V4H15V6H16V8H23Z" fill="white"/>
                            </svg>
                        </div>
                    </div>
                    <span className="text-white font-medium text-[22px] leading-[140%]">
                        {question}
                    </span>
                </div>
                <svg 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                    width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 1.18616e-05L15.2727 8.92308L24 29L24 1.04907e-06L0 1.18616e-05Z" fill={isOpen ? "#58E8BB" : "#EEEEEE"} fillOpacity={isOpen ? "0.6" : "0.2"}/>
                </svg>
            </div>
            
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-[25px]' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden">
                    <span className="text-xl text-[#EEEEEE]/60 block pb-[5px]">
                        {answer}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FAQItem;
