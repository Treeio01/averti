import { useState, useEffect, useCallback, useMemo } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';

const TIMEFRAMES = ['Time', '1H', '24H'];

async function fetchChart(tf) {
    const { data } = await axios.get('/api/sol/chart', { params: { tf } });
    return data;
}

function buildBalanceSeries(prices) {
    if (!prices.length) return [];
    const alpha = 0.06;
    let ema = prices[0];
    const seed = prices.reduce((s, p) => s + p, 0);
    let rng = seed % 1000;
    return prices.map((p) => {
        ema = alpha * p + (1 - alpha) * ema;
        rng = (rng * 9301 + 49297) % 233280;
        const noise = ((rng / 233280) - 0.5) * p * 0.012;
        return +((ema + (ema - p) * 0.3) + noise).toFixed(2);
    });
}

export default function SolChart({ livePrice }) {
    const [tf, setTf] = useState('24H');
    const [candles, setCandles] = useState([]);
    const [loading, setLoading] = useState(true);

    const spot = livePrice;

    const loadChart = useCallback(async (timeframe) => {
        setLoading(true);
        try {
            const { klines } = await fetchChart(timeframe);
            setCandles(klines);
        } catch (e) {
            console.error('Chart fetch failed:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadChart(tf);
    }, [tf, loadChart]);

    useEffect(() => {
        if (livePrice === null || !candles.length) return;
        setCandles(prev => {
            const now = Date.now();
            const last = prev[prev.length - 1];
            const intervalMs = tf === '24H' ? 300000 : 60000;

            if (now - last.t >= intervalMs) {
                const maxLen = tf === '24H' ? 288 : tf === '1H' ? 60 : 30;
                return [...prev, { t: now, p: livePrice }].slice(-maxLen);
            }
            return [...prev.slice(0, -1), { ...last, p: livePrice }];
        });
    }, [livePrice]);

    const prices = useMemo(() => candles.map(c => c.p), [candles]);
    const times = useMemo(() => candles.map(c => c.t), [candles]);
    const balance = useMemo(() => buildBalanceSeries(prices), [prices]);

    const { yMin, yMax } = useMemo(() => {
        if (!prices.length) return { yMin: 0, yMax: 100 };
        const all = [...prices, ...balance];
        const lo = Math.min(...all);
        const hi = Math.max(...all);
        const range = hi - lo || 1;
        const pad = range * 0.12;
        return {
            yMin: +(lo - pad).toFixed(2),
            yMax: +(hi + pad).toFixed(2),
        };
    }, [prices, balance]);

    const triggerPrice = spot ? +(spot * 1.015).toFixed(2) : null;

    const options = useMemo(() => ({
        chart: {
            type: 'line',
            background: 'transparent',
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: 'inherit',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 300,
                dynamicAnimation: { enabled: true, speed: 300 },
            },
            selection: { enabled: false },
        },
        colors: ['#8B5CF6', '#58E8BB'],
        stroke: {
            curve: 'straight',
            width: [1.8, 1.4],
            lineCap: 'round',
        },
        fill: {
            type: ['gradient', 'gradient'],
            gradient: {
                shade: 'dark',
                type: 'vertical',
                opacityFrom: 0.25,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        grid: {
            borderColor: 'rgba(255,255,255,0.04)',
            strokeDashArray: 4,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { left: 8, right: 8, top: 10, bottom: 0 },
        },
        xaxis: {
            type: 'datetime',
            categories: times,
            labels: {
                show: true,
                datetimeUTC: false,
                style: { colors: '#444', fontSize: '10px' },
                datetimeFormatter: { hour: 'HH:mm', minute: 'HH:mm' },
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
            crosshairs: {
                show: true,
                stroke: { color: '#ffffff15', width: 1, dashArray: 4 },
            },
            tooltip: { enabled: false },
        },
        yaxis: [
            {
                min: yMin, max: yMax, tickAmount: 5,
                labels: {
                    style: { colors: '#555', fontSize: '11px' },
                    formatter: (v) => '$' + v.toFixed(2),
                    offsetX: -5,
                },
            },
            {
                opposite: true, min: yMin, max: yMax, tickAmount: 5,
                labels: {
                    style: { colors: '#555', fontSize: '11px' },
                    formatter: (v) => '$' + v.toFixed(2),
                    offsetX: 5,
                },
            },
        ],
        legend: { show: false },
        tooltip: {
            enabled: true,
            shared: true,
            theme: 'dark',
            x: { format: 'HH:mm:ss' },
            y: { formatter: (v) => v ? '$' + v.toFixed(2) : '—' },
            style: { fontSize: '12px' },
            marker: { show: true },
        },
        dataLabels: { enabled: false },
        markers: {
            size: 0,
            hover: { size: 4, sizeOffset: 2 },
        },
    }), [yMin, yMax, times]);

    const series = useMemo(() => [
        { name: 'SOL/USD', data: prices },
        { name: 'Balance', data: balance },
    ], [prices, balance]);

    const priceChange = prices.length >= 2
        ? prices[prices.length - 1] - prices[0]
        : null;
    const priceChangePct = priceChange !== null && prices[0]
        ? (priceChange / prices[0]) * 100
        : null;

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-[#EEEEEE] text-lg font-medium">$SOL / USD</span>
                    <span className="flex items-center gap-1.5 bg-[#58E8BB]/10 text-[#58E8BB] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#58E8BB] animate-pulse"></span>
                        LIVE
                    </span>
                </div>
                {spot !== null && (
                    <div className="flex items-center gap-3">
                        <span className="text-[#EEEEEE] text-xl font-semibold">
                            ${spot.toFixed(2)}
                        </span>
                        {priceChangePct !== null && (
                            <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                                priceChange >= 0
                                    ? 'text-[#58E8BB] bg-[#58E8BB]/10'
                                    : 'text-[#FF6B6B] bg-[#FF6B6B]/10'
                            }`}>
                                {priceChange >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}%
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-[2px] rounded-full bg-[#8B5CF6]"></span>
                    <span className="text-[#EEEEEE]/35 text-xs">Price ($)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-3 h-[2px] rounded-full bg-[#58E8BB]"></span>
                    <span className="text-[#EEEEEE]/35 text-xs">Balance</span>
                </div>
            </div>

            <div className="w-full -mx-2 min-h-[280px]">
                {loading && !prices.length ? (
                    <div className="flex items-center justify-center h-[280px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-5 h-5 border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin"></div>
                            <span className="text-[#EEEEEE]/25 text-xs">Loading SOL/USD...</span>
                        </div>
                    </div>
                ) : (
                    <Chart options={options} series={series} type="area" height={280} />
                )}
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 pt-1 border-t border-white/[0.03]">
                <div className="flex items-center gap-1 bg-[#111] rounded-lg p-1">
                    {TIMEFRAMES.map((key) => (
                        <button
                            key={key}
                            onClick={() => setTf(key)}
                            className={`text-xs px-3 py-1.5 rounded-md transition-all ${
                                tf === key
                                    ? 'text-[#EEEEEE] bg-[#1A1A1A]'
                                    : 'text-[#EEEEEE]/30 hover:text-[#EEEEEE]/50'
                            }`}
                        >
                            {key}
                        </button>
                    ))}
                </div>

                <span className="text-[#EEEEEE]/25 text-xs">
                    LIVE: <span className="text-[#EEEEEE]/40">Available balance (LIVE)</span>
                </span>

                <div className="flex items-center gap-5">
                    <span className="text-[#EEEEEE]/30 text-xs">
                        Current: <span className="text-[#EEEEEE]/70 font-medium">
                            {spot !== null ? `$${spot.toFixed(2)}` : '—'}
                        </span>
                    </span>
                    <span className="text-[#EEEEEE]/30 text-xs">
                        Next trigger: <span className="text-[#58E8BB]/70 font-medium">
                            {triggerPrice !== null ? `$${triggerPrice.toFixed(2)}` : '—'}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}
