import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';
import DashboardRow from '@/ui/DashboardRow.jsx';
import SolanaIcon from '@/ui/icons/SolanaIcon.jsx';

const HedgeReadoutBlock = ({ nextCheckCountdown, triggerPrice }) => (
    <DashboardBlockLayout className="w-full gap-[26px] flex-col">
        <div className="flex flex-col gap-[20px]">
            <span className="text-[#EEEEEE] text-xl font-medium">Live Hedge Readout</span>
            <div className="flex flex-col gap-[10px]">
                <span className="text-[#EEEEEE]/60 text-lg">Deposit basis:</span>
                <div className="flex p-[20px] items-center w-full justify-between rounded-[12px] bg-[#111111]">
                    <input
                        type="text"
                        placeholder="10.00"
                        className="text-[#EEEEEE] w-full outline-none text-lg font-medium"
                    />
                    <SolanaIcon id="sol-readout" />
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-[24px] w-full">
            <DashboardRow label="Action now:">
                <span className="text-lg text-[#58E8BB] font-medium">HEDGE UP</span>
            </DashboardRow>
            <DashboardRow label="Size:">
                <span className="text-lg text-[#EEEEEE] font-medium">Exposure</span>
            </DashboardRow>
            <DashboardRow label="Reason:">
                <span className="text-lg text-[#EEEEEE] font-medium">Trigger crossed</span>
            </DashboardRow>
            <DashboardRow label="Next check:">
                <span className="text-lg text-[#58E8BB] font-medium">in {nextCheckCountdown}s</span>
            </DashboardRow>
            <DashboardRow label="Next trigger:">
                <span className="text-lg text-[#EEEEEE] font-medium">
                    <span className="text-[#58E8BB]">$</span> {triggerPrice ?? '—'}
                </span>
            </DashboardRow>
        </div>
    </DashboardBlockLayout>
);

export default HedgeReadoutBlock;
