import { createContext, useState } from 'react';
import { getTasks as fetchTasks, createTask as addTask } from '../utils/api';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const getTasks = async () => {
        setLoading(true);
        try {
            const data = await fetchTasks();
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (task) => {
        try {
            const newTask = await addTask(task);
            setTasks([...tasks, newTask]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, loading, getTasks, createTask }}>
            {children}
        </TaskContext.Provider>
    );
};