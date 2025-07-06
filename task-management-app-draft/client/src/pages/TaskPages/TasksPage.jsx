// pages/TasksPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskFilters from '../../../../../TaskFilters';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    sort: 'newest',
    status: 'all',
    priority: 'all',
    search: ''
  });

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add filters to params if not default
      if (filters.sort !== 'newest') params.append('sort', filters.sort);
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const res = await axios.get(`/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setTasks(res.data.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  return (
    <div className="tasks-container">
      <h1>My Tasks</h1>
      <TaskFilters onFilterChange={setFilters} />
      
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem key={task._id} task={task} />
          ))}
        </ul>
      ) : (
        <p>No tasks found matching your filters</p>
      )}
    </div>
  );
}