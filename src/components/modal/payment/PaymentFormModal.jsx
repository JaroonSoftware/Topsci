/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { Modal, Card, Table, message, Form, Spin } from "antd";
import { Row, Col, Space } from "antd";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons"

import { columns } from "./modal-payment.model"; 
import OptionService from "../../../service/Options.service"

const opnService = OptionService();
export default function PaymentFormModal({show, close, values, student_code, couses_id}) {
    const [form] = Form.useForm();
    /** handle state */
    const [itemsData, setItemsData] = useState([]);
    const [listData, setListData] = useState([]);
    
    const [loading,  setLoading] = useState();
    /** handle logic component */
    const handleClose = () =>{ 
        close(false);
    }


    /** Config Conponent */

    /** End Config Component */

    /** setting initial component */ 
    const column = columns( {} );

    useEffect( () => {
        const onload = () =>{
            setLoading(true);
            console.log(student_code+'---'+couses_id)
            opnService.ListPatment({ student: student_code, couses: couses_id }).then((res) => { 
                let { status, data } = res;
                if (status === 200) {
                    setItemsData(data.data);
                    setListData(data.data);
                }
            })
            .catch((err) => { 
                message.error("Request error!");
            })
            .finally( () => setTimeout( () => { setLoading(false) }, 400));
        }

        if( !!show ){
            onload();        
        } 
    }, [show]);

    /** setting child component */
    const ButtonModal = (
        <Space direction="horizontal" size="middle" >
            <Button onClick={() => handleClose() }>ปิด</Button>
        </Space>
    )
    /** */
    return (
        <>
        <Modal
            open={show}
            title="เลือกนักเรียน"
            onCancel={() => handleClose() } 
            footer={ButtonModal}
            maskClosable={false}
            style={{ top: 20 }}
            width={800}
            className='sample-request-modal-items'
        >
            <Spin  >
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Form.Item label="ค้นหา"  >
                                        <Input suffix={<SearchOutlined />} placeholder='ค้นหาชื่อ-นามสกุล หรือ ชั้นเรียน หรือ โรงเรียน'/>
                                    </Form.Item>                        
                                </Col> 
                            </Row> 
                        </Form>
                    </Card>
                        <Table  
                            bordered
                            dataSource={listData}
                            columns={column} 
                            pagination={{ 
                                total:listData.length, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${itemsData.length} items`,
                                defaultPageSize:10,
                                pageSizeOptions:[10,25,35,50,100]
                            }}
                            scroll={{ x: 'max-content' }} size='small'
                        /> 
                </Space>                
            </Spin> 
        </Modal>    
        </>
    )
}