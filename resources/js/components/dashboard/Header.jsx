import { Link, router } from '@inertiajs/react';
import { usePrivy } from '@privy-io/react-auth';
import { useCallback } from 'react';

const NAV_LINKS = [
    { label: 'Hedge Engine', href: '/dashboard' },
    { label: 'Wallet', href: '/dashboard/wallet' },
];

const Header = ({ wallet }) => {
    const { logout: privyLogout } = usePrivy();

    const handleDisconnect = useCallback(async () => {
        try {
            await privyLogout();
        } catch {}
        router.post('/logout', {}, {
            onSuccess: () => router.visit('/'),
        });
    }, [privyLogout]);

    return (
        <header className="flex w-full justify-between items-center py-3 px-4.5 bg-[#090909] border border-[#1A1A1A] rounded-[16px]">
            <div className="flex items-center gap-[10px]">
                <img src="/assets/img/logo.svg" alt="" />
                <div className="flex flex-col gap-[1px]">
                    <span className="text-white font-semibold text-lg">Averti</span>
                    <span className="text-[12px] text-[#B2B2B4]">Dashboard</span>
                </div>
            </div>

            <ul className="flex items-center gap-[30px]">
                {NAV_LINKS.map(link => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            preserveState
                            className="text-[#EEEEEE]/60 text-[15px] hover:text-[#58E8BB] transition-cubic"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center gap-[14px]">
                <span className="text-sm text-[#B2B2B4]">Wallet connected:</span>
                <div className="flex relative items-center py-3 px-5 transition-cubic-hover">
                    <img className="absolute left-1/2 -translate-1/2 top-1/2 w-full h-full" src="/assets/img/launch-button.svg" alt="" />
                    <span className="text-white font-rethink! font-semibold z-50 max-w-[92px] overflow-hidden text-ellipsis">
                        {wallet}
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
