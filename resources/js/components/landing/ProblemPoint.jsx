const ProblemPoint = ({ text, className, align = 'left', animDelay = 0 }) => {
    const isRight = align === 'right';

    return (
        <div
            className={`flex flex-col gap-[10px] ${isRight ? 'items-end' : ''} ${className}`}
            data-scroll-animate={isRight ? 'slide-in-right-blur' : 'slide-in-left-blur'}
            data-scroll-delay={animDelay}
            data-scroll-duration="0.9"
        >
            <svg
                width="13"
                height="11"
                viewBox="0 0 13 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={isRight ? 'rotate-y-180' : ''}
            >
                <path d={isRight ? "M13 0L9 7L0 11H13L13 0Z" : "M5.31726e-06 0L4 7L13 11H0L5.31726e-06 0Z"} fill="#58E8BB"/>
            </svg>
            <span className={`text-white font-medium text-[22px] ${isRight ? 'text-right' : ''}`}>
                {text}
            </span>
        </div>
    );
};

export default ProblemPoint;
