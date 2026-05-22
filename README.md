# react-antd-column-resize

一个用于 Ant Design Table 组件的可调整列宽 React Hook。

## 安装

```bash
npm install react-antd-column-resize
# 或
yarn add react-antd-column-resize
# 或
pnpm add react-antd-column-resize
```

## 使用方法

### 导入样式

**重要：** 必须导入样式文件才能显示拖拽把柄！

```tsx
// 方式一：在组件中导入
import "react-antd-column-resize/style";

// 方式二：在全局样式文件中导入
import "react-antd-column-resize/dist/react-antd-column-resize.css";
```

### 在 Next.js 中使用

由于这个库使用了 React hooks 和客户端功能，在 Next.js 13+ App Router 中需要在客户端组件中使用：

```tsx
"use client";
import React from "react";
import { Table } from "antd";
import { useAntdColumnResize } from "react-antd-column-resize";
import "react-antd-column-resize/style"; // 必须导入样式！

export default function MyTable() {
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
    {
      title: "地址",
      dataIndex: "address",
      key: "address",
      width: 200,
    },
  ];

  const dataSource = [
    {
      key: "1",
      name: "张三",
      age: 32,
      address: "北京市朝阳区",
    },
    {
      key: "2",
      name: "李四",
      age: 42,
      address: "上海市浦东新区",
    },
  ];

  const { columns: resizableColumns, components } = useAntdColumnResize(
    () => ({ columns }),
    []
  );

  return (
    <Table
      columns={resizableColumns}
      dataSource={dataSource}
      components={components}
    />
  );
}
```

### 在普通 React 项目中使用

```tsx
import React from "react";
import { Table } from "antd";
import { useAntdColumnResize } from "react-antd-column-resize";
import "react-antd-column-resize/style"; // 必须导入样式！

function MyTable() {
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 100,
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age",
      width: 80,
    },
  ];

  const { columns: resizableColumns, components } = useAntdColumnResize(
    () => ({ columns }),
    []
  );

  return (
    <Table
      columns={resizableColumns}
      dataSource={dataSource}
      components={components}
    />
  );
}
```

## API

### useAntdColumnResize

```tsx
const { columns, tableWidth, resetColumns, components } = useAntdColumnResize(
  fn: () => ResizableDataType<Column>,
  deps: unknown[]
);
```

#### 参数

- `fn`: 返回列配置的函数
- `deps`: 依赖数组，当依赖变化时重新计算

#### 返回值

- `columns`: 处理后的列配置
- `tableWidth`: 表格总宽度
- `resetColumns`: 重置列宽的函数
- `components`: Ant Design Table 的 components 配置

#### 配置选项

```tsx
const config = {
  columns: [], // 列配置
  minWidth: 60, // 最小列宽
  maxWidth: 2000, // 最大列宽
  enableHeaderResize: true, // 是否启用表头拖拽调整
  enableBodyResize: false, // 是否启用表体拖拽调整
  enableRealTimeResize: false, // 是否启用实时调整
  enableDragLine: false, // 是否显示拖拽线
};
```

## 注意事项

1. **样式导入**: 必须导入样式文件才能显示拖拽把柄
2. **Next.js 13+ App Router**: 必须在客户端组件中使用，在文件顶部添加 `"use client"` 指令
3. **列配置**: 确保每列都有唯一的 `dataIndex` 或 `key`
4. **宽度设置**: 建议为列设置初始 `width` 属性

## 故障排除

### 拖拽把柄不显示

如果拖拽把柄不显示，请检查：

1. **是否导入了样式文件**
   ```tsx
   import "react-antd-column-resize/style";
   ```

2. **列是否设置了 width 属性**
   ```tsx
   const columns = [
     {
       title: "姓名",
       dataIndex: "name",
       width: 100, // 必须设置 width
     }
   ];
   ```

3. **是否正确使用了 components**
   ```tsx
   <Table
     columns={resizableColumns}
     components={components} // 必须传递 components
   />
   ```

## 许可证

ISC
