import React from "react";
import { Input } from "@/components/ui/Input";

interface ImageUploadProps {
  label: string;
  defaultValue?: string;
  onImageChange: (value: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  defaultValue = "",
  onImageChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <Input
        type="text"
        value={defaultValue}
        onChange={(e) => onImageChange(e.target.value)}
        placeholder="Enter image URL"
      />
    </div>
  );
}; 