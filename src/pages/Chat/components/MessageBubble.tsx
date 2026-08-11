import { Box, Paper, Typography } from '@mui/material';
import { MessageType, type Message } from '../../../api';

interface MessageBubbleProps {
  message: Message;
  own: boolean;
}

function systemText(message: Message): string {
  const actor = message.actor?.displayName ?? 'Deleted user';
  const target = message.target?.displayName ?? 'Deleted user';

  switch (message.type) {
    case MessageType.SYSTEM_ADD_MEMBER:
      return `${actor} added ${target}`;
    case MessageType.SYSTEM_REMOVE_MEMBER:
      return `${actor} removed ${target}`;
    case MessageType.SYSTEM_MEMBER_LEAVE:
      return `${actor} left the group`;
    default:
      return '';
  }
}

export default function MessageBubble({ message, own }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (message.type !== MessageType.TEXT) {
    return (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ alignSelf: 'center', textAlign: 'center', py: 0.5 }}
      >
        {systemText(message)}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        alignSelf: own ? 'flex-end' : 'flex-start',
        maxWidth: { xs: '85%', sm: '70%' },
      }}
    >
      {!own && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1.5 }}>
          {message.actor?.displayName ?? 'Unknown user'}
        </Typography>
      )}

      <Paper
        elevation={0}
        sx={{
          px: 1.75,
          py: 1,
          borderRadius: 2,
          bgcolor: own ? 'primary.main' : 'common.white',
          color: own ? 'primary.contrastText' : 'text.primary',
          border: own ? 'none' : '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.body}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'left',
            opacity: 0.7,
            mt: 0.25,
          }}
        >
          {time}
        </Typography>
      </Paper>
    </Box>
  );
}
