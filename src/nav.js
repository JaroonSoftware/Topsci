import { RiTeamFill } from "react-icons/ri";
import { MdOutlineDashboard,MdMenuBook  } from "react-icons/md";
import { FaUserCircle,FaUserGraduate   } from "react-icons/fa";
import { VscRepoClone  } from "react-icons/vsc";
import { ImBooks } from "react-icons/im";
import { BiMoneyWithdraw } from "react-icons/bi";
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
    to: "/checking",
  },
  {
    title: "การชำระเงิน",
    icon: <BiMoneyWithdraw className="nav-ico" />,
    to: "/payment",
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
    title: "ข้อมูลวิชา",
    icon: <MdMenuBook className="nav-ico" />,
    to: "/subjects",
  },
  {
    title: "ข้อมูลคอร์สเรียน",
    icon: <ImBooks className="nav-ico" />,
    to: "/courses",
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
