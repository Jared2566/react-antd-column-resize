import React from 'react';
import { Table } from 'antd';
import useAntdColumnResize from './useAntdColumnResize';

const TestConstraints: React.FC = () => {
  const { columns, components } = useAntdColumnResize(
    () => ({
      columns: [
        { 
          title: '姓名', 
          dataIndex: 'name', 
          key: 'name', 
          width: 100,
          // 测试最小宽度约束
          minWidth: 80,
          maxWidth: 200
        },
        { 
          title: '年龄', 
          dataIndex: 'age', 
          key: 'age', 
          width: 80,
          // 测试最小宽度约束
          minWidth: 60,
          maxWidth: 150
        },
        { 
          title: '地址', 
          dataIndex: 'address', 
          key: 'address', 
          width: 200,
          // 测试最大宽度约束
          minWidth: 150,
          maxWidth: 400
        },
        { 
          title: '电话', 
          dataIndex: 'phone', 
          key: 'phone', 
          width: 120,
          // 测试严格的宽度约束
          minWidth: 100,
          maxWidth: 180
        },
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
      <h2>宽度约束测试</h2>
      <p>测试minWidth和maxWidth约束是否正常工作</p>
      
      <h3>测试说明：</h3>
      <ul>
        <li><strong>姓名列：</strong>最小80px，最大200px</li>
        <li><strong>年龄列：</strong>最小60px，最大150px</li>
        <li><strong>地址列：</strong>最小150px，最大400px</li>
        <li><strong>电话列：</strong>最小100px，最大180px</li>
      </ul>

      <p><strong>测试步骤：</strong></p>
      <ol>
        <li>尝试将列宽拖拽到最小值以下，应该无法拖拽</li>
        <li>尝试将列宽拖拽到最大值以上，应该无法拖拽</li>
        <li>在允许的范围内拖拽，应该正常工作</li>
      </ol>

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

export default TestConstraints;
