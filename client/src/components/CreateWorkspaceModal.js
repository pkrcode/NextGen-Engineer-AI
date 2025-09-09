import React, { useState } from 'react';
import { db, addDoc, collection, serverTimestamp, writeBatch, doc } from '../services/firebase';
import { projectTemplates } from '../data/templates';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack, Typography, Paper } from '@mui/material';

export default function CreateWorkspaceModal({ open, onClose, userId }) {
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleCreate = async () => {
    if (!workspaceName.trim() || !userId) return;
    try {
      const workspaceRef = await addDoc(collection(db, 'workspaces'), {
        name: workspaceName,
        ownerId: userId,
        members: [userId],
        createdAt: serverTimestamp(),
      });
      if (selectedTemplate) {
        const batch = writeBatch(db);
        const template = projectTemplates.find(t => t.id === selectedTemplate);
        template.tasks.forEach(task => {
          const taskRef = doc(collection(db, 'workspaces', workspaceRef.id, 'tasks'));
          batch.set(taskRef, {
            text: task.text,
            completed: false,
            createdAt: serverTimestamp(),
            ownerId: userId,
            collaborators: [userId],
          });
          if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach(subtaskText => {
              const subtaskRef = doc(collection(taskRef, 'subtasks'));
              batch.set(subtaskRef, { text: subtaskText, completed: false });
            });
          }
        });
        await batch.commit();
      }
      handleClose();
    } catch (error) {
      console.error("Error creating workspace: ", error);
    }
  };

  const handleClose = () => {
    setWorkspaceName('');
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a New Workspace</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Workspace Name"
            fullWidth
            value={workspaceName}
            onChange={e => setWorkspaceName(e.target.value)}
          />
          <Typography>Or start with a template:</Typography>
          <Stack direction="row" spacing={2}>
            {projectTemplates.map((template) => (
              <Paper
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                sx={{
                  p: 2, minWidth: 200, cursor: 'pointer',
                  border: selectedTemplate === template.id ? 2 : 0,
                  borderColor: 'primary.main',
                  textAlign: 'center'
                }}
                elevation={selectedTemplate === template.id ? 3 : 1}
              >
                <span style={{ fontSize: 28 }}>{template.icon}</span>
                <Typography variant="subtitle1">{template.title}</Typography>
                <Typography variant="body2" color="text.secondary">{template.description}</Typography>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
