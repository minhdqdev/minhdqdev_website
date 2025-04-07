import { cn } from "../../lib/utils";

const SkillPill = ({ skill, style }) => (
  <span
    className={cn(
      "px-4 py-2 rounded-full text-sm font-medium",
      "bg-gradient-to-r from-purple-500/20 to-blue-500/20",
      "text-white/90 shadow-sm shadow-purple-500/20",
      "border border-white/10",
      "inline-flex items-center justify-center gap-4 text-nowrap"
    )}
    style={style}
  >
    {skill}
  </span>
);

export default SkillPill;
