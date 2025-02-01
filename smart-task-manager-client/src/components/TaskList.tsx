import React, { useEffect, useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
    Paper,
    Typography,
    Snackbar,
    Alert,
    Chip,
    Divider,
    LinearProgress,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Task } from '../interfaces/Task';
import { api } from '../services/api';

export const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await api.getTasks();
            setTasks(data);
        } catch (error) {
            setError('Failed to load tasks');
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleComplete = async (task: Task) => {
        try {
            const updatedTask = { ...task, isCompleted: !task.isCompleted };
            await api.updateTask(updatedTask);
            setSuccessMessage('Task updated successfully');
            loadTasks();
        } catch (error) {
            setError('Failed to update task');
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.deleteTask(id);
            setSuccessMessage('Task deleted successfully');
            loadTasks();
        } catch (error) {
            setError('Failed to delete task');
            console.error('Error deleting task:', error);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString();
    };

    const getTaskStatusColor = (task: Task) => {
        const now = new Date();
        const dueDate = new Date(task.dueDate);
       
        if (task.isCompleted) return 'success';
        if (dueDate < now) return 'error';
        if (dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'warning';
        return 'info';
    };

    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const completionPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    return (
        <>
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Progress
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={completionPercentage}
                    sx={{ height: 10, borderRadius: 5, mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                    {completedTasks} of {tasks.length} tasks completed ({Math.round(completionPercentage)}%)
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                    Tasks
                </Typography>

                {loading ? (
                    <LinearProgress sx={{ my: 2 }} />
                ) : tasks.length === 0 ? (
                    <Box sx={{
                        textAlign: 'center',
                        py: 4,
                        bgcolor: 'background.default',
                        borderRadius: 2
                    }}>
                        <Typography variant="body1" color="text.secondary">
                            No tasks yet. Click the + button to create one!
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {tasks.map((task, index) => (
                            <React.Fragment key={task.id}>
                                {index > 0 && <Divider />}
                                <ListItem
                                    sx={{
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: 'background.default',
                                        },
                                        borderRadius: 1,
                                        my: 1
                                    }}
                                    secondaryAction={
                                        <Box>
                                            <IconButton
                                                edge="end"
                                                aria-label="edit"
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => task.id && handleDelete(task.id)}
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <Checkbox
                                        checked={task.isCompleted}
                                        onChange={() => handleToggleComplete(task)}
                                        sx={{ mr: 2 }}
                                    />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Grid container spacing={1} alignItems="center">
                                            <Grid item xs={12}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                                                        color: task.isCompleted ? 'text.secondary' : 'text.primary'
                                                    }}
                                                >
                                                    {task.title}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        textDecoration: task.isCompleted ? 'line-through' : 'none'
                                                    }}
                                                >
                                                    {task.description}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        Due: {formatDate(task.dueDate)}
                                                    </Typography>
                                                    <Chip
                                                        label={task.category}
                                                        size="small"
                                                        color={getTaskStatusColor(task)}
                                                        sx={{ ml: 1 }}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </ListItem>
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
            >
                <Alert severity="error" onClose={() => setError('')} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage('')}
            >
                <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </>
    );
};