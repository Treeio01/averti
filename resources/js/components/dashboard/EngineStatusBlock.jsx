import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';
import DashboardRow from '@/ui/DashboardRow.jsx';

const EngineStatusBlock = ({ currentTime }) => (
    <DashboardBlockLayout className="w-full md:max-w-[455px] gap-[32px] flex-col">
        <div className="flex flex-col gap-6 w-full">
            <DashboardRow label="Engine:">
                <span className="font-medium text-lg text-[#EEEEEE]">ACTIVE</span>
            </DashboardRow>
            <DashboardRow label="Source">
                <span className="font-medium text-lg text-[#EEEEEE]">Pyth SOL/USD</span>
            </DashboardRow>
            <DashboardRow label="Ruleset:">
                <span className="font-medium text-lg text-[#EEEEEE]">v1.3</span>
            </DashboardRow>
        </div>

        <div className="flex relative bg-[#0D0D0D] rounded-[12px] overflow-hidden">
            <img src="/assets/img/dashboard--img-1.png" className="flex" alt="" />
        </div>

        <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full py-1.5 px-2 gap-1.5 items-center bg-[#111111] rounded-[12px]">
                <div className="flex w-full">
                    <button className="flex relative rounded-[8px] overflow-hidden w-full">
                        <img src="/assets/img/dashboard--demo-bg.svg" className="flex" alt="" />
                        <span className="flex text-white text-lg font-medium absolute left-1/2 top-1/2 -translate-1/2">
                            Demo
                        </span>
                    </button>
                    <button className="flex relative rounded-[8px] overflow-hidden w-full">
                        <span className="flex text-white text-lg font-medium absolute left-1/2 top-1/2 -translate-1/2">
                            Live
                        </span>
                    </button>
                </div>
            </div>
            <div className="flex gap-2.5 items-center">
                <span className="text-lg text-[#EEEEEE]/50">Last update:</span>
                <span className="text-lg text-[#EEEEEE]/50 font-medium">{currentTime}</span>
            </div>
        </div>
    </DashboardBlockLayout>
);

export default EngineStatusBlock;
