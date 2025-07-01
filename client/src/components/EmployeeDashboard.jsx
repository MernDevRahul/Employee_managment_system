import { useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/authSlice';

function EmployeeDashboard() {
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">📁 Tasks Assigned</div>
        <div className="bg-white p-4 rounded shadow">✅ Attendance Status</div>
        <div className="bg-white p-4 rounded shadow">📅 Leave Status</div>
      </div>
    </DashboardLayout>
  );
}

export default EmployeeDashboard;