import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CallChat } from "@/components/calls-table/CallChat/CallChat";

interface DetailedViewProps<T extends Record<string, unknown>> {
  rowData: T;
  onEditClick: () => void;
}

interface EnhancedFieldValue {
  value: string;
  badge?: boolean;
  loading?: boolean;
  error?: boolean;
}

export function DataTableBodyDetailedView<T extends Record<string, unknown>>({
  rowData,
  onEditClick,
}: DetailedViewProps<T>) {
  const { t } = useTranslation();
  const [enhancedData, setEnhancedData] = useState<
    Record<string, EnhancedFieldValue>
  >({});

  useEffect(() => {
    const fetchEnhancedData = async () => {
      const enhanced: Record<string, EnhancedFieldValue> = {};

      for (const [key, value] of Object.entries(rowData)) {
        if (key.toLowerCase().includes("id") && key !== "id") {
          enhanced[key] = {
            value: value?.toString() || t("common.na"),
            loading: true,
          };
          try {
            // Here you would make your API call to get the actual name
            enhanced[key] = {
              value: t(`entities.${key.replace("Id", "").toLowerCase()}_name`), // Replace with actual API call
              badge: true,
            };
          } catch (error) {
            enhanced[key] = {
              value: value?.toString() || t("common.na"),
              error: true,
            };
          }
        } else {
          enhanced[key] = { value: value?.toString() || t("common.na") };
        }
      }
      setEnhancedData(enhanced);
    };

    fetchEnhancedData();
  }, [rowData, t]);

  // @ts-ignore
  const renderValue = (key: string, field: EnhancedFieldValue) => {
    if (field.loading) {
      return <div className="h-4 w-24 animate-pulse bg-muted rounded" />;
    }

    if (field.badge) {
      return (
        <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
          {field.value}
        </Badge>
      );
    }

    if (field.error) {
      return <span className="text-sm text-destructive">{field.value}</span>;
    }

    return <span className="text-sm">{field.value}</span>;
  };

  // Group fields by category
  const groupFields = () => {
    const groups: Record<string, Array<[string, EnhancedFieldValue]>> = {
      main: [],
      details: [],
      metadata: [],
    };

    Object.entries(enhancedData).forEach((entry) => {
      const [key] = entry;
      if (key.toLowerCase().includes("id") || key === "status") {
        groups.metadata.push(entry);
      } else if (["title", "name", "description"].includes(key.toLowerCase())) {
        groups.main.push(entry);
      } else {
        groups.details.push(entry);
      }
    });

    return groups;
  };

  const groups = groupFields();

  const formatFieldName = (key: string) => {
    // First try to get a specific translation for this field
    const specificTranslation = t(`fields.${key.toLowerCase()}`, {
      defaultValue: "",
    });
    if (specificTranslation) return specificTranslation;

    // If no specific translation exists, format the key and translate common words
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => t(`common.${word.toLowerCase()}`, { defaultValue: word }))
      .join(" ");
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-md border bg-background/80">
        <CardHeader className="flex flex-row items-center justify-between bg-primary/5 rounded-t-xl px-6 py-4">
          <div>
            <CardTitle className="text-lg font-semibold">
              {rowData.name?.toString() ||
                rowData.title?.toString() ||
                t("common.details")}
            </CardTitle>
            {groups.main.length > 0 && (
              <CardDescription className="mt-1 text-muted-foreground">
                {groups.main.map(([key, field]) => renderValue(key, field))}
              </CardDescription>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t("actions.edit")}
          </Button>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4">
          {groups.details.map(([key, field]) => (
            <div key={key} className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">
                {formatFieldName(key)}
              </div>
              <div>{renderValue(key, field)}</div>
            </div>
          ))}
        </CardContent>

        {groups.metadata.length > 0 && (
          <CardFooter className="flex flex-wrap gap-4 bg-muted/40 rounded-b-xl px-6 py-3">
            {groups.metadata.map(([key, field]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatFieldName(key)}:
                </span>
                {renderValue(key, field)}
              </div>
            ))}
          </CardFooter>
        )}
      </Card>

      <div className="mt-4">
        {/* @ts-ignore */}
        <CallChat callId={Number(rowData.id)} />
      </div>
    </div>
  );
}
