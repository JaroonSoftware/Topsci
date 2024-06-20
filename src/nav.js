import { FileTextFilled, ReconciliationFilled } from "@ant-design/icons";
import { TbReportMoney } from "react-icons/tb";
import { RiTeamFill } from "react-icons/ri";
import { MdOutlineDashboard,MdMenuBook  } from "react-icons/md";
import { TiThLarge } from "react-icons/ti";
import { GiDatabase } from "react-icons/gi";
import { FaUserCircle,FaUserGraduate,FaBookOpen   } from "react-icons/fa";
import { RiBox3Fill } from "react-icons/ri";
import { VscRepoClone  } from "react-icons/vsc";
let _nav = [
  {
    title: "MENU",
    type: "group",
  },
  {
    title: "หน้าหลัก",
    icon: <MdOutlineDashboard className="nav-ico" />,
    to: "/dashboard",
  },
  {
    title: "SYSTEM",
    type: "group",
  },
  {
    title: "การเข้าเรียน",
    icon: <VscRepoClone className="nav-ico" />,
    to: "/quotation",
  },
  {
    title: "DATA",
    type: "group",
  },

  {
    title: "ข้อมูลนักเรียน",
    icon: <RiTeamFill className="nav-ico" />,
    to: "/students",
  },
  {
    title: "ข้อมูลครู",
    icon: <FaUserGraduate className="nav-ico" />,
    to: "/teachers",
  },
  {
    title: "ประเภทวิชา",
    icon: <MdMenuBook className="nav-ico" />,
    to: "/subjects",
  },
  {
    title: "ผู้ใช้งาน",
    icon: <FaUserCircle className="nav-ico" />,
    to: "/users",
  },
  {
    title: "กำลังปรับปรุง",
    type: "group",
  },
];

export default _nav;
