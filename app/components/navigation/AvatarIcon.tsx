import { SideBarProps } from "./SideBarProps";

export function AvatarIcon({ avatarUrl = 'https://i.pravatar.cc/100', userName = 'John Doe' }: SideBarProps = {}) {
  return (
    <div className="block w-12 avatar-icon sm:w-10">
      <img className="border rounded-full border-primary" src={avatarUrl} alt={userName} />
    </div>
  );
}
