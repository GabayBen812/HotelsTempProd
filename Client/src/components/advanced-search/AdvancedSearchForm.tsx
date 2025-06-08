import React, { useState } from "react";
import { AdvancedSearchFieldConfig } from "@/types/advanced-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface AdvancedSearchFormProps {
  fields: AdvancedSearchFieldConfig[];
  initialValues?: Record<string, any>;
  onApply: (values: Record<string, any>) => void;
  onReset?: () => void;
}

export const AdvancedSearchForm: React.FC<AdvancedSearchFormProps> = ({ fields, initialValues = {}, onApply, onReset }) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        switch (field.type) {
          case "select":
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label>{field.label}</label>
                <Select
                  value={values[field.name] ?? ""}
                  onValueChange={(val) => handleChange(field.name, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || field.label} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((opt) => (
                      <SelectItem key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          case "date":
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label>{field.label}</label>
                <Calendar
                  mode="single"
                  selected={values[field.name]}
                  onSelect={(date) => handleChange(field.name, date)}
                />
                {values[field.name] && (
                  <span className="text-xs text-muted-foreground">
                    {format(values[field.name], "dd/MM/yyyy")}
                  </span>
                )}
              </div>
            );
          case "text":
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label>{field.label}</label>
                <Input
                  type="text"
                  value={values[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            );
          case "number":
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label>{field.label}</label>
                <Input
                  type="number"
                  value={values[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            );
          case "checkbox":
            return (
              <div key={field.name} className="flex items-center gap-2">
                <Checkbox
                  checked={!!values[field.name]}
                  onCheckedChange={(val) => handleChange(field.name, val)}
                  id={field.name}
                />
                <label htmlFor={field.name}>{field.label}</label>
              </div>
            );
          default:
            return null;
        }
      })}
      <div className="flex gap-2 justify-end">
        {onReset && (
          <Button type="button" variant="ghost" onClick={onReset}>
            איפוס
          </Button>
        )}
        <Button type="submit" variant="default">
          סנן
        </Button>
      </div>
    </form>
  );
}; 