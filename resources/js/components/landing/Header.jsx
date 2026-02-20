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

const Header = ({ twitter, isLight = true }) => (
    <header className="flex justify-between relative w-full max-w-[1321px] mt-[20px] items-center px-4 md:px-0">
        {isLight && <img src="/assets/img/glow-header.svg" className="absolute top-full left-1/2 -translate-x-1/2" alt="" />}

        <div className="flex items-center gap-[10px]" data-scroll-animate="slide-in-left" data-scroll-duration="0.7">
            <img src="/assets/img/logo.svg" alt="" />
            <span className="text-white font-semibold text-lg">Averti</span>
        </div>

        <nav className="hidden lg:flex items-center gap-[24px]">
            {navLinks.map((item, i) => (
                <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-[#EEEEEE]/60 hover:text-white transition-cubic"
                    data-scroll-animate="fade-down"
                    data-scroll-delay={100 + i * 60}
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
    </header>
);

export default Header;
