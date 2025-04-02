import React from 'react';
import { TableItem } from '@/hooks/useGraphQLData';
import { Table, TableCaption, TableRow, TableHead, TableHeader, TableCell, TableBody } from './ui/table';
import { cn } from '@/lib/utils';


interface SimpleTableProps {
    // data: TableItem[];
    headers: string[];
    rows: Record<string, any>[] | undefined;
    caption: string;
    className?: string;

    delay?: number;

}

export function SimpleTable({ headers, rows, caption, className, delay = 0 }: SimpleTableProps) {

    const animationClass = delay ? `animate-[fade-in_0.4s_ease-out_${delay}s_both]` : "animate-fade-in";


    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-subtle overflow-hidden relative card-hover",
                animationClass,
                className
            )}
        >
            <Table>
                <TableCaption>{caption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        {headers.map((header, index) => (
                            <TableHead key={index}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows?.map((row, index) => (
                        <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                            {headers.map((header, index) => {
                                return <TableCell key={index}>{row[header.replace(/\s/g, "")]}</TableCell>
                            })}
                        </TableRow>
                    ))}


                </TableBody>
            </Table>
        </div>
    );
}