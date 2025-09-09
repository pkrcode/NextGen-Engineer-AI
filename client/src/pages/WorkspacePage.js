// src/pages/WorkspacePage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  db,
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
  setDoc,
} from '../services/firebase';
import { wasYesterday, wasToday } from '../utils/helpers';
import TaskItem from '../components/TaskItem';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  List,
  CircularProgress,
  Alert,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormLabel,
  Chip,
  IconButton,
  FormControlLabel, // <-- Added this import
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Added
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Added

import AddIcon from '@mui/icons-material/Add';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- Streak Tracker Component ---
const StreakTracker = ({ userId }) => {
  const [streakData, setStreakData] = useState({ count: 0 });

  useEffect(() => {
    if (!userId) return;
    const userRef = doc(db, `users/${userId}`);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists() && doc.data().streak) {
        setStreakData(doc.data().streak);
      }
    });
    return () => unsubscribe();
  }, [userId]);

  if (streakData.count === 0) return null;

  return (
    <Chip
      icon={<WhatshotIcon />}
      label={`${streakData.count}-day Streak!`}
      color="warning"
      sx={{ fontWeight: 'bold', mx: 2 }}
    />
  );
};

export default function WorkspacePage({ user, userId, isAuthReady }) {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    text: '',
    dueDate: null,
    category: '',
    priority: 'Medium',
    taskType: 'one-time',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!isAuthReady || !userId || !workspaceId) {
      setLoading(false);
      return;
    }

    const workspaceRef = doc(db, 'workspaces', workspaceId);
    const unsubWorkspace = onSnapshot(workspaceRef, (doc) => {
      if (doc.exists()) {
        setWorkspace({ id: doc.id, ...doc.data() });
      } else {
        setError('Workspace not found.');
      }
    });

    const tasksCollectionRef = collection(db, 'workspaces', workspaceId, 'tasks');
    const q = query(tasksCollectionRef);
    const unsubTasks = onSnapshot(
      q,
      (snapshot) => {
        setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        setError('Failed to fetch tasks.');
        setLoading(false);
      }
    );

    return () => {
      unsubWorkspace();
      unsubTasks();
    };
  }, [isAuthReady, userId, workspaceId]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'completed' && task.completed) ||
        (filterStatus === 'pending' && !task.completed);
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, filterStatus]);

  const handleToggleTask = async (id, currentStatus) => {
    if (!currentStatus) {
      const userRef = doc(db, `users/${userId}`);
      const docSnap = await getDoc(userRef);
      const streak =
        docSnap.exists() && docSnap.data().streak
          ? docSnap.data().streak
          : { count: 0, lastCompleted: null };
      if (!streak.lastCompleted || !wasToday(streak.lastCompleted)) {
        let newStreakCount = 1;
        if (streak.lastCompleted && wasYesterday(streak.lastCompleted)) {
          newStreakCount = streak.count + 1;
        }
        await setDoc(
          userRef,
          { streak: { count: newStreakCount, lastCompleted: serverTimestamp() } },
          { merge: true }
        );
      }
    }
    await updateDoc(doc(db, 'workspaces', workspaceId, 'tasks', id), { completed: !currentStatus });
  };

  const handleAddTask = async () => {
    if (!newTask.text.trim() || !userId) return;
    await addDoc(collection(db, 'workspaces', workspaceId, 'tasks'), {
      ...newTask,
      ownerId: userId,
      collaborators: [userId],
      completed: false,
      createdAt: serverTimestamp(),
    });
    setDialogOpen(false);
    setNewTask({ text: '', dueDate: null, category: '', priority: 'Medium', taskType: 'one-time' });
  };

  const handleDeleteTask = async (id) => await deleteDoc(doc(db, 'workspaces', workspaceId, 'tasks', id));
  const handleUpdateTask = async (id, data) =>
    await updateDoc(doc(db, 'workspaces', workspaceId, 'tasks', id), data);

  const handleDialogInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  if (!isAuthReady || loading)
    return <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back to dashboard"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {workspace ? workspace.name : 'Loading...'}
          </Typography>
          <StreakTracker userId={userId} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Search Tasks"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onUpdate={handleUpdateTask}
                  userId={userId}
                  workspaceId={workspaceId}
                />
              ))
            ) : (
              <Typography align="center" color="text.secondary">
                No tasks yet. Add one to get started!
              </Typography>
            )}
          </List>
        )}
      </Container>

      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add a New Task</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                autoFocus
                name="text"
                label="Task Description"
                fullWidth
                value={newTask.text}
                onChange={handleDialogInputChange}
              />
              <DateTimePicker
                label="Due Date & Time"
                value={newTask.dueDate}
                onChange={(date) => setNewTask((p) => ({ ...p, dueDate: date }))}
              />
              <FormControl>
                <FormLabel>Task Type</FormLabel>
                <RadioGroup
                  row
                  name="taskType"
                  value={newTask.taskType}
                  onChange={handleDialogInputChange}
                >
                  <FormControlLabel value="one-time" control={<Radio />} label="One-Time" />
                  <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                </RadioGroup>
              </FormControl>
            </Stack>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
