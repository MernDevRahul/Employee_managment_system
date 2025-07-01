import DashboardLayout from './DashboardLayout';

function AdminDashboard() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded shadow">📁 Total Work Assigned</div>
        <div className="bg-white p-4 rounded shadow">🧑‍💼 Total Managers</div>
        <div className="bg-white p-4 rounded shadow">✅ Attendance Today</div>
        <div className="bg-white p-4 rounded shadow">💰 Pending Salaries</div>
      </div>
  );
}

export default AdminDashboard;