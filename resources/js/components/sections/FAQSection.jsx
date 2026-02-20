import SectionLayout from '@/ui/SectionLayout.jsx';
import FAQItem from './FaqItem.jsx';

const faqData = [
    { question: "What does Averti do?", answer: "Averti provides automated, real-time protection for SOL exposure using predefined system rules." },
    { question: "Does Averti guarantee profits?", answer: "No, Averti is a risk management tool designed to protect capital, not a profit-guaranteeing system." },
    { question: "Do I need AVRT to use Averti?", answer: "No. AVRT is optional and provides reduced operational fees." },
    { question: "Does the token affect how the engine works?", answer: "No. Engine behavior and risk logic are independent of the token." },
    { question: "Is Averti a trading platform?", answer: "No. Averti does not enable trading or market timing." },
];

const FaqSection = () => (
    <SectionLayout id="faq" className="mt-[60px] md:mt-[120px] max-w-[874px] relative overflow-hidden" title="FAQ" subtitle="Clear answers to common questions">
        <img src="/assets/img/faq--bg.png" className="absolute top-0 left-1/2 -translate-x-1/2 w-[1920px] pointer-events-none" alt="" />
        <div className="flex flex-col z-50 gap-[20px] items-center w-full">
            {faqData.map((item, index) => (
                <div
                    key={index}
                    className="w-full"
                    data-scroll-animate="fade-up"
                    data-scroll-delay={index * 100}
                    data-scroll-duration="0.7"
                >
                    <FAQItem question={item.question} answer={item.answer} />
                </div>
            ))}
        </div>
    </SectionLayout>
);

export default FaqSection;
