import React from 'react';
import { Table } from 'antd';
import useAntdColumnResize from './useAntdColumnResize';

const ExampleComponent: React.FC = () => {
  // 同时启用header和body拖拽（实时模式）- 精确控制文本选择
  const { columns: bothColumns, components: bothComponents } = useAntdColumnResize(
    () => ({
      columns: [
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '年龄', dataIndex: 'age', key: 'age', width: 80 },
        { title: '地址', dataIndex: 'address', key: 'address', width: 200 },
        { title: '电话', dataIndex: 'phone', key: 'phone', width: 120 },
      ],
      enableHeaderResize: true,
      enableBodyResize: true,
      enableRealTimeResize: true, // 实时模式确保同步
      enableDragLine: true, // 启用拖拽线功能
    }),
    [],
  );

  // 性能模式拖拽（默认）- 只在拖拽结束时更新
  const { columns: performanceColumns, components: performanceComponents } = useAntdColumnResize(
    () => ({
      columns: [
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '年龄', dataIndex: 'age', key: 'age', width: 80 },
        { title: '地址', dataIndex: 'address', key: 'address', width: 200 },
        { title: '电话', dataIndex: 'phone', key: 'phone', width: 120 },
      ],
      enableHeaderResize: true,
      enableBodyResize: true,
      enableRealTimeResize: false, // 性能模式
      enableDragLine: true, // 启用拖拽线功能
    }),
    [],
  );

  const dataSource = [
    { key: '1', name: '张三', age: 32, address: '北京市朝阳区', phone: '13800138000' },
    { key: '2', name: '李四', age: 42, address: '上海市浦东新区', phone: '13900139000' },
    { key: '3', name: '王五', age: 28, address: '广州市天河区', phone: '13700137000' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>列宽拖拽功能演示</h2>
      <p>精确控制文本选择：只有在拖拽进行时才禁用文本选择</p>
      
      <h3>实时拖拽模式 - Header和Body同步</h3>
      <p>拖拽过程中实时更新，header和body列宽保持同步</p>
      <p><strong>测试说明：</strong></p>
      <ul>
        <li>正常状态下可以选中文本</li>
        <li>只有在拖拽列宽调整手柄时才禁用文本选择</li>
        <li>拖拽结束后立即恢复文本选择功能</li>
      </ul>
      <Table
        columns={bothColumns}
        dataSource={dataSource}
        components={bothComponents}
        bordered
        pagination={false}
        style={{ marginBottom: '40px' }}
      />

      <h3>性能模式 - Header和Body同步</h3>
      <p>拖拽结束时更新，header和body列宽保持同步</p>
      <Table
        columns={performanceColumns}
        dataSource={dataSource}
        components={performanceComponents}
        bordered
        pagination={false}
      />
    </div>
  );
};

export default ExampleComponent;
