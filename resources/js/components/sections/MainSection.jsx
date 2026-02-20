import LaunchAppButton from '@/components/landing/LaunchAppButton.jsx';

const MainSection = () => (
    <section id="hero" className="flex z-50 w-full flex-col items-center mt-20 justify-between">
        <div className="flex flex-col z-50 items-center gap-[30px]">
            <div
                className="flex py-3 px-5 relative rounded-[16px] overflow-hidden"
                data-scroll-animate="blur-scale"
                data-scroll-delay="200"
                data-scroll-duration="0.8"
            >
                <img src="/assets/img/main-section--block.svg" className="w-full absolute left-1/2 top-1/2 -translate-1/2" alt="" />
                <span className="text-white z-50 font-medium">Live market signals. System-defined reactions</span>
            </div>
            <div className="flex flex-col gap-[60px] items-center max-w-[603px]">
                <div className="flex flex-col items-center gap-[25px]">
                    <h1
                        className="text-white text-center font-medium text-[60px] leading-[110%] tracking-[-0.00em]"
                        data-scroll-animate="blur-fade"
                        data-scroll-delay="500"
                        data-scroll-duration="1.1"
                    >
                        Real-Time Asset Protection for Solana
                    </h1>
                    <span
                        className="text-[#EEEEEE]/60 text-xl"
                        data-scroll-animate="fade-up"
                        data-scroll-delay="800"
                        data-scroll-duration="0.7"
                    >
                        A system-first approach to managing SOL exposure.
                    </span>
                </div>
                <div
                    data-scroll-animate="scale-up"
                    data-scroll-delay="1100"
                    data-scroll-duration="0.8"
                >
                    <LaunchAppButton />
                </div>
            </div>
        </div>
        <img
            src="/assets/img/main--dashboard.png"
            className="w-full absolute bottom-0 left-1/2 -translate-x-1/2 z-40 max-w-[1096px]"
            alt=""
            data-scroll-animate="tilt-in"
            data-scroll-delay="1400"
            data-scroll-duration="1.2"
        />
    </section>
);

export default MainSection;
