import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { searchUsers, type UserSummary } from '../../../api';
import {
  MIN_USER_SEARCH_LEN,
  USER_SEARCH_DEBOUNCE_MS,
} from '../../../constants';

interface UsersSearchProps {
  onSelect?: (user: UserSummary) => void;
}

export default function UsersSearch({ onSelect }: UsersSearchProps) {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const term = input.trim();
  const open = term.length >= MIN_USER_SEARCH_LEN;

  useEffect(() => {
    if (term.length < MIN_USER_SEARCH_LEN) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      void (async () => {
        try {
          const found = await searchUsers(term);
          if (!cancelled) setUsers(found);
        } catch {
          if (!cancelled) setUsers([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }, USER_SEARCH_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  return (
    <Box sx={{ position: 'relative', width: { xs: 160, sm: 240 } }}>
      <TextField
        size="small"
        fullWidth
        placeholder="Search users"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {open && (
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
          {loading && users.length === 0 ? (
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
              {users.map((user) => (
                <ListItem
                  key={user.username}
                  component="li"
                  onClick={() => onSelect?.(user)}
                >
                  <ListItemText
                    primary={user.username}
                    slotProps={{ primary: { noWrap: true } }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}
