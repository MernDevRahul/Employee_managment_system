import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import NotificationBell from './NotificationBell';

const activeClass = "bg-blue-100 text-blue-700 font-bold";

function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const SidebarContent = (
    <>
      <div className="p-4 text-xl font-bold border-b">EMS - {user?.role?.toUpperCase()}</div>
      <nav className="p-4 space-y-2 text-sm">
        {/* Role-based links */}
        {user?.role === 'admin' && (
          <>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/all-employees"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              All Employees
            </NavLink>
            <NavLink
              to="/admin/new-employee"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              New Employee
            </NavLink>
            <NavLink
              to="/admin/create-task"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Assign Work
            </NavLink>
            <NavLink
              to="/admin/attendance"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Attendance
            </NavLink>
            <NavLink
              to="/admin/salary"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Salary
            </NavLink>
          </>
        )}
        {user?.role === 'manager' && (
          <>
            <NavLink
              to="/manager"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/manager/all-employees"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              All Employees
            </NavLink>
            <NavLink
              to="/manager/assign-task"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Assign Work
            </NavLink>
            <NavLink
              to="/manager/tasks"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              All Tasks
            </NavLink>
            <NavLink
              to="/manager/attendance"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Team Attendance
            </NavLink>
            <NavLink
              to="/manager/leaves"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Approve Leaves
            </NavLink>
          </>
        )}
        {user?.role === 'employee' && (
          <>
            <NavLink
              to="/employee"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/employee/tasks"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              My Tasks
            </NavLink>
            <NavLink
              to="/employee/mark-attendance"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Mark Attendance
            </NavLink>
            <NavLink
              to="/employee/leave-request"
              className={({ isActive }) =>
                `block text-xl text-center ${isActive ? activeClass : ""}`
              }
            >
              Leave Request
            </NavLink>
          </>
        )}
      </nav>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        {SidebarContent}
      </aside>

      {/* Sidebar drawer for mobile */}
      <div className={`fixed inset-0 z-30 flex md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-700 ${sidebarOpen ? 'opacity-30' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Drawer */}
        <aside
          className={`
            relative w-64 bg-white shadow-md h-full z-40
            transform transition-transform duration-700
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <button
            className="absolute top-4 right-4 p-2"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            {/* Close icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {SidebarContent}
        </aside>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          {/* Hamburger for mobile, now inside the header */}
          <button
            className="md:hidden mr-2 p-2 rounded bg-white shadow"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            {/* Hamburger icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold flex-1">Welcome, {user?.name}</h1>
          {/* Notification Bell next to Logout */}
          <NotificationBell count={3} onClick={() => alert('Show notifications!')} />
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-1 rounded ml-2">
            Logout
          </button>
        </div>
        <div>{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;