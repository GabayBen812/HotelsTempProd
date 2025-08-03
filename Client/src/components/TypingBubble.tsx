export default function TypingBubble() {
  return (
    <div className="flex items-end px-4 py-2 max-w-md">
      <div className="relative bg-background p-4 rounded-2xl rounded-br-md shadow-sm">
        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-[7px] h-[7px] bg-foreground rounded-full animate-bounceAndPulse`}
              style={{ animationDelay: `${i * 160}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
