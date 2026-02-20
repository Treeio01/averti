const SectionLayout = ({ children, title, subtitle, className, isLeft, isIcon = true, id }) => (
    <section id={id} className={"flex w-full relative gap-[24px] md:gap-[40px] flex-col mt-[33px] items-center px-4 md:px-0 " + className}>
        {isLeft ? (
            <div className="justify-between z-50 flex items-end w-full">
                <div className="flex flex-col gap-[25px]">
                    <h2
                        className="text-white font-medium text-[26px] md:text-[40px] leading-[110%] tracking-[-0.00em]"
                        data-scroll-animate="slide-in-left-blur"
                        data-scroll-duration="0.9"
                    >
                        {title}
                    </h2>
                    <span
                        className="text-xl text-[#EEEEEE]/60"
                        data-scroll-animate="fade-up"
                        data-scroll-delay="200"
                        data-scroll-duration="0.6"
                    >
                        {subtitle}
                    </span>
                </div>
                {isIcon && (
                    <svg
                        width="36" height="30" viewBox="0 0 36 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                        data-scroll-animate="slide-in-right"
                        data-scroll-delay="300"
                        data-scroll-duration="0.7"
                    >
                        <path d="M36 0L24.9231 19.0909L0 30H36L36 0Z" fill="#58E8BB"/>
                    </svg>
                )}
            </div>
        ) : (
            <div className="flex flex-col z-50 gap-[25px] items-center">
                <h2
                    className="text-white font-medium text-[26px] md:text-[40px] leading-[110%] tracking-[-0.00em]"
                    data-scroll-animate="blur-fade"
                    data-scroll-duration="0.9"
                >
                    {title}
                </h2>
                <span
                    className="text-xl text-[#EEEEEE]/60"
                    data-scroll-animate="fade-up"
                    data-scroll-delay="200"
                    data-scroll-duration="0.6"
                >
                    {subtitle}
                </span>
            </div>
        )}
        {children}
    </section>
);

export default SectionLayout;
