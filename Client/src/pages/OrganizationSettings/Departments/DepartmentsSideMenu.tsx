import PeopleIcon from "@/assets/icons/PeopleIcon";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

export default function DepartmentsSideMenu() {
  return (
    <div className="p-4 rounded-lg bg-white shadow-lg flex flex-col gap-4 w-80 h-[850px]">
      <h1 className="font-semibold text-primary text-lg">מחלקות</h1>
      <Input
        icon={<Search className="text-secondary" />}
        placeholder="חיפוש..."
      />

      <Card selected />
      <Card />
      <Card />
      <Card />
    </div>
  );
}

function Card({ selected }: { selected?: boolean }) {
  return (
    <div
      className={`${
        selected ? "border-border" : "border-border"
      } border w-full child:w-full rounded-lg overflow-hidden cursor-pointer group`}
    >
      <h2
        className={`${
          selected
            ? "bg-primary text-background"
            : "bg-border/25 text-primary group-hover:bg-border/50"
        } p-2 px-3 font-semibold duration-200`}
      >
        מחלקה 1
      </h2>
      <div className="flex justify-between items-center p-2 px-3 child:text-sm">
        <h4>מנהל מחלקה: יותם עפרי</h4>
        <p className="text-secondary flex gap-2">
          <PeopleIcon /> 13 אנשים
        </p>
      </div>
    </div>
  );
}
