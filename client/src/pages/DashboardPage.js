import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkspaceList from '../components/WorkspaceList';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "The journey of a thousand miles begins with a single step.",
  "Well done is better than well said.",
  "You don’t have to be great to start, but you have to start to be great."
];

export default function DashboardPage({ user, userId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
                opacity: 0.8,
              },
            }}
          >
            AdhyayanMarg
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            textAlign: 'center',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <FormatQuoteIcon />
          <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
            {quote}
          </Typography>
        </Paper>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            fullWidth
          >
            Create New Workspace
          </Button>
          <Button variant="outlined" startIcon={<GroupAddIcon />} fullWidth>
            Join a Workspace
          </Button>
        </Stack>

        <Typography variant="h5" gutterBottom>Your Workspaces</Typography>
        <Paper variant="outlined">
          <WorkspaceList userId={userId} />
        </Paper>
      </Container>

      <CreateWorkspaceModal open={modalOpen} onClose={() => setModalOpen(false)} userId={userId} />
    </>
  );
}
