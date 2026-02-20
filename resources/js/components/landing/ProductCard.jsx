const ProductCard = ({ svg, text, animDelay = 0 }) => (
    <div
        className="flex overflow-hidden max-w-[427px] w-full relative bg-[#070707] gap-[40px] flex-col items-center border border-[#1A1A1A] rounded-[25px] py-[43px] px-[20px]"
        data-scroll-animate="float-up"
        data-scroll-delay={animDelay}
        data-scroll-duration="0.8"
    >
        <img src="/assets/img/product--card-bg.svg" className="absolute left-1/2 -translate-x-1/2 bottom-0" alt="" />
        <div className="flex items-center justify-center relative">
            <img src="/assets/img/product--card-img.svg" className="w-full max-w-[124px] min-h-[124px]" alt="" />
            {svg}
        </div>
        <span className="text-white max-w-[305px] text-center font-medium text-[22px]">
            {text}
        </span>
    </div>
);

export default ProductCard;
