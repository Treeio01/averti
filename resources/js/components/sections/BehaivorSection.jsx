import SectionLayout from '@/ui/SectionLayout.jsx';

const CARDS = [
    { text: 'Averti is built for consistency, not constant optimization.', maxW: '447px' },
    { text: 'The system follows predefined behavior across market conditions', maxW: '497px' },
    { text: 'Users know how the product reacts before the market moves', maxW: '469px' },
];

const BehaivorSection = () => (
    <SectionLayout className="mt-[120px] max-w-[1320px]" title="Designed for Predictable Behavior" subtitle="Defined reactions across market conditions">
        <div className="flex px-[45px] py-[20px] min-h-[587px] relative w-full items-end justify-end">
            <img
                src="/assets/img/behaivor--bg.png"
                className="absolute left-1/2 bottom-[-10px] -translate-x-1/2 w-full max-w-[1320px]"
                alt=""
                data-scroll-animate="zoom-in"
                data-scroll-duration="1.3"
            />
            <div className="flex flex-col gap-[20px] items-end">
                {CARDS.map((card, i) => (
                    <div
                        key={card.text}
                        className={`flex rounded-[25px] max-w-[${card.maxW}] overflow-hidden bg-linear-to-br from-[#58E8BB] via-[#1A1A1A] to-[#1A1A1A] p-[1px]`}
                        data-scroll-animate="slide-in-right-blur"
                        data-scroll-delay={i * 200}
                        data-scroll-duration="0.9"
                    >
                        <div className="flex w-full p-[25px] bg-[#070707] rounded-[25px] gap-[20px] items-center relative">
                            <img src="/assets/img/protection--glow.svg" className="flex absolute left-0 bottom-0" alt="" />
                            <div className="flex w-full max-w-[64px] min-h-[64px] overflow-hidden relative">
                                <img src="/assets/img/product--card-img.svg" className="rounded-[16px]" alt="" />
                                <svg className="flex absolute left-1/2 top-1/2 -translate-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10V11H20V12H19V13H18V14H17V15H16V16H15V17H14V18H13V19H12V20H11V21H10V22H9V23H8V21H9V18H10V14H3V13H4V12H5V11H6V10H7V9H8V8H9V7H10V6H11V5H12V4H13V3H14V2H15V1H16V3H15V6H14V10H21Z" fill="white"/>
                                </svg>
                            </div>
                            <span className="text-white font-medium text-[22px] leading-[140%]">{card.text}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </SectionLayout>
);

export default BehaivorSection;
