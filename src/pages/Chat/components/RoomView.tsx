import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { getLastMessages, sendMessage, type Message } from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import MessageBubble from './MessageBubble';

export default function RoomView() {
  const { roomId } = useParams();
  const { user: me } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadedRoomId, setLoadedRoomId] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const loading = loadedRoomId !== roomId;

  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    void (async () => {
      try {
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
    </Box>
  );
}
