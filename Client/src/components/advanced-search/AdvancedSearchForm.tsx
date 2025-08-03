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

  // Find the date fields for range
  const fromField = fields.find(f => f.name === 'createdAtFrom');
  const toField = fields.find(f => f.name === 'createdAtTo');
  const otherFields = fields.filter(f => f.name !== 'createdAtFrom' && f.name !== 'createdAtTo');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Render all fields except the date range */}
      {otherFields.map((field) => {
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
      {/* Render the date range fields side by side */}
      {fromField && toField && (
        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-1 w-1/2">
            <label>{fromField.label}</label>
            <Calendar
              mode="single"
              selected={values[fromField.name]}
              onSelect={(date) => handleChange(fromField.name, date)}
            />
            {values[fromField.name] && (
              <span className="text-xs text-muted-foreground">
                {format(values[fromField.name], "dd/MM/yyyy")}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-1/2">
            <label>{toField.label}</label>
            <Calendar
              mode="single"
              selected={values[toField.name]}
              onSelect={(date) => handleChange(toField.name, date)}
            />
            {values[toField.name] && (
              <span className="text-xs text-muted-foreground">
                {format(values[toField.name], "dd/MM/yyyy")}
              </span>
            )}
          </div>
        </div>
      )}
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