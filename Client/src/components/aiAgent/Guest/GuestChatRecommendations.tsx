import { ShieldQuestion } from "lucide-react";

export default function GuestChatRecommendations({
  header,
  text,
}: {
  header: string;
  text?: string;
}) {
  return (
    <div className="w-full border rounded-xl flex gap-4 p-4 items-center cursor-pointer hover:shadow-md duration-150">
      <div className="size-10 bg-primary rounded-full text-white items-center justify-center flex">
        <ShieldQuestion />
      </div>
      <div className="">
        <h1 className="font-semibold text-primary">{header}</h1>
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
