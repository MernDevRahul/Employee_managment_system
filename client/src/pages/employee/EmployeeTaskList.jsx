import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import DashboardLayout from '../../components/DashboardLayout';

function EmployeeTaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await axios.get('/projects/me');
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);
  

  const markComplete = async (taskId) => {
    await axios.put(`/projects/employee/markAsCompleted/${taskId}`);
    fetchTasks(); // refresh the list
  };
  const markInProgress = async (taskId) => {
    await axios.put(`/projects/employee/markAsInProgress/${taskId}`);
    fetchTasks(); // refresh the list
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks assigned yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className='p-3'>Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) =>  { 
                const isOverDue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
                return(
                <tr key={task.id} className="border-t">
                  <td className="p-3">{task.title}</td>
                  <td className="p-3">{task.description}</td>
                  <td className={`p-3 ${isOverDue ? 'text-red-600 font-semibold' : ''}`}>
                    {
                      task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'
                    }
                  </td>
                  <td className="p-3 capitalize">{task.status}</td>
                  <td className="p-3">
                      {task.status === "pending" && (
                        <button
                          onClick={() => markInProgress(task.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {task.status === "in_progress" && (
                        <button
                          onClick={() => markComplete(task.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Mark Complete
                        </button>
                      )}
                      {task.status === "completed" && (
                        <span className="text-green-600 font-semibold">
                          Completed
                        </span>
                      )}
                    </td>
                </tr>
              )}
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default EmployeeTaskList;