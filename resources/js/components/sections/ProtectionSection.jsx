import SectionLayout from '@/ui/SectionLayout.jsx';

const CARDS = [
    {
        text: 'Live market data and continuous monitoring',
        ml: '',
        icon: <path d="M17 14V10H18V9H19V8H21V7H22V5H21V4H19V5H18V7H17V8H16V9H14V8H10V7H9V6H8V4H7V3H5V4H4V6H5V7H7V8H8V9H9V11H8V12H6V11H5V10H2V11H1V14H2V15H5V14H9V15H10V16H11V17H14V16H15V17H16V18H17V21H18V22H21V21H22V18H21V17H18V16H17V15H16V14H17ZM14 14H11V11H14V14Z" fill="white"/>,
    },
    {
        text: 'System-driven reactions, not manual interventions',
        ml: 'md:ml-[29px]',
        icon: <path d="M19 13V10H18V9H17V6H16V4H15V3H14V2H13V1H11V2H12V4H11V6H10V7H9V8H8V9H7V10H6V13H7V15H6V14H5V12H4V14H3V17H4V19H5V20H6V21H7V22H8V23H16V22H17V21H18V20H19V18H20V13H19ZM17 20H16V21H14V22H10V21H9V17H10V16H11V15H12V14H13V11H12V10H11V9H12V10H14V12H15V17H14V19H15V18H16V17H17V20Z" fill="white"/>,
    },
    {
        text: 'Every action is visible and traceable in the dashboard',
        ml: 'md:ml-[57px]',
        icon: (
            <>
                <path d="M16 11V13H15V14H14V15H13V16H11V15H10V14H9V13H8V11H10V10H11V8H13V9H14V10H15V11H16Z" fill="white"/>
                <path d="M22 11V9H21V8H20V7H19V6H17V5H7V6H5V7H4V8H3V9H2V11H1V13H2V15H3V16H4V17H5V18H7V19H17V18H19V17H20V16H21V15H22V13H23V11H22ZM18 13H17V15H16V16H15V17H13V18H11V17H9V16H8V15H7V13H6V11H7V9H8V8H9V7H11V6H13V7H15V8H16V9H17V11H18V13Z" fill="white"/>
            </>
        ),
    },
];

const ProtectionSection = () => (
    <SectionLayout id="protection" isLeft isIcon={false} className="max-w-[1320px] mt-[60px] md:mt-[120px]" title="Built for Real-Time Protection" subtitle="Continuous monitoring. Immediate response.">
        <div className="flex w-full">
            <img src="/assets/img/protection--bg.svg" className="absolute top-0 right-0" alt="" />

            <div className="flex flex-col gap-[25px] z-50 w-full">
                {CARDS.map((card, i) => (
                    <div
                        key={card.text}
                        className={`flex rounded-[25px] ${card.ml} w-full max-w-[574px] overflow-hidden bg-linear-to-br from-[#58E8BB] via-[#1A1A1A] to-[#1A1A1A] p-[1px]`}
                        data-scroll-animate="slide-in-left-blur"
                        data-scroll-delay={i * 200}
                        data-scroll-duration="0.9"
                    >
                        <div className="flex w-full p-[25px] bg-[#070707] rounded-[25px] gap-[20px] items-center relative">
                            <img src="/assets/img/protection--glow.svg" className="flex absolute left-0 bottom-0" alt="" />
                            <div className="flex w-full max-w-[64px] min-h-[64px] overflow-hidden relative">
                                <img src="/assets/img/product--card-img.svg" className="rounded-[16px]" alt="" />
                                <svg className="flex absolute left-1/2 top-1/2 -translate-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {card.icon}
                                </svg>
                            </div>
                            <span className="text-white font-medium text-lg md:text-[22px] leading-[140%] max-w-[335px]">{card.text}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </SectionLayout>
);

export default ProtectionSection;
