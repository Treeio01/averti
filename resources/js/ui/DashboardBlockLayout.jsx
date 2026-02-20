const DashboardBlockLayout = ({className, children}) => {
    return (
        <div className={"p-[32px] flex bg-[#090909] border border-[#1A1A1A] rounded-[16px] " + className}>
            {children}
        </div>
    );
};

export default DashboardBlockLayout;
