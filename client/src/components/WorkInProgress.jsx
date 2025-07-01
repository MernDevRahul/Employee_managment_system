import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const WorkInProgress = () => {
  const { user } = useSelector((state) => state.auth);
  const [workInProgress, setWorkInProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, high, medium, low

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchWorkInProgress = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = [
          {
            id: 1,
            title: "Frontend Dashboard Redesign",
            description: "Redesign the admin dashboard with modern UI components and improved user experience",
            assignee: "John Doe",
            assignedBy: "Manager Smith",
            priority: "high",
            progress: 75,
            startDate: "2024-01-15",
            dueDate: "2024-02-15",
            status: "in-progress",
            category: "Development",
            estimatedHours: 40,
            actualHours: 30,
            comments: [
              { user: "John Doe", message: "Completed the main layout structure", timestamp: "2024-01-20 10:30" },
              { user: "Manager Smith", message: "Looking good! Please focus on the responsive design", timestamp: "2024-01-21 14:15" }
            ]
          },
          {
            id: 2,
            title: "Database Optimization",
            description: "Optimize database queries and improve performance for the employee management system",
            assignee: "Sarah Johnson",
            assignedBy: "Admin User",
            priority: "medium",
            progress: 45,
            startDate: "2024-01-10",
            dueDate: "2024-02-10",
            status: "in-progress",
            category: "Backend",
            estimatedHours: 25,
            actualHours: 12,
            comments: [
              { user: "Sarah Johnson", message: "Identified slow queries, working on optimization", timestamp: "2024-01-18 09:45" }
            ]
          },
          {
            id: 3,
            title: "API Documentation",
            description: "Create comprehensive API documentation for all endpoints",
            assignee: "Mike Wilson",
            assignedBy: "Manager Smith",
            priority: "low",
            progress: 90,
            startDate: "2024-01-05",
            dueDate: "2024-01-25",
            status: "in-progress",
            category: "Documentation",
            estimatedHours: 15,
            actualHours: 13,
            comments: [
              { user: "Mike Wilson", message: "Almost complete, just need to add examples", timestamp: "2024-01-22 16:20" }
            ]
          }
        ];

        setWorkInProgress(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching work in progress:', error);
        setLoading(false);
      }
    };

    fetchWorkInProgress();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredWork = workInProgress.filter(item => {
    if (filter === 'all') return true;
    return item.priority === filter;
  });

  const updateProgress = (taskId, newProgress) => {
    setWorkInProgress(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, progress: Math.min(100, Math.max(0, newProgress)) }
          : task
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work In Progress</h1>
          <p className="text-gray-600 mt-1">Track ongoing tasks and their progress</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter by priority:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{filteredWork.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredWork.length > 0 
                  ? Math.round(filteredWork.reduce((sum, task) => sum + task.progress, 0) / filteredWork.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredWork.reduce((sum, task) => sum + task.actualHours, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredWork.filter(task => task.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Work Items */}
      <div className="space-y-4">
        {filteredWork.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No work in progress</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
          </div>
        ) : (
          filteredWork.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {task.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(task.progress)}`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  
                  {/* Progress Slider */}
                  <div className="mt-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={task.progress}
                      onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Task Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assignee</p>
                    <p className="text-sm text-gray-900">{task.assignee}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Assigned By</p>
                    <p className="text-sm text-gray-900">{task.assignedBy}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</p>
                    <p className="text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hours</p>
                    <p className="text-sm text-gray-900">{task.actualHours}/{task.estimatedHours}h</p>
                  </div>
                </div>

                {/* Comments */}
                {task.comments.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Comments</h4>
                    <div className="space-y-2">
                      {task.comments.slice(-2).map((comment, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {comment.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{comment.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{comment.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkInProgress;
