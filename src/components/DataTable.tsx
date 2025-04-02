import React from "react";
import { ChevronLeft, ChevronRight, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TableColumn {
  key: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  title?: string;
  columns: TableColumn[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading?: boolean;
  totalCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export function DataTable({
  title,
  columns,
  data,
  isLoading = false,
  totalCount = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  onSearch,
  className,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className={cn("bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-subtle overflow-hidden animate-fade-in", className)}>
      {/* Table Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <form className="relative w-full sm:w-64" onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 input-focus"
            />
          </form>
          <Button variant="outline" size="icon" className="h-10 w-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-10 w-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="px-6 py-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500">
            Showing {Math.min((page - 1) * pageSize + 1, totalCount)} to{" "}
            {Math.min(page * pageSize, totalCount)} of {totalCount} entries
          </p>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page === 1}
              className="h-8 w-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = page;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  onClick={() => onPageChange?.(pageNum)}
                  className={cn(
                    "h-8 w-8",
                    page !== pageNum && "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page === totalPages}
              className="h-8 w-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}