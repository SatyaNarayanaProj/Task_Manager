import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { getTasks, createTask, deleteTask, updateTask } from '../api/api.js';

const DashboardPage = () => {
  // --- 1. STATE ---
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // State for filtering
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const { user, logout } = useAuth();

  // --- 2. EFFECTS ---
  useEffect(() => {
    fetchTasks();
  }, []);

  // --- 3. HANDLER FUNCTIONS ---
  const fetchTasks = async () => {
    try {
      setError('');
      const response = await getTasks();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Failed to fetch tasks. Please try logging in again.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true); // Start loading
    const taskData = {
      title: title,
      description: "",
      ...(dueDate && { dueDate: new Date(dueDate).toISOString() })
    };

    try {
      setError('');
      await createTask(taskData);
      setTitle('');
      setDueDate(''); // Clear the date input
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error('Failed to create task:', error);
      setError('Failed to create task.');
    }
    setIsLoading(false); // Stop loading
  };

  const handleDeleteTask = async (id) => {
    try {
      setError('');
      await deleteTask(id);
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError('Failed to delete task.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      setError('');
      // Send all fields, but toggle 'completed'
      await updateTask(task.id, { 
        title: task.title,
        description: task.description,
        completed: !task.completed,
        dueDate: task.dueDate // Include due date so it doesn't get erased
      });
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error('Failed to update task:', error);
      setError('Failed to update task.');
    }
  };

  // --- 4. DERIVED STATE (FILTERING) ---
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') {
      return !task.completed;
    }
    if (filter === 'completed') {
      return task.completed;
    }
    return true; // 'all'
  });

  // --- 5. RENDER ---
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome, {user?.username}!</h2>
        <button onClick={logout} className="btn-secondary">Logout</button>
      </header>

      <main className="dashboard-main">
        {/* --- Task Creation Form --- */}
        <form onSubmit={handleCreateTask} className="task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="task-date-input" // Use this class if you add styles
            style={{ marginRight: '1rem' }}
          />
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Task'}
          </button>
        </form>

        {error && <p className="form-error">{error}</p>}

        {/* --- Filter Buttons --- */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* --- Task List --- */}
        <h3>Your Tasks</h3>
        <ul className="task-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li key={task.id} className="task-item">
                <input 
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                />
                <p 
                  className={`task-title ${task.completed ? 'completed' : ''}`}
                  onClick={() => handleToggleComplete(task)}
                >
                  {task.title}
                  
                  {task.dueDate && (
                    <span style={{ fontSize: '0.8rem', color: '#6c757d', marginLeft: '10px' }}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </p>
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  className="btn-delete"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            // This is the corrected "empty state"
            <div className="empty-state">
              <p>Your task list is empty</p>
              <span>{filter === 'all' ? 'Add a new task above to get started!' : 'No tasks match this filter.'}</span>
            </div>
          )}
        </ul>
      </main>
    </div>
  );
};

export default DashboardPage;