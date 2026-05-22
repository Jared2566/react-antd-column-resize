import { ComponentType, ThHTMLAttributes } from 'react';

export type DataIndex = string | number | readonly (string | number)[];

export interface Column {
  key?: string | number;
  width?: string | number;
  dataIndex?: DataIndex;
  children?: Column[];
  title?: React.ReactNode;
  onHeaderCell?: (
    column?: Column,
  ) => Partial<ResizableComponentProps & { style?: React.CSSProperties; className?: string }>;
  onCell?: (
    column?: Column,
  ) => Partial<ResizableComponentProps & { style?: React.CSSProperties; className?: string }>;
  [key: string]: unknown;
}

export type ResizableDataType<T extends Column> = {
  columns: T[];
  minWidth?: number;
  maxWidth?: number;
  enableHeaderResize?: boolean;
  enableBodyResize?: boolean;
  enableRealTimeResize?: boolean;
  enableDragLine?: boolean;
};

export interface ResizableColumnProps<T extends Column> {
  setup: () => ResizableDataType<T>;
  dependencies: unknown[];
}

export interface ResizableComponentProps extends ThHTMLAttributes<HTMLElement> {
  width: number;
  minWidth: number;
  maxWidth: number;
  cellKey: string | number;
  componentType: 'th' | 'td';
  children?: React.ReactNode;
  onResizeCallback: (cellKey: string | number, width: number) => void;
  enableRealTimeResize?: boolean;
  enableDragLine?: boolean;
}

export interface UseAntdColumnResizeReturn {
  resizableColumns: Column[];
  tableWidth: number;
  resetColumns: () => void;
  components: {
    header: {
      cell: ComponentType<ResizableComponentProps> | undefined;
    };
    body: {
      cell: ComponentType<ResizableComponentProps> | undefined;
    };
  };
}

export type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

export const INTERNAL_KEY = 'dataIndex' as const;
