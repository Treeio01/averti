import SectionLayout from '@/ui/SectionLayout.jsx';

const CARDS = [
    { img: 'token--img-1.svg', text: 'Averti works fully without the token' },
    { img: 'token--img-2.svg', text: 'The core protection engine is always the same' },
    { img: 'token--img-3.svg', text: 'AVRT improves efficiency, not exposure' },
];

const TokenSection = () => (
    <SectionLayout id="token" title="AVRT Token" className="mt-[60px] md:mt-[120px] max-w-[1320px]" isLeft subtitle="The same engine, different economics">
        <div className="flex w-full gap-[20px] flex-wrap justify-center">
            {CARDS.map((card, i) => (
                <div
                    key={card.text}
                    className="flex p-[24px] md:p-[40px] items-end bg-[#070707] rounded-[25px] border border-[#1A1A1A] min-h-[300px] md:min-h-[408px] w-full max-w-[426px] relative overflow-hidden"
                    data-scroll-animate="blur-scale"
                    data-scroll-delay={i * 180}
                    data-scroll-duration="0.9"
                >
                    <img src={`/assets/img/${card.img}`} className="flex absolute left-1/2 top-1/2 -translate-1/2" alt="" />
                    <span className="text-center text-white font-medium z-50 text-lg md:text-[22px] leading-[140%]">
                        {card.text}
                    </span>
                </div>
            ))}
        </div>
    </SectionLayout>
);

export default TokenSection;
