import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// ลงทะเบียนฟอนต์ TH Sarabun
Font.register({
    family: 'THSarabunNew',
     src: '/font/THSarabunNew.ttf',
});

// สร้าง styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'THSarabunNew',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  info: {
    marginBottom: 20,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 20,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableCell: {
    border: '1px solid black',
    padding: 8,
    flex: 1,
    textAlign: 'center',
  },
  signature: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  signatureLine: {
    width: '30%',
    textAlign: 'center',
    borderTop: '1px solid black',
  },
});

// สร้างเอกสาร PDF
const BillPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.text}>สถานบันกวดวิชา Top Science Tutor</Text>
        <Text style={styles.text}>เลขที่ 17/242 แขวงแพรกษา เขตสมุทรปราการ, เมืองจ.สมุทรปราการ 20000 โทร: 089-749-2237</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.text}>ชื่อ-สกุล: ชัยธวัช พูลศิริ</Text>
          <Text style={styles.text}>รหัสนักเรียน: R-11</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>วิชาที่ลงทะเบียน: ประถมศึกษาปีที่ 6</Text>
          <Text style={styles.text}>วันที่: 29/11/67</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>รายละเอียดวิชา: คณิตศาสตร์</Text>
          <Text style={styles.text}>เวลา: 17.30-19.50</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>รายการ</Text>
          <Text style={styles.tableCell}>จำนวนเงิน</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>ค่าเรียนวิชาวิทยาศาสตร์ กลุ่ม อาจารย์ กันทิน</Text>
          <Text style={styles.tableCell}>1,200</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>ครั้งที่ 1</Text>
          <Text style={styles.tableCell}>ครั้งที่ 2</Text>
          <Text style={styles.tableCell}>ครั้งที่ 3</Text>
          <Text style={styles.tableCell}>ครั้งที่ 4</Text>
          <Text style={styles.tableCell}>ครั้งที่ 5</Text>
          <Text style={styles.tableCell}>ครั้งที่ 6</Text>
          <Text style={styles.tableCell}>ครั้งที่ 7</Text>
          <Text style={styles.tableCell}>ครั้งที่ 8</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>01/01/67</Text>
          <Text style={styles.tableCell}>22/01/67</Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
          <Text style={styles.tableCell}></Text>
        </View>
      </View>

      <View style={styles.signature}>
        <Text style={styles.signatureLine}>ลงชื่อผู้รับเงิน: ________</Text>
        <Text style={styles.signatureLine}>ตรวจสอบแล้ว: ________</Text>
      </View>
    </Page>
  </Document>
);

export default BillPDF;
