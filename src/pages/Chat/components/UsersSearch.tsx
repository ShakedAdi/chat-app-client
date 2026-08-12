import { useState } from 'react';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { useNavigate } from 'react-router-dom';
import {
  createDirect,
  type CreateDmResponse,
  type UserSummary,
} from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import { useUserSearch } from '../../../hooks/useUserSearch';

interface UsersSearchProps {
  onSelect?: (user: UserSummary) => void;
  onDirectCreated?: (room: CreateDmResponse, user: UserSummary) => void;
}

export default function UsersSearch({
  onSelect,
  onDirectCreated,
}: UsersSearchProps) {
  const { input, setInput, enabled, users, loading } = useUserSearch();
  const [close, setClose] = useState(false);
  const [pendingUsername, setPendingUsername] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { user: me } = useAuth();
  const navigate = useNavigate();

  const handleMessage = async (event: React.MouseEvent, user: UserSummary) => {
    event.stopPropagation();

    setPendingUsername(user.username);
    setError('');
    try {
      const room = await createDirect(user.username);
      onDirectCreated?.(room, user);
      setInput('');
      navigate(`/chat/${room.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open the chat');
    } finally {
      setPendingUsername(null);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setClose(true)}>
      <Box sx={{ position: 'relative', width: { xs: 160, sm: 240 } }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Search users"
          value={input}
          onChange={(e) => {
            setClose(false);
            setInput(e.target.value);
            setError('');
          }}
        />

        {!close && enabled && (
          <Paper
            elevation={4}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              maxHeight: 280,
              overflowY: 'auto',
              zIndex: 10,
            }}
          >
            {error ? (
              <Typography variant="body2" color="error" sx={{ px: 2, py: 1.5 }}>
                {error}
              </Typography>
            ) : loading && users.length === 0 ? (
              <Box sx={{ display: 'grid', placeItems: 'center', py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            ) : users.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ px: 2, py: 1.5 }}
              >
                No users found
              </Typography>
            ) : (
              <List disablePadding>
                {users.map(
                  (user) =>
                    me?.username.toLowerCase() !==
                      user.username.toLowerCase() && (
                      <ListItem
                        key={user.username}
                        component="li"
                        onClick={() => onSelect?.(user)}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            aria-label={`Message ${user.username}`}
                            disabled={pendingUsername !== null}
                            onClick={(event) => void handleMessage(event, user)}
                          >
                            {pendingUsername === user.username ? (
                              <CircularProgress size={16} />
                            ) : (
                              <ChatBubbleOutlineIcon fontSize="small" />
                            )}
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={user.displayName}
                          slotProps={{
                            primary: { noWrap: true, sx: { fontWeight: 700 } },
                          }}
                        />
                        <ListItemText
                          primary={`@${user.username}`}
                          slotProps={{ primary: { noWrap: true } }}
                        />
                      </ListItem>
                    ),
                )}
              </List>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}
