const Card = ({ className, children, ...props }: any) => {
    const classes = "bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] overflow-hidden";
    return <div className={`${classes} ${className}`} {...props}>{children}</div>;
};

export default Card;