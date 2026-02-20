import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';

const FEATURES = [
    'Historical hedge replay',
    'Protection performance over time',
    'Exportable engine reports',
    'Unlock with AVRT',
];

const AnalyticsPromoBlock = () => (
    <DashboardBlockLayout className="w-full md:max-w-[526px] py-[40px] md:py-[107px]! px-[20px] md:px-[93px]! gap-[32px] flex-col relative overflow-hidden">
        <img
            src="/assets/img/dashboard-img--blur.png"
            className="absolute top-1/2 left-1/2 -translate-1/2 object-cover h-full"
            alt=""
        />
        <div className="flex flex-col gap-[32px] items-center z-50">
            <div className="flex flex-col gap-[15px] items-center">
                <div className="flex w-full max-w-[64px] min-h-[64px] overflow-hidden relative">
                    <img src="/assets/img/product--card-img.svg" className="rounded-[16px]" alt="" />
                    <svg className="flex absolute left-1/2 top-1/2 -translate-1/2" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12V22H21V23H3V22H2V12H3V11H6V5H7V3H8V2H10V1H14V2H16V3H17V5H18V11H15V5H14V4H10V5H9V11H21V12H22Z" fill="white"/>
                    </svg>
                </div>
                <span className="text-[#EEEEEE] text-center font-medium text-[22px] md:text-[32px] w-full">
                    Extended analytics <br/> for <span className="text-[#58E8BB] font-semibold">AVRT</span> holders
                </span>
            </div>
            <div className="flex flex-col gap-[22px] items-center">
                {FEATURES.map(text => (
                    <span key={text} className="text-[#EEEEEE] text-lg font-medium">{text}</span>
                ))}
            </div>
        </div>
    </DashboardBlockLayout>
);

export default AnalyticsPromoBlock;
