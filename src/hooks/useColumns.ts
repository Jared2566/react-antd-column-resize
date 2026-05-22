import { useCallback, useMemo, useRef, useState } from 'react';

import { Column, ResizableDataType } from '../types';

export const INTERNAL_KEY = 'dataIndex';

const useColumns = ({
  columns,
  minWidth = 60,
  maxWidth = 2000,
}: ResizableDataType<Column>) => {
  const [columnWidths, setColumnWidths] = useState<Record<string | number, number>>({});

  // 用 WeakMap 缓存列对象 -> key 的映射：
  // 1. 不会阻止旧列对象被 GC 回收
  // 2. 不需要在 reset 时手动清理
  const columnKeyCache = useRef<WeakMap<Column, string | number>>(new WeakMap());

  const getColumnKey = useCallback((column: Column): string | number | undefined => {
    const cache = columnKeyCache.current;
    if (cache.has(column)) {
      return cache.get(column);
    }

    const internalKey = column[INTERNAL_KEY];
    const key = internalKey !== undefined ? String(internalKey) : column.key;

    if (key !== undefined) {
      cache.set(column, key);
    }

    return key;
  }, []);

  const calculateColumnWidth = useCallback(
    (column: Column): number => {
      if (!column) return 0;

      if (Array.isArray(column.children) && column.children.length > 0) {
        return column.children.reduce(
          (sum: number, child: Column) => sum + calculateColumnWidth(child),
          0,
        );
      }

      const columnKey = getColumnKey(column);

      if (columnKey !== undefined && columnKey in columnWidths) {
        return columnWidths[columnKey];
      }

      return Number(column.width ?? minWidth);
    },
    [columnWidths, minWidth, getColumnKey],
  );

  const handleColumnResize = useCallback((columnKey: string | number, newWidth: number) => {
    setColumnWidths((prev) => {
      if (prev[columnKey] === newWidth) return prev;
      return { ...prev, [columnKey]: newWidth };
    });
  }, []);

  const addResizableColumn = useCallback(
    (column: Column): Column => {
      if (!column || typeof column !== 'object') {
        return column;
      }

      const columnKey = getColumnKey(column);
      const currentWidth =
        columnKey !== undefined && columnKey in columnWidths
          ? columnWidths[columnKey]
          : Number(column.width ?? minWidth);

      const hasChildren = Array.isArray(column.children) && column.children.length > 0;

      const processedColumn: Column = {
        ...column,
        minWidth,
        maxWidth,
        ...('width' in column ? { width: currentWidth } : {}),
      };

      if (hasChildren) {
        processedColumn.children = column.children!.map((child: Column) =>
          addResizableColumn(child),
        );
        return processedColumn;
      }

      const cellConfig = {
        minWidth,
        maxWidth,
        width: currentWidth,
        cellKey: columnKey,
        onResizeCallback: handleColumnResize,
      };

      processedColumn.onHeaderCell = () => cellConfig;
      processedColumn.onCell = () => cellConfig;

      return processedColumn;
    },
    [columnWidths, minWidth, maxWidth, handleColumnResize, getColumnKey],
  );

  const processedColumns = useMemo(
    () => columns.map((column: Column) => addResizableColumn(column)),
    [columns, addResizableColumn],
  );

  // tableWidth 直接基于 processedColumns 计算，避免依赖 ref 中转导致的时序问题
  const tableWidth = useMemo(
    () => processedColumns.reduce((sum, column) => sum + calculateColumnWidth(column), 0),
    [processedColumns, calculateColumnWidth],
  );

  const resetColumns = useCallback(() => {
    setColumnWidths({});
  }, []);

  return {
    columns: processedColumns,
    tableWidth,
    resetColumns,
  };
};

export default useColumns;
