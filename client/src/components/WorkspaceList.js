import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, collection, query, where, onSnapshot } from '../services/firebase';
import { List, ListItem, ListItemButton, ListItemText, CircularProgress, Typography, Box } from '@mui/material';

export default function WorkspaceList({ userId }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'workspaces'), where('members', 'array-contains', userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const workspacesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkspaces(workspacesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center"><CircularProgress /></Box>
    );
  }

  if (workspaces.length === 0) {
    return (
      <Box p={2}>
        <Typography align="center" color="text.secondary">
          You're not in any workspaces yet.<br/>
          Create a new project or study group to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {workspaces.map((workspace) => (
        <ListItem key={workspace.id} disablePadding>
          <ListItemButton onClick={() => navigate(`/workspace/${workspace.id}`)}>
            <ListItemText primary={workspace.name || "Untitled Workspace"} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
