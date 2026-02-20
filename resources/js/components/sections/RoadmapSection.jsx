import SectionLayout from '@/ui/SectionLayout.jsx';

const roadmapData = [
    {
        quarter: 'Q1', year: '2026',
        items: ['Platform MVP launch', 'Token launch (AVRT)', 'Core dashboard release', 'Internal wallet infrastructure'],
    },
    {
        quarter: 'Q2', year: '2026',
        items: ['Real-time analytics expansion', 'Fee reduction logic integration for AVRT holders', 'Stability and performance optimization'],
    },
    {
        quarter: 'Q3', year: '2026',
        items: ['Advanced monitoring tools', 'Historical data views', 'System reliability improvements'],
    },
    {
        quarter: 'Q4', year: '2026',
        items: ['Extended reporting capabilities', 'UX refinements based on usage data', 'Infrastructure scaling'],
    },
    {
        quarter: 'Q1', year: '2027',
        items: ['Additional protection logic modules', 'Alerting and notification systems', 'Operational transparency improvements'],
    },
    {
        quarter: 'Q2', year: '2027',
        items: ['Enterprise-grade monitoring features', 'API access for advanced users', 'Long-term system optimization'],
    },
];

const BG_IMAGES = {
    0: { src: 'roadmap--bg-img-1.svg', className: 'absolute w-full min-w-[290px] right-[calc(100%+10px)] top-[5px]' },
    1: { src: 'roadmap--bg-img-2.svg', className: 'absolute -top-full left-[-115px] min-w-[326px]' },
    2: { src: 'roadmap--bg-img-3.svg', className: 'absolute top-[60px] left-[50px] min-w-[384px]' },
    5: { src: 'roadmap--bg-img-4.svg', className: 'absolute top-[-40px] left-[-148px] min-w-[650px]' },
};

const RoadmapSection = () => (
    <SectionLayout id="roadmap" title="Roadmap" className="max-w-[1320px] mt-[60px] md:mt-[140px]" subtitle="A clear, system-focused development plan" isLeft>
        <div className="flex flex-col md:flex-row gap-[24px] md:gap-[2px] md:min-h-[650px]">
            {roadmapData.map((phase, index) => {
                const bg = BG_IMAGES[index];
                return (
                    <div
                        key={index}
                        className={`flex relative flex-col w-full md:max-w-[221px] gap-[25px] ${index % 2 !== 0 ? 'md:self-end' : ''}`}
                        data-scroll-animate="fade-up"
                        data-scroll-delay={index * 150}
                        data-scroll-duration="0.8"
                    >
                        {bg && <img src={`/assets/img/${bg.src}`} className={`hidden md:block ${bg.className}`} alt="" />}

                        <div className="flex w-full max-w-[60px] min-h-[60px] overflow-hidden relative">
                            <img src="/assets/img/product--card-img.svg" className="rounded-[16px]" alt="" />
                            <svg className="flex absolute left-1/2 top-1/2 -translate-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 10V11H20V12H19V13H18V14H17V15H16V16H15V17H14V18H13V19H12V20H11V21H10V22H9V23H8V21H9V18H10V14H3V13H4V12H5V11H6V10H7V9H8V8H9V7H10V6H11V5H12V4H13V3H14V2H15V1H16V3H15V6H14V10H21Z" fill="white"/>
                            </svg>
                        </div>

                        <div className="flex flex-col gap-[20px]">
                            <span className="text-white font-medium text-2xl whitespace-nowrap">
                                [ <span className="text-[#58E8BB]">{phase.quarter}</span> ] {phase.year}
                            </span>
                            <div className="flex flex-col gap-[12px]">
                                {phase.items.map((item, i) => (
                                    <span key={i} className="text-white/80">{item}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </SectionLayout>
);

export default RoadmapSection;
