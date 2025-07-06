// components/TaskItem.jsx
import React from 'react';
import { format } from 'date-fns';
import '../styles/TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      // Optimistic update
      const updatedTask = { ...task, status: newStatus };
      onUpdate(updatedTask);
      
      // API call
      await axios.put(`/api/tasks/${task._id}`, { status: newStatus });
    } catch (err) {
      // Revert on error
      onUpdate(task);
    }
  };

  return (
    <div className={`task-card ${task.status} ${task.priority}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`priority-badge ${task.priority}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      {task.deadline && (
        <div className="task-deadline">
          <span>Due: </span>
          {format(new Date(task.deadline), 'MMM dd, yyyy')}
        </div>
      )}
      
      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="status-select"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <button 
          onClick={() => onDelete(task._id)}
          className="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;