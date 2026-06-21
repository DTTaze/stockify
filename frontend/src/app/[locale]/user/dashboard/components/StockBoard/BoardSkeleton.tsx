import React from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import { TableCell, TableRow } from "@/components/ui/Table";

interface BoardSkeletonProps {
  rowsCount: number;
}

const SKELETON_ROWS = Array.from({ length: 12 }, (_, i) => `row-${i}`);
const SKELETON_CELLS = Array.from({ length: 15 }, (_, i) => `cell-${i}`);

export function BoardSkeleton({ rowsCount }: BoardSkeletonProps) {
  const activeRows = SKELETON_ROWS.slice(0, rowsCount);

  return (
    <>
      {activeRows.map((rowKey) => (
        <TableRow key={rowKey} className="bg-gray-55/20 dark:bg-slate-950/20">
          <TableCell className="border-r border-gray-200 p-2 dark:border-slate-900">
            <Skeleton className="mx-auto h-3 w-3" />
          </TableCell>
          <TableCell className="border-r border-gray-200 p-2 dark:border-slate-900">
            <Skeleton className="h-3 w-10" />
          </TableCell>
          <TableCell className="border-r border-gray-200 p-2 dark:border-slate-900">
            <Skeleton className="ml-auto h-3 w-8" />
          </TableCell>
          <TableCell className="border-r border-gray-200 p-2 dark:border-slate-900">
            <Skeleton className="ml-auto h-3 w-8" />
          </TableCell>
          <TableCell className="border-r border-gray-200 p-2 dark:border-slate-900">
            <Skeleton className="ml-auto h-3 w-8" />
          </TableCell>
          {SKELETON_CELLS.map((cellKey) => (
            <TableCell
              key={cellKey}
              className="border-r border-gray-200 p-1 dark:border-slate-900"
            >
              <Skeleton className="ml-auto h-3 w-6" />
            </TableCell>
          ))}
          <TableCell className="border-r border-gray-200 p-2 dark:border-slate-900">
            <Skeleton className="ml-auto h-3 w-12" />
          </TableCell>
          <TableCell className="border-r border-gray-200 p-2 dark:border-slate-900">
            <Skeleton className="ml-auto h-3 w-8" />
          </TableCell>
          <TableCell className="p-2">
            <Skeleton className="ml-auto h-3 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
