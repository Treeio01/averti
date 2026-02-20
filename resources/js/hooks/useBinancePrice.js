import { useState, useEffect, useRef } from 'react';

const WS_URL = 'wss://stream.binance.com:9443/ws/solusdt@miniTicker';

export default function useBinancePrice() {
    const [price, setPrice] = useState(null);
    const wsRef = useRef(null);
    const reconnectRef = useRef(null);

    useEffect(() => {
        function connect() {
            if (wsRef.current?.readyState === WebSocket.OPEN) return;

            const ws = new WebSocket(WS_URL);
            wsRef.current = ws;

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                const p = parseFloat(msg.c);
                if (p) setPrice(p);
            };

            ws.onclose = () => {
                reconnectRef.current = setTimeout(connect, 3000);
            };

            ws.onerror = () => ws.close();
        }

        connect();

        return () => {
            clearTimeout(reconnectRef.current);
            wsRef.current?.close();
        };
    }, []);

    return price;
}
