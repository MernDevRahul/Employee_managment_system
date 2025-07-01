import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import DashboardLayout from '../../components/DashboardLayout';

function ManagerTaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await axios.get('/projects/me'); // create this backend route to get manager tasks    
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  console.log(tasks);
  

  const handleDueDateChange = async (taskId, newDate) => {
    console.log(taskId);
    
    await axios.put(`/projects/set-due-date/${taskId}`, {
      due_date: newDate,
    });
    fetchTasks();
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">My Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.assignment_id
                } className="border-t">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{task.employee_name || 'Unassigned'}</td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={task.due_date ? task.due_date.split('T')[0] : ''}
                      onChange={(e) => handleDueDateChange(task.assignment_id
                        , e.target.value)}
                      className="border rounded p-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManagerTaskList;