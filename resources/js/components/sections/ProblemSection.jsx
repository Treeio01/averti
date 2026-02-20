import SectionLayout from '@/ui/SectionLayout.jsx';
import ProblemPoint from '../landing/ProblemPoint.jsx';

const problems = [
    {
        text: "Managing risk manually requires constant attention",
        className: "max-w-[232px] absolute left-[60px] top-[60px]",
        align: "left"
    },
    {
        text: "Most users react too late or too emotionally",
        className: "max-w-[265px] absolute right-[50px] top-[170px]",
        align: "right"
    },
    {
        text: "Averti replaces manual decisions with predefined system behavior",
        className: "max-w-[324px] absolute left-[80px] top-[360px]",
        align: "left"
    }
];

const ProblemSection = () => (
    <SectionLayout id="problem" className="mt-[120px]" title="The Problem with Manual Risk Control" subtitle="Most risk decisions are made too late">
        <div className="relative min-h-[500px] w-full max-w-[1000px]">
            <img
                src="/assets/img/problem--bg.png"
                className="flex absolute top-1/2 left-1/2 max-w-[1085px] -translate-1/2"
                alt=""
                data-scroll-animate="zoom-in"
                data-scroll-duration="1.2"
            />
            {problems.map((problem, index) => (
                <ProblemPoint
                    key={index}
                    text={problem.text}
                    className={problem.className}
                    align={problem.align}
                    animDelay={300 + index * 250}
                />
            ))}
        </div>
    </SectionLayout>
);

export default ProblemSection;
