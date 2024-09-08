/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useState} from 'react'; 
import CountUp from 'react-countup'; 
import { Divider, Card, List, Flex, Row, Space, Typography , Table, Typography } from 'antd';
import { 
    sampleListColumn, 
    sampleWaitingApproveColumn, 
    itemFileExpireColumn,
    statisticValue,
    sampleDetailColumn,
} from './model';

import { FiFileText } from "react-icons/fi";
import { LuFileClock } from "react-icons/lu";

import DashBoardService from '../../service/DashBoard.service';

const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

const pagging = { pagination: { current: 1, pageSize: 10, }, };
const dsbservice = DashBoardService();
function DashBoard() {


    const ListMenu = ()=>{ 
        return (
        <> 
            <List
            size="large"
            header={<div>ข้อมูลต่างๆ</div>}
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        </>
        )
    }

    return (
        <>
        <div className='layout-content px-3 sm:px-5 md:px-5'>
            <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative', paddingInline:"1.34rem" }} className='dashboard' id='dashboard' >
                
            </Space> 
        </div>
            <div className='drawer-dashboard'> 
                
            </div> 
        </>

    )
}

export default DashBoard

import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

const DynamicTable = () => {
  // สถานะของคอลัมน์และข้อมูลตาราง
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  // จำลองการคิวรีข้อมูล
  useEffect(() => {
    // ข้อมูลตัวอย่างจากคิวรี
    const queryData = [
      { id: 1, name: 'John', age: 28, sessions: 3 },
      { id: 2, name: 'Jane', age: 25, sessions: 2 },
    ];

    // สร้างคอลัมน์แบบไดนามิกขึ้นอยู่กับข้อมูลจากคิวรี
    const dynamicColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
    ];

    // เพิ่มคอลัมน์แบบไดนามิกตามจำนวน sessions
    queryData.forEach((item, index) => {
      for (let i = 1; i <= item.sessions; i++) {
        dynamicColumns.push({
          title: `Session ${i}`,
          dataIndex: `session${i}`,
          key: `session${i}`,
          render: () => `Session ${i} Data`, // กำหนดข้อมูลที่จะแสดงในแต่ละ session
        });
      }
    });

    // ตั้งค่าคอลัมน์และข้อมูลตาราง
    setColumns(dynamicColumns);

    // สร้างข้อมูลตารางโดยการเพิ่ม session แบบไดนามิกในแต่ละแถว
    const tableData = queryData.map((item, index) => {
      const rowData = {
        key: item.id,
        id: item.id,
        name: item.name,
        age: item.age,
      };

      // เพิ่มข้อมูล session ในแต่ละแถว
      for (let i = 1; i <= item.sessions; i++) {
        rowData[`session${i}`] = `Data for session ${i}`;
      }

      return rowData;
    });

    setData(tableData);
  }, []);

  return (
    <Table columns={columns} dataSource={data} />
  );
};

export default DynamicTable;