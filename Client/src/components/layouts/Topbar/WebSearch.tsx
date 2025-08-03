import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { router } from "@/utils/routes/router";

export function CommandDialogDemo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");

  // Extract commands from router - fix the route access
  const commandData = [
    {
      heading: "pages",
      items: (() => {
        // Find the layout route that contains children
        const layoutRoute = router.routes.find(
          (route) => route.children && route.children.length > 0
        );

        if (!layoutRoute || !layoutRoute.children) return [];

        return layoutRoute.children
          .filter((route) => route.handle?.showInSidebar)
          .map((route) => ({
            label: route.handle?.title || "",
            icon: route.handle?.icon,
            path: route.path || "",
          }));
      })(),
    },
  ];

  console.log(commandData, "commandData");

  // Filter commands based on query
  const filteredCommands = commandData.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (!query) return true; // Show all items when no query
      const translatedLabel = t(item.label).toLowerCase();
      return translatedLabel.includes(query.toLowerCase());
    }),
  }));

  const handleSelect = (path: string) => {
    navigate(path);
    setQuery(""); // Clear the search query
    setIsFocused(false);
    // Better way to blur the active element
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow click events to register
    setTimeout(() => setIsFocused(false), 150);
  };

  return (
    <Command className="rounded-lg border shadow-sm md:min-w-[450px] bg-surface">
      <CommandInput
        className="shadow-none"
        placeholder={t("search") + "..."}
        value={query}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onValueChange={setQuery}
      />
      {isFocused && (
        <CommandList>
          {filteredCommands.every((group) => group.items.length === 0) ? (
            <CommandEmpty>{t("No results found.")}</CommandEmpty>
          ) : (
            filteredCommands.map((group, index) => (
              <div key={group.heading}>
                <CommandGroup heading={t(group.heading)}>
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.path}
                      onSelect={() => handleSelect(item.path)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>{item.icon && <item.icon />}</span>
                        <span>{t(item.label)}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {index < filteredCommands.length - 1 && <CommandSeparator />}
              </div>
            ))
          )}
        </CommandList>
      )}
    </Command>
  );
}
