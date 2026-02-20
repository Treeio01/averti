
const TopText = ({text}) => {
    return (
        <div className="flex w-full p-[15px] justify-center bg-[#086246] border border-[#58E8BB] top-shadow">
            <span className="font-medium text-[#EBEAFA] text-shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]">
                {text}
            </span>
        </div>
    );
};

export default TopText;
