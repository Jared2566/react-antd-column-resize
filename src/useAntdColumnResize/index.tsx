import React, { useCallback, useMemo } from 'react';
import type { DependencyList } from 'react';

import useColumns from '../hooks/useColumns';
import { Column, ResizableComponentProps, ResizableDataType } from '../types';
import ResizableComponent from './resizableComponent';

const useAntdColumnResize = (
  fn: () => ResizableDataType<Column>,
  deps: DependencyList,
) => {
  // deps 由调用方动态传入，无法被 react-hooks/exhaustive-deps 静态分析，禁用规则
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const props = useMemo<ResizableDataType<Column>>(() => fn() ?? { columns: [] }, deps);

  const { columns, tableWidth, resetColumns } = useColumns(props);
  const {
    enableHeaderResize = true,
    enableBodyResize = false,
    enableRealTimeResize = false,
    enableDragLine = false,
  } = props;

  const ResizableTitle = useCallback(
    (titleProps: ResizableComponentProps) => (
      <ResizableComponent
        {...titleProps}
        componentType="th"
        enableRealTimeResize={enableRealTimeResize}
        enableDragLine={enableDragLine}
      />
    ),
    [enableRealTimeResize, enableDragLine],
  );

  const ResizableCell = useCallback(
    (cellProps: ResizableComponentProps) => (
      <ResizableComponent
        {...cellProps}
        componentType="td"
        enableRealTimeResize={enableRealTimeResize}
        enableDragLine={enableDragLine}
      />
    ),
    [enableRealTimeResize, enableDragLine],
  );

  const components = useMemo(
    () => ({
      header: {
        cell: enableHeaderResize ? ResizableTitle : undefined,
      },
      body: {
        cell: enableBodyResize ? ResizableCell : undefined,
      },
    }),
    [enableHeaderResize, enableBodyResize, ResizableTitle, ResizableCell],
  );

  return {
    columns,
    tableWidth,
    resetColumns,
    components,
  };
};

export default useAntdColumnResize;
