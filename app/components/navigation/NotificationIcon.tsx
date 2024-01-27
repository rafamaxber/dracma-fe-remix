import { LuBell, LuBellDot } from "react-icons/lu";

export function NotificationIcon({ hasNewMessages = true }: { hasNewMessages?: boolean; }) {
  return hasNewMessages ? <LuBellDot className="text-primary" size="22px" /> : <LuBell className="text-slate-300" size="22px" />;
}
