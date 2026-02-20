import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import React, { useEffect } from 'react';
import { initScrollAnimationsSystem, refreshScrollAnimations } from './utils/scrollAnimations';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

const PRIVY_APP_ID = "cmlrwk5zs00gs0cl7rjpln4sw";

const PRIVY_CONFIG = {
    appearance: {
        accentColor: '#56e6b9',
        theme: '#222224',
        showWalletLoginFirst: true,
        logo: 'https://image2url.com/r2/default/images/1771411558848-80005f0d-3ab5-4865-a641-bce6c3dea212.png',
        walletChainType: 'solana-only',
        walletList: [
            "detected_ethereum_wallets",
      "detected_solana_wallets",
      "metamask",
      "phantom",
      "coinbase_wallet",
      "base_account",
      "rainbow",
      "solflare",
      "backpack",
      "okx_wallet",
      "wallet_connect"
        ],
    },
    loginMethods: ['wallet'],
    fundingMethodConfig: {
        moonpay: { useSandbox: true },
    },
    embeddedWallets: {
        showWalletUIs: true,
        solana: { createOnLogin: 'users-without-wallets' },
    },
    mfa: { noPromptOnMfaRequired: false },
    externalWallets: {
        solana: { connectors: toSolanaWalletConnectors() },
    },
};

const ScrollAnimationProvider = ({ children }) => {
    useEffect(() => {
        initScrollAnimationsSystem();

        const timer = setTimeout(refreshScrollAnimations, 150);
        const handleFinish = () => setTimeout(refreshScrollAnimations, 100);
        router.on('finish', handleFinish);

        return () => {
            clearTimeout(timer);
            router.off('finish', handleFinish);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(refreshScrollAnimations, 200);
        return () => clearTimeout(timer);
    });

    return children;
};

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx', { eager: false })
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <PrivyProvider appId={PRIVY_APP_ID} config={PRIVY_CONFIG}>
                <ScrollAnimationProvider>
                    <App {...props} />
                </ScrollAnimationProvider>
            </PrivyProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
