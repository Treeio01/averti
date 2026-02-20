import { router, useForm } from '@inertiajs/react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useRef, useState } from 'react';

const LaunchAppButton = () => {
    const form = useForm({ address: '' });
    const { ready, authenticated, login, user } = usePrivy();
    const { wallets } = useWallets();
    const [connecting, setConnecting] = useState(false);
    const loginInitiatedRef = useRef(false);

    const syncWallet = useCallback(async (opts) => {
        if (!ready || !authenticated || !user) return;
        setConnecting(true);

        const primaryWallet = wallets?.[0];
        const linkedAccounts = user.linkedAccounts ?? user.linked_accounts ?? [];
        const linkedSolWallet = linkedAccounts.find((a) => {
            if (a?.type !== 'wallet') return false;
            const chain = (a.chainType ?? a.chain_type ?? '').toLowerCase();
            return chain === '' || chain === 'solana';
        });

        const walletAddress = primaryWallet?.address ?? linkedSolWallet?.address;
        if (!walletAddress) {
            setConnecting(false);
            loginInitiatedRef.current = false;
            return;
        }

        form.data.address = walletAddress;
        form.post('/user/register', {
            onSuccess: () => {
                if (opts?.redirect) router.visit('/dashboard');
            },
            onError: (err) => console.error('Registration failed', err),
            onFinish: () => {
                setConnecting(false);
                loginInitiatedRef.current = false;
            },
        });
    }, [authenticated, ready, user, wallets]);

    useEffect(() => {
        if (ready && authenticated) {
            void syncWallet({ redirect: loginInitiatedRef.current });
        }
    }, [authenticated, ready, syncWallet]);

    const handleLaunch = useCallback(() => {
        if (!ready) return;
        if (authenticated) {
            router.visit('/dashboard');
            return;
        }
        loginInitiatedRef.current = true;
        setConnecting(true);
        try {
            login();
        } catch {
            loginInitiatedRef.current = false;
            setConnecting(false);
        }
    }, [authenticated, login, ready]);

    return (
        <button
            onClick={handleLaunch}
            disabled={connecting || !ready}
            className="flex relative items-center py-3 px-5 transition-cubic-hover disabled:opacity-50"
        >
            <img className="absolute left-1/2 -translate-1/2 top-1/2 w-full h-full" src="/assets/img/launch-button.svg" alt="" />
            <span className="text-white font-rethink! font-semibold z-50">
                {connecting ? 'Connecting...' : 'Launch App'}
            </span>
        </button>
    );
};

export default LaunchAppButton;
