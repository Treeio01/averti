import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';
import DashboardRow from '@/ui/DashboardRow.jsx';

const DepositSourceBlock = () => (
    <DashboardBlockLayout className="w-full gap-[32px] flex-col">
        <div className="flex items-center w-full justify-between">
            <span className="text-[#EEEEEE] text-xl font-medium">Deposit Source</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 8V10H22V11H21V12H20V13H19V14H18V19H19V23H17V22H15V21H13V20H11V21H9V22H7V23H5V19H6V14H5V13H4V12H3V11H2V10H1V8H8V6H9V4H10V2H11V1H13V2H14V4H15V6H16V8H23Z" fill="#58E8BB"/>
            </svg>
        </div>

        <div className="flex items-center w-full justify-between">
            <span className="text-[#EEEEEE] text-xl font-medium">LIVE:</span>
        </div>

        <div className="flex flex-col gap-[20px] w-full">
            <span className="text-[#EEEEEE] text-xl font-medium">Using Internal Wallet</span>
            <div className="flex flex-col gap-6 w-full">
                <DashboardRow label="Available:">
                    <span className="text-lg text-[#EEEEEE] font-medium">
                        XX.XX <span className="text-[#58E8BB]">SOL</span>
                    </span>
                </DashboardRow>
                <DashboardRow label="Locked:">
                    <span className="text-lg text-[#EEEEEE] font-medium">
                        X.XX <span className="text-[#58E8BB]">SOL</span>
                    </span>
                </DashboardRow>
            </div>
        </div>

        <div className="flex w-full relative">
            <img src="/assets/img/dashboard--top-up.svg" className="flex rounded-[15px] overflow-hidden" alt="" />
            <span className="absolute left-1/2 top-1/2 -translate-1/2 text-[#EEEEEE] font-medium text-lg">
                Top up → Wallet
            </span>
        </div>
    </DashboardBlockLayout>
);

export default DepositSourceBlock;
