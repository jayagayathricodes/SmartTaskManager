import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fab,
    Typography,
    CircularProgress,
    Backdrop
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Task } from '../interfaces/Task';
import { api } from '../services/api';

interface CreateTaskFormProps {
    onTaskCreated: () => void;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ onTaskCreated }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState<string>(new Date().toISOString().slice(0, 16));
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setOpen(false);
            resetForm();
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate(new Date().toISOString().slice(0, 16));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !dueDate) return;

        try {
            setIsSubmitting(true);
            const newTask: Task = {
                title,
                description,
                category: 'General',
                dueDate: new Date(dueDate),
                isCompleted: false
            };

            await api.createTask(newTask);
            onTaskCreated();
            handleClose();
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Fab
                color="secondary"
                aria-label="add"
                onClick={handleClickOpen}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
            >
                <AddIcon />
            </Fab>

            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: '400px',
                        position: 'relative'
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" color="primary">
                        Create New Task
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            type="text"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                            disabled={isSubmitting}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 2 }}
                            disabled={isSubmitting}
                        />
                        <TextField
                            margin="dense"
                            label="Due Date"
                            type="datetime-local"
                            fullWidth
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={isSubmitting}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        onClick={handleClose}
                        sx={{ borderRadius: 2 }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ borderRadius: 2 }}
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>

                {/* Overlay with spinner */}
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        position: 'absolute',
                        borderRadius: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)'
                    }}
                    open={isSubmitting}
                >
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <CircularProgress color="inherit" />
                        <Typography>
                            Enhancing task with AI...
                        </Typography>
                    </Box>
                </Backdrop>
            </Dialog>
        </>
    );
};