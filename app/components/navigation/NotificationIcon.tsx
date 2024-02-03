import { LuBell, LuBellDot } from "react-icons/lu";

export function NotificationIcon({ size = '22px', hasNewMessages = true }: { hasNewMessages?: boolean; size: string }) {
  return hasNewMessages ? <LuBellDot className="text-slate-500" size={size} /> : <LuBell className="text-slate-500" size={size} />;
}
