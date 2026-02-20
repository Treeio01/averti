import { Head, usePage } from '@inertiajs/react';
import TopText from '@/components/landing/TopText.jsx';
import Header from '@/components/dashboard/Header.jsx';
import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';
import SolChart from '@/components/dashboard/SolChart.jsx';
import EngineStatusBlock from '@/components/dashboard/EngineStatusBlock.jsx';
import DepositSourceBlock from '@/components/dashboard/DepositSourceBlock.jsx';
import MarketChangeBlock from '@/components/dashboard/MarketChangeBlock.jsx';
import HedgeReadoutBlock from '@/components/dashboard/HedgeReadoutBlock.jsx';
import HedgeTimelineBlock from '@/components/dashboard/HedgeTimelineBlock.jsx';
import AnalyticsPromoBlock from '@/components/dashboard/AnalyticsPromoBlock.jsx';
import useBinancePrice from '@/hooks/useBinancePrice.js';
import useCurrentTime from '@/hooks/useCurrentTime.js';
import useCountdown from '@/hooks/useCountdown.js';

export default function Dashboard() {
    const { props } = usePage();
    const solPrice = useBinancePrice();
    const currentTime = useCurrentTime();
    const nextCheckCountdown = useCountdown(30);
    const triggerPrice = solPrice ? +(solPrice * 1.015).toFixed(2) : null;

    return (
        <>
            <Head title="Dashboard" />
            <TopText text={props.settings?.text ?? '$Averti token launch coming soon. Contract address will appear here.'} />

            <div className="flex w-full gap-[20px] p-[20px] flex-col">
                <Header wallet={props.wallet} />

               
                <div className="flex w-full gap-[20px] md:flex-row flex-col">
                    <EngineStatusBlock currentTime={currentTime} />
                    <DashboardBlockLayout className="w-full gap-[32px] flex-col">
                        <SolChart livePrice={solPrice} />
                    </DashboardBlockLayout>
                </div>

                
                <div className="flex w-full gap-[20px] md:flex-row flex-col">
                    <DepositSourceBlock />
                    <MarketChangeBlock
                        solPrice={solPrice}
                        nextCheckCountdown={nextCheckCountdown}
                        triggerPrice={triggerPrice}
                    />
                    <HedgeReadoutBlock
                        nextCheckCountdown={nextCheckCountdown}
                        triggerPrice={triggerPrice}
                    />
                    <DashboardBlockLayout className="w-full relative flex-col overflow-hidden">
                        <img
                            src="/assets/img/dashboard--img-2.svg"
                            className="flex absolute left-1/2 bottom-0 -translate-x-1/2 w-full h-full object-cover"
                            alt=""
                        />
                    </DashboardBlockLayout>
                </div>

                
                <div className="flex w-full gap-[20px] md:flex-row flex-col">
                    <HedgeTimelineBlock />
                    <AnalyticsPromoBlock />
                </div>
            </div>
        </>
    );
}
