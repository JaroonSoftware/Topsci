/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useMemo, useState} from 'react'; 
import CountUp from 'react-countup'; 
import { Divider, Card, List, Flex, Row, Space, Typography , Table } from 'antd';

import DashBoardService from '../../service/DashBoard.service';

const dataMenuDashBoard = [
  {
    title: 'รายงานแบบกลุ่ม',
    value: 1,
  },
  {
    title: 'รายงานแบบรายบุคคล',
    value: 2,
  },
];

const pagging = { pagination: { current: 1, pageSize: 10, }, };
const dsbservice = DashBoardService();
function DashBoard() {
    const [selectedMenu, setSelectedMenu] = useState(null);
    const hendelOpenMenu = (value)=>{ 
      console.log(value)
      setSelectedMenu(value);
    }
    const ListMenu = (
        <> 
            <List
            size="large"
            header={<div style={{ fontSize: '20px', fontWeight: 'bold' }}>ข้อมูลต่างๆ</div>}
            bordered
            dataSource={dataMenuDashBoard}
            renderItem={(item, index) => 
              <List.Item>
              <List.Item.Meta
                title={<a onClick={hendelOpenMenu(item.value)}>{item.title}</a>}
              />
            </List.Item>
            }
            />
        </>
        );

    return (
        <>
        <div className='layout-content px-3 sm:px-5 md:px-5'>

        </div>
            <div className='drawer-dashboard'> 
            {!selectedMenu && ListMenu} 
            {selectedMenu && (
              <div style={{ paddingTop: '20px' }}>
                {selectedMenu} {/* เปลี่ยนเป็น dataTable ที่คุณต้องการ */}
              </div>
            )}
            </div> 
        </>

    )
}

export default DashBoard

