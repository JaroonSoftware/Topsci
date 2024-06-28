import React from "react";
import { Route } from "react-router-dom";

import { Users, UsersAccess, UsersManage } from "../pages/users";
import { Items, ItemsAccess, ItemsManage } from "../pages/items";
import { Itemtype, ItemtypeAccess, ItemtypeManage } from "../pages/itemtype";
import { Unit, UnitAccess, UnitManage } from "../pages/unit";
import { Student, StudentAccess, StudentManage } from "../pages/students";
import { Teacher, TeacherAccess, TeacherManage } from "../pages/teachers";
import { Subjects, SubjectsAccess, SubjectsManage } from "../pages/subjects";
import { Courses, CoursesAccess, CoursesManage } from "../pages/courses";

export const DataRouter = (
  <>
    <Route path="/users/" exact element={<Users />}>
      <Route index element={<UsersAccess />} />
      <Route path="manage/:action" element={<UsersManage />} />
    </Route> 

    <Route path="/items/" exact element={<Items />}>
      <Route index element={<ItemsAccess />} />
      <Route path="manage/:action" element={<ItemsManage />} />
    </Route>

    <Route path="/itemtype/" exact element={<Itemtype />}>
      <Route index element={<ItemtypeAccess />} />
      <Route path="manage/:action" element={<ItemtypeManage />} />
    </Route>

    <Route path="/unit/" exact element={<Unit />}>
      <Route index element={<UnitAccess />} />
      <Route path="manage/:action" element={<UnitManage />} />
    </Route>

    <Route path="/students/" exact element={<Student />}>
      <Route index element={<StudentAccess />} />
      <Route path="manage/:action" element={<StudentManage />} />
    </Route>

    <Route path="/teachers/" exact element={<Teacher />}>
      <Route index element={<TeacherAccess />} />
      <Route path="manage/:action" element={<TeacherManage />} />
    </Route>

    <Route path="/subjects/" exact element={<Subjects />}>
      <Route index element={<SubjectsAccess />} />
      <Route path="manage/:action" element={<SubjectsManage />} />
    </Route>

    <Route path="/courses/" exact element={<Courses />}>
      <Route index element={<CoursesAccess />} />
      <Route path="manage/:action" element={<CoursesManage />} />
    </Route>
    
  </>
);
