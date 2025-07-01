import React, { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState(null);

  const handleCardClick = (section) => {
    setActiveSection(section === activeSection ? null : section);
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
          onClick={() => handleCardClick('tasks')}
        >
          📁 Tasks Assigned
        </div>
        <div
          className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
          onClick={() => handleCardClick('attendance')}
        >
          ✅ Attendance Status
        </div>
        <div
          className="bg-white p-4 rounded shadow cursor-pointer hover:bg-blue-50 transition"
          onClick={() => handleCardClick('leave')}
        >
          📅 Leave Status
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-6">
        {activeSection === 'tasks' && (
          <div className="bg-blue-100 p-4 rounded shadow">
            <h2 className="font-bold mb-2">Tasks Assigned</h2>
            <p>Here you can see all your assigned tasks.</p>
            {/* Replace with real task list or navigation */}
          </div>
        )}
        {activeSection === 'attendance' && (
          <div className="bg-green-100 p-4 rounded shadow">
            <h2 className="font-bold mb-2">Attendance Status</h2>
            <p>Here you can view your attendance records.</p>
            {/* Replace with real attendance data or navigation */}
          </div>
        )}
        {activeSection === 'leave' && (
          <div className="bg-yellow-100 p-4 rounded shadow">
            <h2 className="font-bold mb-2">Leave Status</h2>
            <p>Here you can check your leave status and history.</p>
            {/* Replace with real leave data or navigation */}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default EmployeeDashboard