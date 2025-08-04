import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CallsHeatmap() {
  const navigate = useNavigate();

  const departments = [
    "משק בית",
    "מכירות",
    "קבלה",
    "משאבי אנוש",
    "פיננסים",
    "תפעול",
  ];
  const areas = ["אגף צפון", "אגף דרום", "חוף", "חדר כושר"];

  const generateHeatmapData = () => {
    const data: Record<string, Record<string, number>> = {};
    departments.forEach((dept) => {
      data[dept] = {};
      areas.forEach((area) => {
        data[dept][area] = Math.floor(Math.random() * 100);
      });
    });
    return data;
  };

  const heatmapData = generateHeatmapData();

  const getHeatmapColor = (value: number) => {
    if (value >= 80) return "bg-blue-800";
    if (value >= 60) return "bg-blue-600";
    if (value >= 40) return "bg-blue-400";
    if (value >= 20) return "bg-blue-200";
    return "bg-blue-100";
  };

  const getTextColor = (value: number) => {
    return value >= 40 ? "text-white" : "text-gray-800";
  };

  return (
    <Card className="bg-surface/90 backdrop-blur-sm shadow-lg w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-4 text-lg">
          פניות לפי מחלקה ואיזור
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="flex flex-col w-full">
            {/* Column Headers */}
            <div className="flex mb-2 w-full">
              <div className="flex-shrink-0 w-32"></div>
              {areas.map((area, index) => (
                <div key={index} className="flex-1 text-center">
                  <div className="text-sm font-medium text-gray-700">
                    {area}
                  </div>
                </div>
              ))}
            </div>
            {/* Data Rows */}
            {departments.map((dept, deptIndex) => (
              <div key={deptIndex} className="flex mb-1 w-full">
                <div className="flex-shrink-0 w-32 flex items-center">
                  <div className="text-sm font-medium text-gray-700 pr-2">
                    {dept}
                  </div>
                </div>
                {areas.map((area, areaIndex) => {
                  const value = heatmapData[dept][area];
                  return (
                    <div
                      key={areaIndex}
                      className={`flex-1 h-12 flex items-center justify-center mx-0.5 rounded ${getHeatmapColor(
                        value
                      )} ${getTextColor(
                        value
                      )} transition-all duration-200 hover:scale-105 cursor-pointer h-14S`}
                      title={`${dept} - ${area}: ${value}`}
                    >
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
