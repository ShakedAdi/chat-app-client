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
  MemberRole,
  type RoomDetails,
  RoomType,
  sendMessage,
  type Message,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroup,
  deleteDirect,
} from '../../../api';
import { useAuth } from '../../../context/AuthContext';
import MessageBubble from './MessageBubble';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

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
  const [addingMember, setAddingMember] = useState(false);
  const [memberDraft, setMemberDraft] = useState('');
  const [addingBusy, setAddingBusy] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  const loading = loadedRoomId !== roomId;
  const isGroup = room?.type === RoomType.GROUP;
  const isDirect = room?.type === RoomType.DIRECT;
  const isAdmin =
    room?.members.find((member) => member.userId === me?.sub)?.role ===
    MemberRole.ADMIN;

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

  const handleAddMember = async (event: React.FormEvent) => {
    event.preventDefault();

    const username = memberDraft.trim();
    if (!room || !username || addingBusy) return;

    setAddingBusy(true);
    setAddMemberError('');
    try {
      await addMember(room.id, username);
      setRoom(await getRoomDetails(room.id));
      setMemberDraft('');
      setAddingMember(false);
    } catch (err) {
      setAddMemberError(
        err instanceof Error ? err.message : 'Could not add member',
      );
    } finally {
      setAddingBusy(false);
    }
  };

  const closeRoomDetails = () => {
    setOpenRoomDetails(false);
    setAddingMember(false);
    setMemberDraft('');
    setAddMemberError('');
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
        onClose={closeRoomDetails}
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
            {addingMember && (
              <Box
                component="form"
                onSubmit={(event) => void handleAddMember(event)}
                sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}
              >
                <TextField
                  autoFocus
                  size="small"
                  fullWidth
                  label="Username"
                  value={memberDraft}
                  onChange={(event) => {
                    setMemberDraft(event.target.value);
                    setAddMemberError('');
                  }}
                  error={!!addMemberError}
                  helperText={addMemberError}
                  disabled={addingBusy}
                />
                <Button
                  type="submit"
                  size="small"
                  disabled={addingBusy || memberDraft.trim().length === 0}
                >
                  {addingBusy ? <CircularProgress size={20} /> : 'Add'}
                </Button>
              </Box>
            )}

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
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center' }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ color: 'text.secondary' }}
                          >
                            {member.role}
                          </Typography>
                          {isAdmin && !isMe && (
                            <IconButton
                              edge="end"
                              size="small"
                              color="error"
                              aria-label={`Remove ${member.user.displayName}`}
                              onClick={() =>
                                removeMember(room.id, member.user.username)
                              }
                            >
                              <PersonRemoveIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
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

        <DialogActions sx={{ px: 2, py: 1.5 }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button size="small" onClick={closeRoomDetails}>
              Close
            </Button>
            <Box sx={{ flex: 1 }} />
            {isGroup && isAdmin && (
              <Button
                size="small"
                aria-label={addingMember ? 'Cancel adding member' : 'Add member'}
                sx={{ minWidth: 0, px: 1 }}
                onClick={() => setAddingMember((open) => !open)}
              >
                <PersonAddIcon fontSize="small" />
              </Button>
            )}
            {isGroup && (
              <Button
                size="small"
                color="error"
                aria-label="Leave group"
                sx={{ minWidth: 0, px: 1 }}
                onClick={() => leaveGroup(room.id)}
              >
                <LogoutIcon fontSize="small" />
              </Button>
            )}

            {(isDirect || (isGroup && isAdmin)) && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                aria-label="Delete group"
                sx={{ minWidth: 0, px: 1 }}
                onClick={() =>
                  isGroup ? deleteGroup(room.id) : deleteDirect(room.id)
                }
              >
                <DeleteOutlinedIcon fontSize="small" />
              </Button>
            )}
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
