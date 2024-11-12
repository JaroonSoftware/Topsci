/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { Modal, Card, Table, message, Form, Spin } from "antd";
import { Row, Col, Space } from "antd";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons"

import { columns } from "./modal-teacher.model"; 
import OptionService from "../../../service/Options.service"

const opnService = OptionService();
export default function ModalItems({show, close, values, selected}) {
    const [form] = Form.useForm();
    /** handle state */
    const [itemsData, setItemsData] = useState([]);
    const [itemsDataWrap, setItemsDataWrap] = useState([]);
    
    const [itemsList, setItemsList] = useState(selected || []);
    const [itemsRowKeySelect, setItemsRowKeySelect] = useState([]);
    const [loading,  setLoading] = useState(true);
    /** handle logic component */
    const handleClose = () =>{ 
        close(false);
    }
 
    const handleSearch = (value) => {
        if(!!value){    
            const f = itemsData.filter( d => ( (d.teacher_name?.includes(value)) ) );
             
            setItemsDataWrap(f);            
        } else { 
            setItemsDataWrap(itemsData);            
        }

    }

    const handleSelectItems = (record) => {
        const newData = {
            ...record
        };
         //console.log(newData);

        setItemsList([...itemsList, newData]);
    };

    const handleCheckDuplicate = (Id) => !!selected.find( (item) =>  item?.teacher_id === Id ) ; 

    const handleConfirm = () => { 
        
        const choosed = selected.map( m => m.teacher_id );
        const itemsChoose = (itemsData.filter( f => itemsRowKeySelect.includes(f.teacher_id) && !choosed.includes(f.teacher_id) )).map( (m, i) => (
        {
            teacher_id:m.teacher_id,
            teacher_name:m.teacher_name,
        }));
        if (itemsChoose.length < 1){  
            message.error( "กรุณาเพิ่ม รายชื่อครู"); 
            return;
        }

        values([...selected, ...itemsChoose]);
        
        setItemsList([]);
        close(false);
    }

    /** Config Conponent */

    const itemSelection = {
        selectedRowKeys : itemsRowKeySelect,
        type: "checkbox",
        fixed: true,
        hideSelectAll:true,
        onChange: (selectedRowKeys, selectedRows) => { 
        },
        getCheckboxProps: (record) => { 
            return {
                disabled: handleCheckDuplicate(record.teacher_id), 
                name: record.teacher_id,
            }
        },
        onSelect: (record, selected, selectedRows, nativeEvent) => {
            //console.log(record, selected, selectedRows, nativeEvent);
            if( selected ){
                setItemsRowKeySelect([...new Set([...itemsRowKeySelect, record.teacher_id])]);
            } else {
                const ind = itemsRowKeySelect.findIndex( d => d === record.teacher_id);
                const tval = [...itemsRowKeySelect];
                tval.splice(ind, 1);
                setItemsRowKeySelect([...tval]);
                //console.log(ind, itemsRowKeySelect);
            }
        }
    };

    /** End Config Component */

    /** setting initial component */ 
    const column = columns( { handleSelectItems, handleCheckDuplicate } );

    useEffect( () => {
        const onload = () =>{
            setLoading(true);
            opnService.optionsTeacher().then((res) => {
                let { status, data } = res;
                if (status === 200) {
                    setItemsData(data.data);
                    setItemsDataWrap(data.data);

                    const keySeleted = selected.map( m => m.teacher_id );
                    
                    setItemsRowKeySelect([...keySeleted]);

                }
            })
            .catch((err) => { 
                message.error("Request error!");
            })
            .finally( () => setTimeout( () => { setLoading(false) }, 400));
        }

        if( !!show ){
            onload();
            // console.log("modal-select-items");          
        } 
    }, [selected,show]);

    /** setting child component */
    const ButtonModal = (
        <Space direction="horizontal" size="middle" >
            
            <Button onClick={() => handleClose() }>ปิด</Button>
            <Button type='primary' onClick={() => handleConfirm() }>ยืนยันการเลือกครู</Button>
        </Space>
    )
    /** */
    return (
        <>
        <Modal
            open={show}
            title="เลือกครู"
            onCancel={() => handleClose() } 
            footer={ButtonModal}
            maskClosable={false}
            style={{ top: 20 }}
            width={800}
            className='sample-request-modal-items'
        >
            <Spin spinning={loading} >
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                            <Row gutter={[{xs:32, sm:32, md:32, lg:12, xl:12}, 8]} className='m-0'>
                                <Col span={24}>
                                    <Form.Item label="ค้นหา"  >
                                        <Input suffix={<SearchOutlined />} onChange={ (e) => { handleSearch(e.target.value) } } placeholder='ค้นหาชื่อ-นามสกุล ครู'/>
                                    </Form.Item>                        
                                </Col> 
                            </Row> 
                        </Form>
                    </Card>
                    <Card>
                        <Table  
                            bordered
                            dataSource={itemsDataWrap}
                            columns={column} 
                            rowSelection={itemSelection}
                            rowKey="teacher_id"
                            pagination={{ 
                                total:itemsDataWrap.length, 
                                showTotal:(_, range) => `${range[0]}-${range[1]} of ${itemsData.length} items`,
                                defaultPageSize:10,
                                pageSizeOptions:[10,25,35,50,100]
                            }}
                            scroll={{ x: 'max-content' }} size='small'
                        /> 
                    </Card>
                </Space>                
            </Spin> 
        </Modal>    
        </>
    )
}