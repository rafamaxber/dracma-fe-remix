import { SideBarProps } from "./SideBarProps";

export function AvatarIcon({ avatarUrl = 'https://i.pravatar.cc/100', userName = 'John Doe' }: SideBarProps = {}) {
  return (
    <a className="block w-8 avatar-icon sm:w-10 " href="/profile">
      <img className="border rounded-full border-slate-300" src={avatarUrl} alt={userName} />
    </a>
  );
}
