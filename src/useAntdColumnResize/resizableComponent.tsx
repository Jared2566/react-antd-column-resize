import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Resizable } from 'react-resizable';
import type { ResizeCallbackData } from 'react-resizable';

import { ResizableComponentProps, ResizeHandleAxis } from '../types';

const HANDLE_CONSTRAINT_HEIGHT = 50;

/** 拖拽手柄 */
const MyHandle = forwardRef<HTMLDivElement, { handleAxis?: ResizeHandleAxis }>(
  (props, ref) => {
    const { handleAxis, ...restProps } = props;
    return (
      <div
        ref={ref}
        className={`resize-handle handle-${handleAxis}`}
        {...restProps}
      />
    );
  },
);
MyHandle.displayName = 'MyHandle';

/** 控制拖拽过程中 body 文本选择和光标样式 */
const toggleTextSelection = (disable: boolean) => {
  try {
    const bodyStyle = document.body?.style;
    const htmlStyle = document.documentElement?.style;
    if (!bodyStyle || !htmlStyle) return;

    bodyStyle.userSelect = disable ? 'none' : '';
    bodyStyle.pointerEvents = disable ? 'none' : '';
    htmlStyle.cursor = disable ? 'col-resize' : '';
  } catch (error) {
    // SSR 或受限环境下静默忽略
    console.error('ResizableComponent toggleTextSelection error', error);
  }
};

/**
 * 找到 antd Table 真正能反映整体高度的容器：
 *   优先级：.ant-table-container > .ant-table > <table>
 * 因为开启固定列 / 固定头时，表头与表体会被拆成多个 <table>，
 * 直接用 closest('table') 只能拿到表头那张高度很小的表。
 */
const findTableContainer = (el: Element | null): Element | null => {
  if (!el) return null;
  return (
    el.closest('.ant-table-container') ||
    el.closest('.ant-table') ||
    el.closest('table')
  );
};

const ResizableComponent: React.FC<ResizableComponentProps> = (props) => {
  const {
    width,
    minWidth,
    maxWidth,
    cellKey,
    onResizeCallback,
    componentType,
    children,
    enableRealTimeResize = false,
    enableDragLine = false,
    ...restProps
  } = props;

  const [interWidth, setInterWidth] = useState<number>(width);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeLinePosition, setResizeLinePosition] = useState<number | null>(null);
  const [resizeLineHeight, setResizeLineHeight] = useState(0);
  const [resizeLineTop, setResizeLineTop] = useState(0);

  const thRef = useRef<HTMLElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rafRef = useRef<number | null>(null);

  const Component = componentType;

  // 同步外部 width 变化到内部状态（仅在非拖拽期间）
  useEffect(() => {
    if (!isResizing && width !== interWidth) {
      setInterWidth(width);
    }
  }, [width, isResizing, interWidth]);

  /** 重新计算拖拽线位置高度，写入 state */
  const calculateTableHeight = useCallback(() => {
    const tableElement = findTableContainer(thRef.current);
    if (!tableElement) return;
    const rect = tableElement.getBoundingClientRect();
    setResizeLineHeight(rect.height);
    setResizeLineTop(rect.top);
  }, []);

  /** 用 rAF 节流地调用 calculateTableHeight */
  const scheduleRecalc = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      calculateTableHeight();
    });
  }, [calculateTableHeight]);

  // 拖拽期间监听表格尺寸 / 视口变化，保持拖拽线高度同步
  useEffect(() => {
    if (!isResizing || !enableDragLine) {
      // 关闭时确保 observer 已清理
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      return;
    }

    const tableElement = findTableContainer(thRef.current);
    if (!tableElement) return;

    // 进入拖拽时立即同步一次
    calculateTableHeight();

    const RO: typeof ResizeObserver | undefined = (window as any).ResizeObserver;
    if (RO) {
      const observer = new RO(scheduleRecalc);
      observer.observe(tableElement);
      // 固定头模式下表头表体是两张 table，单独再监听一遍
      tableElement.querySelectorAll('table').forEach((t) => observer.observe(t));
      resizeObserverRef.current = observer;
    }

    // .resize-line 用 fixed 定位，是相对视口的；
    // 拖拽期间页面滚动 / 窗口尺寸变化时需要同步 top。
    const onViewportChange = () => calculateTableHeight();
    window.addEventListener('scroll', onViewportChange, true);
    window.addEventListener('resize', onViewportChange);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener('scroll', onViewportChange, true);
      window.removeEventListener('resize', onViewportChange);
    };
  }, [isResizing, enableDragLine, calculateTableHeight, scheduleRecalc]);

  const onResizeStart = useCallback(
    (_: unknown, data: ResizeCallbackData) => {
      setIsResizing(true);
      setInterWidth(data.size?.width);
      toggleTextSelection(true);

      if (enableDragLine && thRef.current) {
        const rect = thRef.current.getBoundingClientRect();
        setResizeLinePosition(rect.right);
        // 立即同步一次表格高度，避免首帧 height=0 闪烁
        const tableElement = findTableContainer(thRef.current);
        if (tableElement) {
          const tableRect = tableElement.getBoundingClientRect();
          setResizeLineHeight(tableRect.height);
          setResizeLineTop(tableRect.top);
        }
      }
    },
    [enableDragLine],
  );

  const onResize = useCallback(
    (_: unknown, data: ResizeCallbackData) => {
      const newWidth = data.size?.width;
      setInterWidth(newWidth);

      if (enableRealTimeResize) {
        onResizeCallback(cellKey, newWidth);
      }

      if (!enableDragLine) return;

      // 更新拖拽线 left
      if (thRef.current) {
        const rect = thRef.current.getBoundingClientRect();
        const widthDiff = newWidth - rect.width;
        setResizeLinePosition(rect.right + widthDiff);
      }

      // 实时模式下列宽真实变化可能让单元格内容换行，从而把表格撑高 / 变矮。
      // ResizeObserver 回调存在一帧延迟，这里在每次 onResize 后用 rAF 推到下一帧
      // 主动重算，保证拖拽线高度紧跟表格真实高度。
      if (enableRealTimeResize) {
        scheduleRecalc();
      }
    },
    [
      enableRealTimeResize,
      enableDragLine,
      onResizeCallback,
      cellKey,
      scheduleRecalc,
    ],
  );

  const onResizeStop = useCallback(() => {
    setIsResizing(false);
    toggleTextSelection(false);

    if (!enableRealTimeResize) {
      onResizeCallback(cellKey, interWidth);
    }

    if (enableDragLine) {
      setResizeLinePosition(null);
    }
  }, [enableRealTimeResize, enableDragLine, onResizeCallback, cellKey, interWidth]);

  // 没有 width 时退化成普通 cell；这里所有 hooks 已声明完毕，符合 Rules of Hooks
  if (!width) {
    return <Component {...restProps} />;
  }

  const showResizeLine =
    enableDragLine &&
    isResizing &&
    resizeLinePosition !== null &&
    resizeLineHeight > 0;

  return (
    <Component {...restProps} ref={thRef as React.Ref<HTMLTableCellElement>}>
      {showResizeLine && (
        <div
          className="resize-line"
          style={{
            left: `${resizeLinePosition}px`,
            top: `${resizeLineTop}px`,
            height: `${resizeLineHeight}px`,
          }}
        />
      )}
      <Resizable
        className="resize-box"
        width={interWidth}
        height={0}
        onResize={onResize}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
        handle={<MyHandle ref={handleRef} />}
        draggableOpts={{ enableUserSelectHack: false }}
        minConstraints={[minWidth, HANDLE_CONSTRAINT_HEIGHT]}
        maxConstraints={[maxWidth, HANDLE_CONSTRAINT_HEIGHT]}
      >
        <div
          style={{
            width: isResizing ? interWidth : '100%',
            height: '100%',
          }}
        />
      </Resizable>
      <div>{children}</div>
    </Component>
  );
};

export default memo(ResizableComponent);
