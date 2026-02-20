import { useState, useEffect } from 'react';

export default function useCountdown(seconds = 30) {
    const [left, setLeft] = useState(seconds);

    useEffect(() => {
        const id = setInterval(
            () => setLeft(prev => (prev <= 1 ? seconds : prev - 1)),
            1000
        );
        return () => clearInterval(id);
    }, [seconds]);

    return left;
}
