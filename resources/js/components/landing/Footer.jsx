import LaunchAppButton from './LaunchAppButton';

const navLinks = [
    { label: 'Hero', href: '#hero' },
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Problem', href: '#problem' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Protection', href: '#protection' },
    { label: 'Token', href: '#token' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'FAQ', href: '#faq' },
];

const Footer = ({ twitter, isLight = true }) => (
    <footer className="flex flex-col items-center mt-[120px] relative w-full max-w-[1321px] gap-[200px]">
        {isLight && <img src="/assets/img/glow-header.svg" className="absolute top-full left-1/2 -translate-x-1/2" alt="" />}

        <div className="flex w-full items-center justify-between z-50">
            <div className="flex items-center gap-[10px]" data-scroll-animate="slide-in-left" data-scroll-duration="0.7">
                <img src="/assets/img/logo.svg" alt="" />
                <span className="text-white font-semibold text-lg">Averti</span>
            </div>

            <nav className="flex items-center gap-[24px]">
                {navLinks.map((item, i) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className="text-sm text-[#EEEEEE]/60 hover:text-white transition-cubic"
                        data-scroll-animate="fade-up"
                        data-scroll-delay={i * 50}
                        data-scroll-duration="0.5"
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className="flex items-center gap-[10px]" data-scroll-animate="slide-in-right" data-scroll-duration="0.7">
                <a href={twitter} target="_blank" rel="noopener noreferrer" className="transition-cubic-hover">
                    <img src="/assets/img/twitter-button.svg" alt="" />
                </a>
                <LaunchAppButton />
            </div>
        </div>

        <div className="flex w-full pb-[30px] justify-center" >
            <img src="/assets/img/footer--bg.svg" className="flex absolute left-1/2 bottom-0 -translate-x-1/2" alt="" />
            <span className="font-medium text-sm text-[#EEEEEE]">© 2025 Averti. All rights reserved.</span>
        </div>
    </footer>
);

export default Footer;
