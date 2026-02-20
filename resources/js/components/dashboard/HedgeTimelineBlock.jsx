import { useState, useEffect, useRef } from 'react';
import DashboardBlockLayout from '@/ui/DashboardBlockLayout.jsx';

const EVENTS = ['Oracle update', 'Price trigger', 'Hedge rebalance', 'Threshold check', 'Position adjust'];
const OUTPUTS = ['Recalc', 'Hedge up', 'Hedge down', 'Hold', 'Rebalance'];
const TAGS = ['LIVE', 'SIM'];
const TX_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';

function randomTx() {
    let s = '';
    for (let i = 0; i < 8; i++) s += TX_CHARS[Math.floor(Math.random() * TX_CHARS.length)];
    s += '...';
    for (let i = 0; i < 8; i++) s += TX_CHARS[Math.floor(Math.random() * TX_CHARS.length)];
    return s;
}

function randomEntry(id) {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    return {
        id,
        time,
        event: EVENTS[Math.floor(Math.random() * EVENTS.length)],
        output: OUTPUTS[Math.floor(Math.random() * OUTPUTS.length)],
        tag: TAGS[Math.floor(Math.random() * TAGS.length)],
        tx: randomTx(),
    };
}

const COLUMNS = [
    { label: 'Time', width: 'min-w-[176px] max-w-[176px]' },
    { label: 'Event', width: 'min-w-[302px] max-w-[302px]' },
    { label: 'Output', width: 'min-w-[248px] max-w-[248px]' },
    { label: 'Tag', width: 'min-w-[189px] max-w-[189px]' },
    { label: 'Tx', width: '' },
];

const outputColor = (output) => {
    if (output === 'Hedge up') return 'text-[#58E8BB]';
    if (output === 'Hedge down') return 'text-[#FF6B6B]';
    return 'text-[#EEEEEE]';
};

const HedgeTimelineBlock = () => {
    const [entries, setEntries] = useState([]);
    const idRef = useRef(0);
    const scrollRef = useRef(null);

    useEffect(() => {
        setEntries(Array.from({ length: 3 }, () => randomEntry(idRef.current++)));

        const interval = setInterval(() => {
            setEntries(prev => {
                const entry = randomEntry(idRef.current++);
                return [entry, ...prev].slice(0, 50);
            });
        }, 4000 + Math.random() * 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardBlockLayout className="w-full gap-[32px] pb-0! flex-col">
            <div className="flex w-full items-start justify-between">
                <div className="flex flex-col gap-3">
                    <span className="text-[#EEEEEE] text-xl font-medium">Hedge Timeline</span>
                    <span className="text-[#EEEEEE]/60 text-lg">
                        Simulation and live clearly tagged
                    </span>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip-timeline)">
                        <path d="M5 5H2V8H5V5Z" fill="#58E8BB"/>
                        <path d="M5 17H2V20H5V17Z" fill="#58E8BB"/>
                        <path d="M5 11H2V14H5V11Z" fill="#58E8BB"/>
                        <path d="M23 6V7H22V8H10V7H9V6H10V5H22V6H23Z" fill="#58E8BB"/>
                        <path d="M22 12H23V13H22V14H10V13H9V12H10V11H22V12Z" fill="#58E8BB"/>
                        <path d="M22 18H23V19H22V20H10V19H9V18H10V17H22V18Z" fill="#58E8BB"/>
                    </g>
                    <defs>
                        <clipPath id="clip-timeline">
                            <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>

            <div className="flex w-full flex-col gap-[15px] overflow-x-auto">
                <div className="flex w-full items-center gap-[10px] min-w-[900px]">
                    {COLUMNS.map(col => (
                        <span key={col.label} className={`text-[#EEEEEE]/60 text-lg w-full ${col.width}`}>
                            {col.label}
                        </span>
                    ))}
                </div>

                <div ref={scrollRef} className="flex flex-col w-full gap-[15px] max-h-[360px] overflow-y-scroll min-w-[900px]">
                    {entries.map((entry, i) => (
                        <div
                            key={entry.id}
                            className={`flex w-full p-[20px] gap-[10px] items-center rounded-[12px] bg-[#111111] transition-opacity duration-500 ${i === 0 ? 'animate-fade-in' : ''}`}
                        >
                            <span className="text-[#EEEEEE]/60 text-lg w-full min-w-[156px] max-w-[156px]">
                                {entry.time}
                            </span>
                            <span className="text-[#EEEEEE] font-medium text-lg w-full min-w-[302px] max-w-[302px]">
                                {entry.event}
                            </span>
                            <span className={`font-medium text-lg w-full min-w-[248px] max-w-[248px] ${outputColor(entry.output)}`}>
                                {entry.output}
                            </span>
                            <span className={`font-medium text-lg w-full min-w-[189px] max-w-[189px] ${
                                entry.tag === 'LIVE' ? 'text-[#58E8BB]' : 'text-[#EEEEEE]/60'
                            }`}>
                                {entry.tag}
                            </span>
                            <span className="text-[#EEEEEE] font-medium text-lg w-full">
                                {entry.tx}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardBlockLayout>
    );
};

export default HedgeTimelineBlock;
