import React, { useState } from 'react';

const AdminDashboard = () => {
  // Dummy data for demonstration
  const [stats] = useState({
    totalWork: 12,
    totalManagers: 3,
    attendanceToday: 25,
    pendingSalaries: 2,
  });

  // Handler for card clicks
  const handleCardClick = (type) => {
    switch (type) {
      case 'work':
        alert('Show details for Total Work Assigned');
        break;
      case 'managers':
        alert('Show details for Total Managers');
        break;
      case 'attendance':
        alert('Show details for Attendance Today');
        break;
      case 'salaries':
        alert('Show details for Pending Salaries');
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
        onClick={() => handleCardClick('work')}
      >
        📁 Total Work Assigned
        <div className="text-2xl font-bold">{stats.totalWork}</div>
      </div>
      <div
        className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
        onClick={() => handleCardClick('managers')}
      >
        🧑‍💼 Total Managers
        <div className="text-2xl font-bold">{stats.totalManagers}</div>
      </div>
      <div
        className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
        onClick={() => handleCardClick('attendance')}
      >
        ✅ Attendance Today
        <div className="text-2xl font-bold">{stats.attendanceToday}</div>
      </div>
      <div
        className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
        onClick={() => handleCardClick('salaries')}
      >
        💰 Pending Salaries
        <div className="text-2xl font-bold">{stats.pendingSalaries}</div>
      </div>
    </div>
  );
};

export default AdminDashboard