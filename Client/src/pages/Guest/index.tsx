import GuestChatWindow from "@/components/aiAgent/Guest/GuestChatWindow";

export default function GuestChatPage() {
  return (
    <div className="absolute inset-0 bg-surface m-0 p-0 overflow-hidden md:static md:flex md:justify-center md:items-start md:h-screen md:pt-8">
      <GuestChatWindow />
    </div>
  );
}
