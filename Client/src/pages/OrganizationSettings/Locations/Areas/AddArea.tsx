import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Brush } from "lucide-react";

interface AddAreaProps {
  editMode: boolean;
  isAddingNew: boolean;
  setIsAddingNew: (value: boolean) => void;
  newWingName: string;
  setNewWingName: (value: string) => void;
  onAdd: (name: string) => void;
  addInputRef: React.RefObject<HTMLInputElement>;
}

function AddArea({
  editMode,
  isAddingNew,
  setIsAddingNew,
  newWingName,
  setNewWingName,
  onAdd,
  addInputRef,
}: AddAreaProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newWingName.trim()) {
      onAdd(newWingName.trim());
      setNewWingName("");
    } else if (e.key === "Escape") {
      setIsAddingNew(false);
      setNewWingName("");
    }
  };

  return (
    <div
      className="border border-dashed p-2 rounded-lg flex gap-2 items-center border-8"
      onClick={() => editMode && setIsAddingNew(true)}
    >
      <Avatar className="rounded-md size-6">
        <AvatarImage />
        <AvatarFallback className="size-6 bg-gray-600 rounded-lg">
          <Brush className="size-3 text-white" />
        </AvatarFallback>
      </Avatar>

      {editMode && isAddingNew ? (
        <input
          ref={addInputRef}
          className="text-sm w-full outline-none border-none bg-transparent focus:ring-0 text-secondary"
          value={newWingName}
          onChange={(e) => setNewWingName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsAddingNew(false)}
          placeholder="Type wing name"
          dir="auto"
        />
      ) : (
        <h1 className="text-secondary text-sm border border-secondary border-dashed px-2 rounded-md">
          Add Wing
        </h1>
      )}
    </div>
  );
}

export default AddArea;
