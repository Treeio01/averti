import SectionLayout from '@/ui/SectionLayout.jsx';

const CARDS = [
    { img: 'howitworks--card-bg-1.svg', maxW: '538px', text: 'Connect your wallet and create an internal execution account' },
    { img: 'howitworks--card-bg-2.svg', maxW: '427px', text: 'Averti monitors market conditions in real time' },
    { img: 'howitworks--card-bg-3.svg', maxW: '315px', text: 'Deposit SOL into Averti', textMaxW: '167px' },
    { img: 'howitworks--card-bg-4.svg', maxW: '650px', text: 'The engine adjusts protection behavior automatically based on predefined rules', textMaxW: '545px' },
    { img: 'howitworks--card-bg-5.png', maxW: '650px', text: 'You track status and actions through a single dashboard', textMaxW: '370px' },
];

const HowItWorksSection = () => (
    <SectionLayout id="how-it-works" className="mt-[200px] max-w-[1320px]" isLeft title="How It Works" subtitle="From deposit to protection — step by step">
        <div className="flex w-full gap-[20px] flex-wrap">
            {CARDS.map((card, i) => (
                <div
                    key={card.text}
                    className={`flex w-full max-w-[${card.maxW}] min-h-[330px] overflow-hidden bg-[#070707] border border-[#1A1A1A] rounded-[25px] p-[40px] items-end relative`}
                    data-scroll-animate={i % 2 === 0 ? 'tilt-in' : 'float-up'}
                    data-scroll-delay={i * 120}
                    data-scroll-duration="0.9"
                >
                    <img src={`/assets/img/${card.img}`} className="absolute left-1/2 top-1/2 -translate-1/2" alt="" />
                    <span className={`text-white z-50 font-medium text-[22px] leading-[140%] tracking-[-0.00em] ${card.textMaxW ? `max-w-[${card.textMaxW}]` : 'max-w-[359px]'}`}>
                        {card.text}
                    </span>
                </div>
            ))}
        </div>
    </SectionLayout>
);

export default HowItWorksSection;
