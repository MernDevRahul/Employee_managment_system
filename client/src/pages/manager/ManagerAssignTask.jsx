import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import DashboardLayout from '../../components/DashboardLayout';

function ManagerAssignTask() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const taskRes = await axios.get('/projects/unassigned'); // custom API to get manager's unassigned tasks
      const empRes = await axios.get('/users?role=employee');
      console.log(taskRes);
      
      setTasks(taskRes.data);
      setEmployees(empRes.data);
    };
    fetchData();
  }, []);
  console.log(tasks);
  
  
  

  const handleAssign = async (e) => {
    console.log("Hello");
    
    e.preventDefault();
    await axios.post('/projects/manager/assign', {
      project_id: selectedTask,
      employee_id: selectedEmployee,
    });
    alert('Task assigned successfully!');
    setSelectedTask('');
    setSelectedEmployee('');
  };

  return (
    <DashboardLayout>
      <h2 className="text-xl font-bold mb-4">Assign Task to Employee</h2>
      <form onSubmit={handleAssign} className="space-y-4 max-w-lg">
        <select
          value={selectedTask}
          onChange={(e) => setSelectedTask(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>

        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">Assign Task</button>
      </form>
    </DashboardLayout>
  );
}

export default ManagerAssignTask;