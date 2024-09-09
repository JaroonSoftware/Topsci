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

    const hendelOpenMenu = (menu)=>{ 
      console.log(menu)
    }
    const ListMenu = ()=>{ 
        return (
        <> 
            <List
            size="large"
            header={<div>ข้อมูลต่างๆ</div>}
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
        )
    }

    return (
        <>
        <div className='layout-content px-3 sm:px-5 md:px-5'>
            <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative', paddingInline:"1.34rem" }} className='dashboard' id='dashboard' >
              <List
                size="large"
                header={<div>ข้อมูลต่างๆ</div>}
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
            </Space> 
        </div>
            <div className='drawer-dashboard'> 
            {ListMenu}
            </div> 
        </>

    )
}

export default DashBoard

