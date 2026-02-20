import { useState, useEffect } from 'react';

const FORMAT_OPTIONS = { hour12: false };

export default function useCurrentTime() {
    const [time, setTime] = useState(() =>
        new Date().toLocaleTimeString('en-GB', FORMAT_OPTIONS)
    );

    useEffect(() => {
        const id = setInterval(
            () => setTime(new Date().toLocaleTimeString('en-GB', FORMAT_OPTIONS)),
            1000
        );
        return () => clearInterval(id);
    }, []);

    return time;
}
