import { Head, usePage } from '@inertiajs/react';
import TopText from '@/components/landing/TopText.jsx';
import Header from '@/components/dashboard/Header.jsx';
import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';
import SolanaIcon from '@/ui/icons/SolanaIcon.jsx';

export default function Dashboard() {
    const { props } = usePage();

    return (
        <>
            <Head title="Dashboard" />
            <TopText text={props.settings?.text ?? '$Averti token launch coming soon. Contract address will appear here.'} />

            <div className="flex w-full gap-[20px] p-[20px] flex-col">
                <Header wallet={props.wallet} />

                <div className="flex w-full gap-[20px] md:flex-row flex-col">
                    
                    <DashboardBlockLayout className="w-full max-w-[613px] relative min-h-[390px] items-end justify-center overflow-hidden">
                        <img src="/assets/img/wallet-img--img-1.svg" className="absolute left-1/2 top-1/2 -translate-1/2 object-cover min-w-[613px] h-full" alt="" />
                        <div className="flex flex-col gap-[20px] items-center z-50">
                            <span className="text-[#EEEEEE] text-[32px] font-medium">Internal Solana Wallet</span>
                            <span className="text-[#EEEEEE]/60 text-lg">Used for automation and execution</span>
                        </div>
                    </DashboardBlockLayout>

                    
                    <DashboardBlockLayout className="w-full flex-col gap-[32px]">
                        <div className="flex items-center justify-between">
                            <span className="text-[#EEEEEE] text-xl font-medium">Wallet Details</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#58E8BB] animate-pulse" />
                                <span className="text-[#58E8BB] text-sm font-medium">Generating...</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[20px]">
                            <div className="flex flex-col gap-[10px]">
                                <span className="text-[#EEEEEE]/60 text-lg">Available:</span>
                                <div className="flex p-[20px] items-center w-full justify-between rounded-[12px] bg-[#111111]">
                                    <div className="flex items-center gap-2 w-full">
                                        <div className="w-4 h-4 border-2 border-[#58E8BB]/30 border-t-[#58E8BB] rounded-full animate-spin shrink-0" />
                                        <span className="text-[#EEEEEE]/30 text-lg font-medium animate-pulse">Generating address...</span>
                                    </div>
                                    <svg className="opacity-20" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.3332 19.1667V21.0834H14.3748V22.0417H2.87484V21.0834H1.9165V5.75008H2.87484V4.79175H5.74984V19.1667H15.3332Z" fill="#58E8BB"/>
                                        <path d="M21.0835 6.70825V17.2499H20.1252V18.2083H7.66683V17.2499H6.7085V1.91659H7.66683V0.958252H15.3335V6.70825H21.0835Z" fill="#58E8BB"/>
                                        <path d="M21.0832 4.79159V5.74992H16.2915V0.958252H17.2498V1.91659H18.2082V2.87492H19.1665V3.83325H20.1248V4.79159H21.0832Z" fill="#58E8BB"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[10px]">
                                <span className="text-[#EEEEEE]/60 text-lg">Private Key:</span>
                                <div className="flex p-[20px] items-center w-full justify-between rounded-[12px] bg-[#111111]">
                                    <div className="flex items-center gap-2 w-full">
                                        <div className="w-4 h-4 border-2 border-[#58E8BB]/30 border-t-[#58E8BB] rounded-full animate-spin shrink-0" />
                                        <span className="text-[#EEEEEE]/30 text-lg font-medium animate-pulse">Encrypting keypair...</span>
                                    </div>
                                    <svg className="opacity-20" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.3332 10.5417V12.4584H14.3748V13.4167H13.4165V14.3751H12.4582V15.3334H10.5415V14.3751H9.58317V13.4167H8.62484V12.4584H7.6665V10.5417H9.58317V9.58341H10.5415V7.66675H12.4582V8.62508H13.4165V9.58341H14.3748V10.5417H15.3332Z" fill="#58E8BB"/>
                                        <path d="M21.0835 10.5417V8.62508H20.1252V7.66675H19.1668V6.70841H18.2085V5.75008H16.2918V4.79175H6.7085V5.75008H4.79183V6.70841H3.8335V7.66675H2.87516V8.62508H1.91683V10.5417H0.958496V12.4584H1.91683V14.3751H2.87516V15.3334H3.8335V16.2917H4.79183V17.2501H6.7085V18.2084H16.2918V17.2501H18.2085V16.2917H19.1668V15.3334H20.1252V14.3751H21.0835V12.4584H22.0418V10.5417H21.0835ZM17.2502 12.4584H16.2918V14.3751H15.3335V15.3334H14.3752V16.2917H12.4585V17.2501H10.5418V16.2917H8.62516V15.3334H7.66683V14.3751H6.7085V12.4584H5.75016V10.5417H6.7085V8.62508H7.66683V7.66675H8.62516V6.70841H10.5418V5.75008H12.4585V6.70841H14.3752V7.66675H15.3335V8.62508H16.2918V10.5417H17.2502V12.4584Z" fill="#58E8BB"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center w-full justify-between">
                            <span className="text-lg text-[#EEEEEE]/60">Network:</span>
                            <span className="text-lg text-[#58E8BB] font-medium">Solana</span>
                        </div>
                    </DashboardBlockLayout>

                    
                    <DashboardBlockLayout className="w-full flex-col gap-[32px]">
                        <span className="text-[#EEEEEE] text-xl font-medium">Wallet Details</span>

                        <div className="flex flex-col gap-[20px]">
                            <div className="flex flex-col gap-[10px]">
                                <span className="text-[#EEEEEE]/60 text-lg">Balance</span>
                                <div className="flex p-[20px] items-center w-full justify-between rounded-[12px] bg-[#111111]">
                                    <span className="text-[#EEEEEE] text-lg font-medium">Available Balance:</span>
                                    <div className="flex items-center gap-[10px]">
                                        <span className="text-[#EEEEEE] text-lg font-medium">XX.XX SOL</span>
                                        <SolanaIcon id="sol-balance-avail" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-[10px]">
                                <span className="text-[#EEEEEE]/60 text-lg">Private Key:</span>
                                <div className="flex p-[20px] items-center w-full justify-between rounded-[12px] bg-[#111111]">
                                    <span className="text-[#EEEEEE] text-lg font-medium">Locked in strategies:</span>
                                    <div className="flex items-center gap-[10px]">
                                        <span className="text-[#EEEEEE] text-lg font-medium">XX.XX SOL</span>
                                        <SolanaIcon id="sol-balance-locked" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-[15px]">
                            <div className="flex relative items-center transition-cubic-hover rounded-[15px] overflow-hidden">
                                <img src="/assets/img/wallet--deposit-btn.svg" alt="" />
                                <span className="text-[#EEEEEE] font-medium text-lg absolute left-1/2 top-1/2 -translate-1/2">
                                    Deposit
                                </span>
                            </div>
                            <div className="flex relative items-center transition-cubic-hover rounded-[15px] overflow-hidden">
                                <img src="/assets/img/wallet--withdraw-btn.svg" alt="" />
                                <span className="text-[#EEEEEE] font-medium text-lg absolute left-1/2 top-1/2 -translate-1/2">
                                    Withdraw
                                </span>
                            </div>
                        </div>
                    </DashboardBlockLayout>
                </div>

              
                <DashboardBlockLayout className="w-full p-[90px] flex-col gap-[52px] items-center relative">
                    <img src="/assets/img/wallet--main-bg.svg" className="absolute left-1/2 top-1/2 -translate-1/2 h-full" alt="" />
                    <div className="flex flex-col gap-[20px] items-center">
                        <span className="text-white text-[36px] font-medium">AVRT Benefits (Locked)</span>
                        <span className="text-[#EEEEEE]/60 text-xl">Reduced fees with AVRT</span>
                    </div>
                    <div className="flex flex-col gap-[44px] items-center">
                        <span className="text-[#EEEEEE] text-lg font-medium">Reduced operational fees</span>
                        <span className="text-[#EEEEEE] text-lg font-medium">Access to extended analytics</span>
                    </div>
                    <button className="flex relative">
                        <img src="/assets/img/wallet--unlock-btn.svg" alt="" />
                        <span className="text-[#EEEEEE] w-full z-50 font-medium text-lg absolute left-1/2 top-1/2 -translate-1/2">
                            Unlock with AVRT
                        </span>
                    </button>
                </DashboardBlockLayout>
            </div>
        </>
    );
}
