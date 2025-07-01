import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";

import ManagerDashboard from "./components/ManagerDashbord";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CreateTask from "./pages/admin/CreateTask";
import AdminTaskList from "./pages/admin/AdminTaskList";
import ManagerTaskList from "./pages/manager/ManagerTaskList";
import EmployeeTaskList from "./pages/employee/EmployeeTaskList";
import DashboardLayout from "./components/DashboardLayout";
import ManagerAssignTask from "./pages/manager/ManagerAssignTask";
import CreateEmployee from "./components/CreateEmployee";
import AllEmployee from "./components/AllEmployee";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import ManagerAttendance from "./pages/manager/ManagerAttendance";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardLayout>
            <AdminDashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/employee"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/new-employee"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <CreateEmployee />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/create-task"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardLayout>
            <CreateTask />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/tasks"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminTaskList />
          </PrivateRoute>
        }
      />

      <Route
        path="/manager"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/assign-task"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <ManagerAssignTask />
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/tasks"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <ManagerTaskList />
          </PrivateRoute>
        }
      />

      <Route
        path="/employee"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <DashboardLayout>
              <EmployeeDashboard />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/employee/tasks"
        element={
          <PrivateRoute allowedRoles={["employee"]}>
            <EmployeeTaskList />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/all-employees"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <AllEmployee />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/manager/all-employees"
        element={
          <PrivateRoute allowedRoles={["manager"]}>
            <DashboardLayout>
              <AllEmployee />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
      path="/employee/mark-attendance"
      element={<PrivateRoute allowedRoles={["employee"]}>
      <DashboardLayout>
        <EmployeeAttendance />
      </DashboardLayout>
    </PrivateRoute>}/>
      <Route
      path="/manager/attendance"
      element={<PrivateRoute allowedRoles={["manager"]}>
      <DashboardLayout>
        <ManagerAttendance />
      </DashboardLayout>
    </PrivateRoute>}/>
      <Route
      path="/admin/attendance"
      element={<PrivateRoute allowedRoles={["admin"]}>
      <DashboardLayout>
        <AdminAttendance />
      </DashboardLayout>
    </PrivateRoute>}/>
    </Routes>
  );
}

export default App;
