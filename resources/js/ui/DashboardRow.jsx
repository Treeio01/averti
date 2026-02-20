const DashboardRow = ({ label, children }) => (
    <div className="flex items-center w-full justify-between">
        <span className="text-lg text-[#EEEEEE]/60">{label}</span>
        {children}
    </div>
);

export default DashboardRow;
