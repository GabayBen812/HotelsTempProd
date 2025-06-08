import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Dummy data for select fields (replace with API data as needed)
const departments = [
  { value: "maintenance", label: "Maintenance" },
  { value: "housekeeping", label: "Housekeeping" },
];
const categories = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
];
const priorities = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const users = [
  { value: "user1", label: "User 1" },
  { value: "user2", label: "User 2" },
];

export default function AddCall() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    // TODO: Replace with actual API call
    await new Promise((res) => setTimeout(res, 1000));
    setSuccess(true);
    reset();
    setTimeout(() => {
      setSuccess(false);
      navigate("/calls");
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-muted/50">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t("add_call")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">{t("title")}</Label>
                <Input id="title" {...register("title", { required: true })} />
                {errors.title && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
              <div>
                <Label htmlFor="priority">{t("priority")}</Label>
                <Select {...register("priority", { required: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_option")} />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((p) => (
                      <SelectItem key={p.value} value={p.value}>{t(p.label.toLowerCase()) || p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">{t("description")}</Label>
                <Input id="description" {...register("description", { required: true })} />
                {errors.description && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
              <div>
                <Label htmlFor="department">{t("department")}</Label>
                <Select {...register("department", { required: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_option")} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.value} value={d.value}>{t(d.label.toLowerCase()) || d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
              <div>
                <Label htmlFor="category">{t("category")}</Label>
                <Select {...register("category", { required: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_option")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{t(c.label.toLowerCase()) || c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
              <div>
                <Label htmlFor="location">{t("location")}</Label>
                <Input id="location" {...register("location", { required: true })} />
                {errors.location && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
              <div>
                <Label htmlFor="room_number">{t("room_number")}</Label>
                <Input id="room_number" {...register("room_number", { required: true })} />
                {errors.room_number && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
              <div>
                <Label htmlFor="assigned_to">{t("assigned_to")}</Label>
                <Select {...register("assigned_to", { required: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_option")} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assigned_to && <span className="text-destructive text-xs">{t("required")}</span>}
              </div>
            </div>
            <Button className="w-full mt-4" type="submit" loading={isSubmitting}>
              {t("create")}
            </Button>
            {success && (
              <div className="text-success text-center mt-2">{t("success")}</div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 