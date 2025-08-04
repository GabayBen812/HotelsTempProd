import React, { useContext, useState } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Location } from "@/types/api/locations";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";

interface Props {
  location: Location;
}

export default function ChatBotLinkButtons({ location }: Props) {
  const { organization } = useContext(OrganizationsContext);
  const [copied, setCopied] = useState(false);
  const url = `http://localhost:3101/ai/guest?organizationId=${organization?.id}&locationId=${location.id}`;
  const handleVisitPage = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleCopyLink = async () => {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!url) {
    return <div className={`text-sm text-gray-400`}>No URL provided</div>;
  }

  return (
    <div className={`flex gap-2 `}>
      <Button
        onClick={handleVisitPage}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent rounded hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors active:scale-95 transform"
      >
        <ExternalLink className="w-3 h-3" />
        {"העבור"}
      </Button>

      <Button
        onClick={handleCopyLink}
        variant={"ghost"}
        className={`inline-flex bg-background text-muted-foreground items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors focus:outline-none transform ${
          copied && "text-green-700 bg-green-100 hover:bg-green-200"
        }`}
      >
        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        {copied ? "הועתק" : "העתק"}
      </Button>
    </div>
  );
}
