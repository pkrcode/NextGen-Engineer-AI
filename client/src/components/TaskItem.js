import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  db,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from '../services/firebase';
import { formatDateTime } from '../utils/helpers';
import {
  Paper,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  Collapse,
  Box,
  LinearProgress,
  List,
  Stack,
  TextField,
  Button,
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SendIcon from '@mui/icons-material/Send';
import AttachmentIcon from '@mui/icons-material/Attachment';

const appId = 'default-app-id'; // Update with your app id or config as needed

export default function TaskItem({ task, onToggle, onDelete, onUpdate, userId }) {
  const [open, setOpen] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Firestore collections for subtasks and chat
  const subtasksCollectionRef = React.useMemo(
    () => collection(db, `artifacts/${appId}/public/data/tasks`, task.id, 'subtasks'),
    [task.id]
  );
  const chatCollectionRef = React.useMemo(
    () => collection(db, `artifacts/${appId}/public/data/tasks`, task.id, 'chat'),
    [task.id]
  );

  // Listen to subtasks and chat data when expanded
  useEffect(() => {
    if (!open) return;

    const unsubscribeSubtasks = onSnapshot(subtasksCollectionRef, (snapshot) => {
      setSubtasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeChat = onSnapshot(chatCollectionRef, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      messages.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));
      setChatMessages(messages);
    });

    return () => {
      unsubscribeSubtasks();
      unsubscribeChat();
    };
  }, [open, subtasksCollectionRef, chatCollectionRef]);

  // Calculate completion progress based on subtasks completion
  const progress = useMemo(() => {
    if (subtasks.length === 0) return task.completed ? 100 : 0;
    const completedCount = subtasks.filter((s) => s.completed).length;
    return (completedCount / subtasks.length) * 100;
  }, [subtasks, task.completed]);

  // Add new subtask to Firestore
  const handleAddSubtask = useCallback(async () => {
    if (!newSubtask.trim()) return;
    await addDoc(subtasksCollectionRef, { text: newSubtask, completed: false });
    setNewSubtask('');
  }, [newSubtask, subtasksCollectionRef]);

  // Toggle subtask completion status
  const handleToggleSubtask = useCallback(
    async (subtaskId, currentStatus) => {
      const subtaskRef = doc(db, `artifacts/${appId}/public/data/tasks`, task.id, 'subtasks', subtaskId);
      await updateDoc(subtaskRef, { completed: !currentStatus });
    },
    [task.id]
  );

  // Send new chat message
  const handleSendMessage = useCallback(async () => {
    if (!newChatMessage.trim()) return;
    await addDoc(chatCollectionRef, { text: newChatMessage, userId, timestamp: serverTimestamp() });
    setNewChatMessage('');
  }, [newChatMessage, chatCollectionRef, userId]);

  // Invite new collaborator by email
  const handleInviteUser = useCallback(async () => {
    if (!inviteEmail.trim()) return;
    // Add inviteEmail to collaborator list if not already present
    const updatedCollaborators = [...(task.collaborators || [])];
    if (!updatedCollaborators.includes(inviteEmail)) {
      updatedCollaborators.push(inviteEmail);
      await onUpdate(task.id, { collaborators: updatedCollaborators });
    }
    setInviteEmail('');
    setInviteDialogOpen(false);
  }, [inviteEmail, onUpdate, task.id, task.collaborators]);

  return (
    <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden' }}>
      <ListItem
        secondaryAction={
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(task.id)}>
            <DeleteIcon />
          </IconButton>
        }
        sx={{
          borderLeft: 5,
          borderColor:
            task.priority === 'High'
              ? 'error.main'
              : task.priority === 'Medium'
              ? 'warning.main'
              : 'success.main',
        }}
      >
        <IconButton onClick={() => onToggle(task.id, task.completed)} aria-label="toggle task completion">
          {task.completed ? <CheckCircleOutlineIcon color="success" /> : <RadioButtonUncheckedIcon />}
        </IconButton>
        <ListItemText
          primary={
            <Typography
              sx={{ textDecoration: task.completed ? 'line-through' : 'none', fontWeight: 'bold' }}
              aria-label={`Task: ${task.text}`}
            >
              {task.text}{' '}
              {task.type === 'daily' && <Chip label="Daily" size="small" sx={{ ml: 1 }} />}
            </Typography>
          }
          secondary={`Due: ${formatDateTime(task.dueDate)} | Category: ${task.category || 'None'}`}
        />
        <IconButton onClick={() => setOpen((o) => !o)} aria-label={open ? 'Collapse task details' : 'Expand task details'}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>

      {/* Collapsible details */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, backgroundColor: 'action.hover' }}>
          {/* Progress Bar */}
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, height: 8, borderRadius: 4 }} />

          {/* Subtasks List */}
          <Typography variant="subtitle2" gutterBottom>
            Sub-tasks
          </Typography>
          <List dense>
            {subtasks.map((sub) => (
              <ListItem key={sub.id} dense disablePadding>
                <IconButton
                  size="small"
                  onClick={() => handleToggleSubtask(sub.id, sub.completed)}
                  aria-label={`Mark sub-task "${sub.text}" as ${sub.completed ? 'incomplete' : 'complete'}`}
                >
                  {sub.completed ? (
                    <CheckCircleOutlineIcon fontSize="small" color="success" />
                  ) : (
                    <RadioButtonUncheckedIcon fontSize="small" />
                  )}
                </IconButton>
                <ListItemText primary={sub.text} sx={{ textDecoration: sub.completed ? 'line-through' : 'none' }} />
              </ListItem>
            ))}
          </List>

          {/* Add Subtask */}
          <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
            <TextField
              size="small"
              variant="standard"
              fullWidth
              placeholder="Add new sub-task..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              aria-label="Add new sub-task"
            />
            <Button size="small" onClick={handleAddSubtask}>
              Add
            </Button>
          </Stack>

          {/* Collaboration Section */}
          <Typography variant="subtitle2" gutterBottom>
            Collaboration
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2">Team:</Typography>
            <Tooltip title={task.ownerId || 'Owner'}>
              <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                {task.ownerId?.substring(0, 2).toUpperCase() || '?'}
              </Avatar>
            </Tooltip>

            {(task.collaborators || []).map(
              (c) =>
                c && (
                  <Tooltip key={c} title={c}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.main' }}>
                      {c.substring(0, 2).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                )
            )}

            <IconButton size="small" onClick={() => setInviteDialogOpen(true)} aria-label="Invite user">
              <GroupAddIcon />
            </IconButton>
          </Stack>

          {/* Chat Messages Display */}
          <Box
            sx={{
              maxHeight: 150,
              overflowY: 'auto',
              mb: 1,
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
            }}
            aria-label="Chat messages"
          >
            {chatMessages.map((msg) => (
              <Typography key={msg.id} variant="body2">
                <strong>{msg.userId?.substring(0, 6) || 'User'}:</strong> {msg.text}
              </Typography>
            ))}
          </Box>

          {/* Send Chat Message */}
          <Stack direction="row" spacing={1} aria-label="Send new message">
            <TextField
              size="small"
              variant="standard"
              fullWidth
              placeholder="Type a message..."
              value={newChatMessage}
              onChange={(e) => setNewChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <IconButton size="small" onClick={handleSendMessage} aria-label="Send message">
              <SendIcon />
            </IconButton>
          </Stack>

          {/* File Upload (UI only) */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="body2">Files:</Typography>
            <Button size="small" startIcon={<AttachmentIcon />} aria-label="Upload file">
              Upload File
            </Button>
          </Stack>
        </Box>
      </Collapse>

      {/* Invite User Dialog */}
      <Dialog open={inviteDialogOpen} onClose={() => setInviteDialogOpen(false)} aria-labelledby="invite-dialog-title">
        <DialogTitle id="invite-dialog-title">Invite to Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User Email"
            type="email"
            fullWidth
            variant="standard"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            aria-label="Email address to invite"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleInviteUser}>Invite</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
