import { useSearchParams } from "react-router-dom";
import GuestChatWindow from "@/components/aiAgent/GuestChatWindow";

export default function GuestChatPage() {  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  if (!token) return <div>Missing token</div>;

  return (
    <div className="absolute inset-0 bg-white m-0 p-0 overflow-hidden md:static md:flex md:justify-center md:items-start md:h-screen md:pt-8">
      <GuestChatWindow token={token} />
    </div>
  );
}
