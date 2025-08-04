import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CallProgress({
  startedAt,
  completeEstimation,
  assignedTo,
  events = [],
}: any) {
  // Calculate time values
  const startTime = new Date(startedAt).getTime();
  const currentTime = Date.now();
  const assignmentTime = new Date(assignedTo.timestamp).getTime();
  const totalDuration = completeEstimation * 60 * 1000; // Convert minutes to milliseconds
  const endTime = startTime + totalDuration;
  const elapsedSinceAssignment = currentTime - assignmentTime;

  // Calculate assignment position as percentage of total timeline
  const assignmentPosition = Math.max(
    0,
    Math.min(100, ((assignmentTime - startTime) / totalDuration) * 100)
  );

  // Calculate event positions
  const eventPositions = events.map((event) => {
    const eventTime = new Date(event.timestamp).getTime();
    const position = Math.max(
      0,
      Math.min(100, ((eventTime - startTime) / totalDuration) * 100)
    );
    return { ...event, position };
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="relative">
      {/* User Assignment Indicator */}
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <div
            className="absolute -top-10 transform -translate-x-1/2 cursor-pointer z-20"
            style={{ left: `${assignmentPosition}%` }}
          >
            <div className="relative">
              <img
                src={assignedTo.profilePicture}
                alt={assignedTo.name}
                className="w-6 h-6 rounded-full border-2 border-foreground shadow-md"
              />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-foreground"></div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="px-3 py-2 bg-foreground text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
          <div className="font-semibold">{assignedTo.name}</div>
          <div>Assigned: {formatTime(assignedTo.timestamp)}</div>
        </TooltipContent>
      </Tooltip>

      {/* Progress Bar Container */}
      <div className="relative h-3 bg-background rounded-full">
        {/* Green/Red section from assignment to end */}
        <div
          className={`absolute top-0 h-full rounded-r-full ${
            currentTime <= endTime ? "bg-green-500" : "bg-red-500"
          }`}
          style={{
            left: `${assignmentPosition}%`,
            width: `${Math.max(0, 100 - assignmentPosition)}%`,
          }}
        ></div>

        {/* Event Breakpoints */}
        <TooltipProvider delayDuration={100}>
          {eventPositions.map((event, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <div
                  className="absolute rounded-full -top-1 h-6 w-[6px] bg-foreground cursor-pointer z-[100000000] overflow-visible"
                  style={{ left: `${event.position}%` }}
                />
              </TooltipTrigger>
              <TooltipContent className="px-3 py-2 bg-foreground text-surface text-sm rounded-lg shadow-lg whitespace-nowrap max-w-xs">
                <div>{event.description}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatTime(event.timestamp)}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Time markers */}
      <div className="flex justify-start items-center gap-2 text-xs mt-2">
        <div
          className={`size-2 rounded-full ${
            currentTime <= endTime ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span
          className={`${
            currentTime <= endTime ? "text-green-500" : "text-red-500"
          }`}
        >
          {/* {formatDuration(completeEstimation)} */}
          נותרו {Math.floor(
            (totalDuration - elapsedSinceAssignment) / 60000
          )}{" "}
          דקות
        </span>
      </div>
    </div>
  );
}
