import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import {
  getLastMessages,
  getRoomDetails,
  type RoomDetails,
  RoomType,
  sendMessage,
  type Message,
} from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import MessageBubble from './MessageBubble';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

export default function RoomView() {
  const { roomId } = useParams();
  const [room, setRoom] = useState<RoomDetails>();
  const { user: me } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadedRoomId, setLoadedRoomId] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openRoomDetails, setOpenRoomDetails] = useState<boolean>(false);

  const loading = loadedRoomId !== roomId;
  const isGroup = room?.type === RoomType.GROUP;

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    void (async () => {
      try {
        setRoom(await getRoomDetails(roomId));
        const found = await getLastMessages(roomId);
        if (!cancelled) {
          setMessages(found);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setMessages([]);
          setError(
            err instanceof Error ? err.message : 'Could not load messages',
          );
        }
      } finally {
        if (!cancelled) setLoadedRoomId(roomId);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const ordered = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [ordered]);

  const handleSend = async (event: React.FormEvent) => {
    event.preventDefault();

    const text = draft.trim();
    if (!roomId || !text || sending) return;

    setSending(true);
    setSendError('');
    try {
      await sendMessage(roomId, text);
      setDraft('');
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send');
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
    >
      <Paper elevation={5} square>
        <Button
          fullWidth
          disabled={!room}
          sx={{
            justifyContent: 'flex-start',
            gap: 1.5,
            p: 1.5,
            borderRadius: 0,
          }}
          onClick={() => setOpenRoomDetails(true)}
        >
          {isGroup ? (
            <GroupIcon fontSize="small" />
          ) : (
            <PersonIcon fontSize="small" />
          )}
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ fontWeight: 'bold', minWidth: 0 }}
          >
            {room?.name}
          </Typography>
        </Button>
      </Paper>
      <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : ordered.length === 0 ? (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              No messages yet. Say hello.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {ordered.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                own={message.actor?.id === me?.sub}
              />
            ))}
          </Box>
        )}
      </Box>

      <Paper
        component="form"
        elevation={0}
        square
        onSubmit={(event) => void handleSend(event)}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          p: 1.5,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <TextField
          size="small"
          fullWidth
          multiline
          maxRows={4}
          placeholder="Write a message"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setSendError('');
          }}
          error={!!sendError}
          helperText={sendError}
          disabled={sending}
        />
        <IconButton
          type="submit"
          color="primary"
          aria-label="Send message"
          disabled={sending || draft.trim().length === 0}
        >
          {sending ? <CircularProgress size={20} /> : <SendIcon />}
        </IconButton>
      </Paper>
      <Dialog
        open={openRoomDetails}
        onClose={() => setOpenRoomDetails(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontWeight: 700,
          }}
        >
          {isGroup ? (
            <GroupIcon sx={{ flexShrink: 0 }} />
          ) : (
            <PersonIcon sx={{ flexShrink: 0 }} />
          )}
          {room?.name}

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Created at{' '}
            {room
              ? new Date(room.createdAt).toDateString()
              : 'Error loading creation date'}
          </Typography>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2}>
            <List
              dense
              disablePadding
              sx={{ minHeight: 180, maxHeight: 240, overflowY: 'auto' }}
            >
              {room?.members.map((member) => {
                const isMe = member.userId === me?.sub;

                return (
                  <ListItem
                    key={member.userId}
                    secondaryAction={
                      isGroup ? (
                        <Typography
                          variant="body1"
                          sx={{ color: 'text.secondary' }}
                        >
                          {member.role}
                        </Typography>
                      ) : null
                    }
                    sx={{
                      px: 1,
                      borderRadius: 1,
                      bgcolor: isMe
                        ? (theme) => alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 'auto', mr: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: isMe ? 'primary.main' : 'action.selected',
                          color: isMe
                            ? 'primary.contrastText'
                            : 'text.secondary',
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        isMe
                          ? `${member.user.displayName} (You)`
                          : member.user.displayName
                      }
                      secondary={`@${member.user.username}`}
                      slotProps={{
                        primary: {
                          noWrap: true,
                          sx: { fontWeight: isMe ? 700 : 500 },
                        },
                        secondary: { noWrap: true, variant: 'caption' },
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenRoomDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
