import React, { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, AppBar, Toolbar, Typography } from '@mui/material';
import { TaskList } from './components/TaskList';
import { CreateTaskForm } from './components/CreateTaskForm';
import { theme } from './theme';
import AssignmentIcon from '@mui/icons-material/Assignment';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <AssignmentIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Smart Task Manager
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <TaskList key={refreshTrigger} />
          <CreateTaskForm onTaskCreated={handleTaskCreated} />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;