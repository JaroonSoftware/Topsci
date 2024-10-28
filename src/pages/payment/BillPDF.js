import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
// ลงทะเบียนฟอนต์ TH Sarabun
Font.register({
    family: 'THSarabunNew',
     src: '/font/THSarabunNew.ttf',
});
// สร้าง styles
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  page: {
    padding: 15,
    fontFamily: 'THSarabunNew',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',  
  },
  headerText1:{
    textAlign: 'center',
    fontSize:23,
    fontWeight: 'bold',  
  },
  headerText2: {
    textAlign: 'center',
    borderBottomWidth: 2, 
    borderColor: 'black', 
    paddingBottom: 2,
  },
  info: {
    marginBottom: 10,
  },
  info2: {
    marginTop: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 5,
  },
  tableList: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    borderCollapse: 'collapse',
    marginBottom: 5,
  },
  tableRow1: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black', 
  },
  tableRow2: {
    flexDirection: 'row',
  },
  tableCell1: {
    width: '80%',
    padding: 2,
    textAlign: 'center',
    justifyContent: 'center', 
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: 'black', 
  },
  tableCell2: {
    width: '20%',
    padding: 2,
    textAlign: 'center',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  tableCell12: {
    width: '80%',
    padding: 2,
    textAlign: 'left',
    justifyContent: 'center', 
    alignItems: 'left',
    borderRightWidth: 1,
    borderColor: 'black', 
  },
  tableCell22: {
    width: '20%',
    padding: 2,
    textAlign: 'right',
    justifyContent: 'center', 
    alignItems: 'right',
  },
  cell: {
    width: '12.5%', 
    border: '1px solid #000',
    padding: 1,
    textAlign: 'center',
    justifyContent: 'center', 
    alignItems: 'center',
    marginHorizontal: 3,
    fontSize: 14,
    minHeight: 20, 
  },
  tableRemark: {
    width: '100%',
    marginTop: 10,
    marginBottom: 5,
  },
  tableRemarkRow: {
    flexDirection: 'row',
  },
  tableRemarkCell1: {
    width: '55%',
    padding: 2,
    textAlign: 'left',
    justifyContent: 'center', 
    alignItems: 'left',
  },
  tableRemarkCell2: {
    width: '45%',
    padding: 2,
    textAlign: 'left',
    justifyContent: 'center', 
    alignItems: 'left',
  },
  divider: {
    borderBottomWidth: 3,
    borderBottomColor: '#000',
    marginVertical: 10
  },
});
const attendanceData = [
  { title: 'ครั้งที่ 1:', date: '' },
  { title: 'ครั้งที่ 2:', date: '' },
  { title: 'ครั้งที่ 3:', date: '' },
  { title: 'ครั้งที่ 4:', date: '' },
  { title: 'ครั้งที่ 5:', date: '' },
  { title: 'ครั้งที่ 6:', date: '' },
  { title: 'ครั้งที่ 7:', date: '' },
  { title: 'ครั้งที่ 8:', date: '' },
  { title: 'ครั้งที่ 9:', date: '' },
  { title: 'ครั้งที่ 10:', date: '' },
  { title: 'ครั้งที่ 11:', date: '' },
  { title: 'ครั้งที่ 12:', date: '' },
];
// สร้างเอกสาร PDF
const BillPDF = ({ data }) => {
  dayjs.extend(buddhistEra);
  dayjs.locale('th');
  const formatDate = (date) => {
    if (!!date) {
      return dayjs(date).format('DD-MMM-BB');
    } else {
      return '';
    }
  };
  const formatDate2 = (date) => {
    if (!!date) {
      return dayjs(date).format('DD MMMM BBBB');
    } else {
      return '';
    }
  };
  const currentDate = new Date();
  const dataCourse = data.find((item, index) => index === 0);
  //Update 
  const updatedAttendanceData = attendanceData.map((item, index) => {
    const session = data.find(s => s.attendance_no === index + 1);
    return {
      ...item,
      date: session ? session.session_date : item.date,
    };
  });
  const repeatSection = (key) => (
    <View key={key}>
      <View style={styles.header}>
        <Text style={styles.headerText1}>สถานบันกวดวิชา Top Science Tutor</Text>
        <Text style={styles.headerText2}>เลขที่ 17/242 แขวงแพรกษา เขตสมุทรปราการ, เมืองจ.สมุทรปราการ 20000 โทร: 089-749-2237</Text>
      </View>

      <View style={styles.info}>
        <View style={styles.row}>
          <Text style={styles.text}>ชื่อ-สกุล: {dataCourse.student_name}</Text>
          <Text style={styles.text}>ชื่อเล่น: {dataCourse.nickname}</Text>
          <Text style={styles.text}>วันที่: {formatDate(currentDate)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>วิชา {dataCourse.subject_name} อาจารย์ {dataCourse.teachers}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.text}>ชื่อกลุ่มที่สมัครเรียน: {dataCourse.course_name} เวลา {dataCourse.course_time}</Text>
        </View>
      </View>

      <View style={styles.tableList}>
        <View style={styles.tableRow1}>
          <Text style={styles.tableCell1}>รายการ</Text>
          <Text style={styles.tableCell2}>จำนวนเงิน</Text>
        </View>
        <View style={styles.tableRow2}>
          <Text style={styles.tableCell12}>ค่าเรียนวิชา {dataCourse.subject_name} กลุ่ม {dataCourse.course_name}</Text>
          <Text style={styles.tableCell22}>{parseFloat(dataCourse.price).toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.info2}>
        <View style={styles.row}>
          <Text style={styles.text}>เริ่มเรียนครั้งแรกของรอบวันที่: {formatDate2(dataCourse.date_sessions)}</Text>
        </View>
      </View>

      <View style={styles.container}>
        {Array.from({ length: updatedAttendanceData.length / 4 }).map((_, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {updatedAttendanceData.slice(rowIndex * 4, rowIndex * 4 + 4).map((item, index) => (
              <React.Fragment key={index}>
                {/* Cell สำหรับ "ครั้งที่" */}
                <View style={styles.cell}>
                  <Text>{item.title}</Text>
                </View>
                {/* Cell สำหรับ "วันที่" */}
                <View style={styles.cell}>
                  <Text>{formatDate(item.date) || '-'}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.tableRemark}>
        <View style={styles.tableRemarkRow}>
          <Text style={styles.tableRemarkCell1}>หมายเหตุ:โปรดเก็บใบเสร็จรับเงินไว้เพื่อเป็นหลักฐาน</Text>
          <Text style={styles.tableRemarkCell2}>ลงชื่อผู้รับเงิน {'.'.repeat(60)}</Text>
        </View>
      </View>
    </View>
  );
  return (
  <Document>
    <Page size="A4" style={styles.page}>
    {Array.from({ length: 2 }).map((_, index) => (
          <React.Fragment key={index}>
            {repeatSection(index)}
            {index < 1 && <View style={styles.divider} />} {/* Divider after each section except the last */}
          </React.Fragment>
        ))}
    </Page>
  </Document>
  );
};

export default BillPDF;
