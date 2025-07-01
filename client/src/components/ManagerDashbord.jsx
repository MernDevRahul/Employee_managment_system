import DashboardLayout from './DashboardLayout';

function ManagerDashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">📁 Tasks from Admin</div>
        <div className="bg-white p-4 rounded shadow">🧑‍🤝‍🧑 Team Members</div>
        <div className="bg-white p-4 rounded shadow">📅 Pending Leaves</div>
      </div>
    </DashboardLayout>
  );
}

export default ManagerDashboard;