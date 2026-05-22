import React from 'react';
import { Table } from 'antd';
import useAntdColumnResize from './useAntdColumnResize';

const TestTextSelectionFix: React.FC = () => {
  const { columns, components } = useAntdColumnResize(
    () => ({
      columns: [
        { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
        { title: '年龄', dataIndex: 'age', key: 'age', width: 80 },
        { title: '地址', dataIndex: 'address', key: 'address', width: 200 },
        { title: '电话', dataIndex: 'phone', key: 'phone', width: 120 },
      ],
      enableHeaderResize: true,
      enableBodyResize: true,
      enableRealTimeResize: true,
      enableDragLine: true,
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
      <h2>文本选择修复测试</h2>
      <p>现在应该可以正常选中文本了，只有在拖拽时才禁用</p>
      
      <h3>测试步骤：</h3>
      <ol>
        <li><strong>正常文本选择测试：</strong>尝试选中表格中的文本，应该可以正常选中</li>
        <li><strong>拖拽测试：</strong>拖拽列宽调整手柄，拖拽过程中不应该选中文本</li>
        <li><strong>拖拽后测试：</strong>拖拽结束后，应该可以重新选中文本</li>
      </ol>

      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <p>这是一个测试区域，您可以尝试选中这里的文本：</p>
        <p>选中我，选中我，选中我！这段文本应该可以正常选中。</p>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        components={components}
        bordered
        pagination={false}
      />
    </div>
  );
};

export default TestTextSelectionFix;
