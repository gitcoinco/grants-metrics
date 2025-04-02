
import React from "react";
import { FilterDropdown } from "@/components/FilterDropdown";
// import Round from "@/lib/api";
import { Project } from "@/hooks/useGraphQLData";


interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onProgramChange: (type: string) => void;
  programs: Project[];
  selectedProgram: string;
}

export function DashboardHeader({
  title,
  subtitle,
  onProgramChange,
  programs,
  selectedProgram
}: DashboardHeaderProps) {


  const programOptions = [
    { label: "All programs", value: "all" },
    ...programs.map((program) => ({ label: program.metadata.name, value: program.id })),
  ];


  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-subtle mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-2 inline-block">
            Dashboard
          </span>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <FilterDropdown
            options={programOptions}
            value={selectedProgram}
            onChange={onProgramChange}
            placeholder="Select data type"
            className="w-full sm:w-48"
          />
          
          {/* <FilterDropdown
            options={roundOptions}
            value={period}
            onChange={onPeriodChange}
            placeholder="Select time period"
            className="w-full sm:w-48"
          /> */}
{/*           
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          >
            <Calendar className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}