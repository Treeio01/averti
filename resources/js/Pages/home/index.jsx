import { Head, usePage } from '@inertiajs/react';
import TopText from '@/components/landing/TopText.jsx';
import Header from '@/components/landing/Header.jsx';
import MainSection from '@/components/sections/MainSection.jsx';
import ProductSection from '@/components/sections/ProductSection.jsx';
import ProblemSection from '@/components/sections/ProblemSection.jsx';
import HowItWorksSection from '@/components/sections/HowItWorksSection.jsx';
import ProtectionSection from '@/components/sections/ProtectionSection.jsx';
import TokenSection from '@/components/sections/TokenSection.jsx';
import BehaivorSection from '@/components/sections/BehaivorSection.jsx';
import RoadmapSection from '@/components/sections/RoadmapSection.jsx';
import FAQSection from '@/components/sections/FAQSection.jsx';
import Footer from '@/components/landing/Footer.jsx';

export default function Home() {
    const { props } = usePage();

    return (
        <>
            <Head title="Averti" />
            <div className="flex w-full flex-col items-center min-h-screen overflow-hidden">
                <img src="/assets/img/bg.png" className="w-full absolute top-0 left-1/2 -translate-x-1/2 h-screen" alt="" />
                <TopText text={props.settings?.text ?? '$Averti token launch coming soon. Contract address will appear here.'} />
                <Header twitter={props.settings?.twitter} />
                <MainSection />
            </div>
            <ProductSection />
            <ProblemSection />
            <HowItWorksSection />
            <ProtectionSection />
            <TokenSection />
            <BehaivorSection />
            <RoadmapSection />
            <FAQSection />
            <Footer isLight={false} twitter={props.settings?.twitter} />
        </>
    );
}
