import IconButton from '@mui/material/IconButton';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useUserSearch } from '../../../hooks/useUserSearch';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { createGroup, type CreateGroupResponse } from '../../../api';
import { useNavigate } from 'react-router-dom';

interface CreateGroupProps {
  onGroupCreated?: (room: CreateGroupResponse) => void | Promise<void>;
}

export default function CreateGroup({ onGroupCreated }: CreateGroupProps) {
  const { input, setInput, enabled, users, loading } = useUserSearch();
  const [members, setMembers] = useState<string[]>([]);
  const [name, setName] = useState<string>('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user: me } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const canCreate = name.trim().length > 0 && members.length > 0;

  const toggleMember = (username: string) => {
    setMembers((prev) =>
      prev.includes(username)
        ? prev.filter((member) => member !== username)
        : [...prev, username],
    );
  };

  const handleCreateGroup = async () => {
    if (!canCreate || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      const room = await createGroup(name.trim(), members);
      await onGroupCreated?.(room);
      setOpen(false);
      navigate(`/chat/${room.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <IconButton
        aria-label={'Create new group'}
        onClick={() => setOpen(true)}
        sx={{
          p: 1.5,
          bgcolor: 'secondary.main',
          color: 'secondary.contrastText',
          '&:hover': { bgcolor: 'secondary.dark' },
        }}
      >
        <GroupAddIcon fontSize="medium" />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>New group</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Group name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
              autoFocus
            />

            {members.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ flexWrap: 'wrap' }}
              >
                {members.map((member) => (
                  <Chip
                    key={member}
                    label={member}
                    size="small"
                    color="secondary"
                    onDelete={() => toggleMember(member)}
                  />
                ))}
              </Stack>
            )}

            <TextField
              size="small"
              fullWidth
              placeholder="Search users to add"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ minHeight: 180, maxHeight: 240, overflowY: 'auto' }}>
              {!enabled ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 1, py: 1.5 }}
                >
                  Type at least 2 characters to find people.
                </Typography>
              ) : loading && users.length === 0 ? (
                <Box sx={{ display: 'grid', placeItems: 'center', py: 4 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : users.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ px: 1, py: 1.5 }}
                >
                  No users found
                </Typography>
              ) : (
                <List disablePadding>
                  {users
                    .filter(
                      (user) =>
                        me?.username.toLowerCase() !==
                        user.username.toLowerCase(),
                    )
                    .map((user) => {
                      const selected = members.includes(user.username);

                      return (
                        <ListItemButton
                          key={user.username}
                          component="li"
                          selected={selected}
                          onClick={() => toggleMember(user.username)}
                          sx={{ borderRadius: 1, gap: 1 }}
                        >
                          <Checkbox
                            edge="start"
                            checked={selected}
                            tabIndex={-1}
                            disableRipple
                            color="secondary"
                            sx={{ p: 0.5 }}
                          />
                          <ListItemAvatar sx={{ minWidth: 'auto', mr: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.displayName}
                            secondary={`@${user.username}`}
                            slotProps={{
                              primary: {
                                noWrap: true,
                                sx: { fontWeight: 600 },
                              },
                              secondary: { noWrap: true, variant: 'caption' },
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                </List>
              )}
            </Box>

            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => void handleCreateGroup()}
            variant="contained"
            loading={submitting}
            disabled={!canCreate}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
