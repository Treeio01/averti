import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';
import DashboardRow from '@/ui/DashboardRow.jsx';

const MarketChangeBlock = ({ solPrice, nextCheckCountdown, triggerPrice }) => (
    <DashboardBlockLayout className="w-full gap-[32px] flex-col">
        <div className="flex flex-col gap-4.5">
            <span className="text-[#EEEEEE] font-medium text-xl">Market change detected:</span>
            <span className="text-[#EEEEEE] text-lg">
                SOL/USD moved to {solPrice ? `$${solPrice.toFixed(2)}` : '$—'}
            </span>
        </div>

        <DashboardRow label="System action:">
            <span className="text-lg text-[#58E8BB] font-medium">HEDGE UP</span>
        </DashboardRow>

        <span className="text-lg text-[#EEEEEE]">
            <span className="text-[#EEEEEE]/60">Explanation:</span>{' '}
            System reasoning based on predefined rules. System reasoning based on predefined rules.
        </span>

        <div className="flex flex-col gap-6 w-full">
            <DashboardRow label="Next check:">
                <span className="text-lg text-[#58E8BB] font-medium">in {nextCheckCountdown}s</span>
            </DashboardRow>
            <DashboardRow label="Next trigger:">
                <span className="text-lg text-[#EEEEEE] font-medium">
                    <span className="text-[#58E8BB]">$</span> {triggerPrice ?? '—'}
                </span>
            </DashboardRow>
        </div>

        <DashboardRow label="Tag:">
            <span className="text-lg text-[#58E8BB] font-medium">SIM</span>
        </DashboardRow>
    </DashboardBlockLayout>
);

export default MarketChangeBlock;
