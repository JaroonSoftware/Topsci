import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const PaymentFormModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="ข้อมูลการชำระเงิน"
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="amount"
          label="จำนวนเงิน"
          rules={[{ required: true, message: 'กรุณากรอกจำนวนเงิน' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="method"
          label="วิธีการชำระเงิน"
          rules={[{ required: true, message: 'กรุณากรอกวิธีการชำระเงิน' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentFormModal;