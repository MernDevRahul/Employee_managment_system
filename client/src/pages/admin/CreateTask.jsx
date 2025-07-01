import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

const CreateTask = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchManagers = async () => {
      const res = await axios.get("/users?role=manager"); // You must build this API
      setManagers(res.data);
    };
    fetchManagers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!form.title || !form.description || !form.dueDate || !form.assignee) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      // Adjust the endpoint as per your backend
    const res = await axios.post("/projects/admin/create", form);
    setSuccess('Task created successfully!');
    
    setForm({
      title: "",
      description: "",
      dueDate: "",
      assignee: "",
    })
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create task. Try again."
      );
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Task title"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Task description"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Assign To</label>
          <select
            name="assignee"
            value={form.assignee}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Employee</option>
            {managers.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;



// import { useState, useEffect } from "react";
// import axios from "../../utils/axios";

// function CreateTask() {


 

//   const handleSubmit = async (e) => {
    
//     alert("Task assigned to manager!");
//     setTitle("");
//     setDescription("");
//     setAssignedTo("");
//   };

//   return (
//     <>
//       <h2 className="text-xl font-bold mb-4">Assign Task to Manager</h2>
//       <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
//         <input
//           type="text"
//           className="w-full border p-2 rounded"
//           placeholder="Task Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           className="w-full border p-2 rounded"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//         <select
//           className="w-full border p-2 rounded"
//           value={assignedTo}
//           onChange={(e) => setAssignedTo(e.target.value)}
//           required
//         >
//           <option value="">Select Manager</option>
//           {managers.map((m) => (
//             <option key={m.id} value={m.id}>
//               {m.name}
//             </option>
//           ))}
//         </select>
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Assign Task
//         </button>
//       </form>
//     </>
//   );
// }

// export default CreateTask;
