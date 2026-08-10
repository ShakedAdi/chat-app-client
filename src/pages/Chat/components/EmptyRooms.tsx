import { Box, Typography } from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';

export default function EmptyRooms() {
  return (
    <Box sx={{ px: 2, py: 5, textAlign: 'center' }}>
      <ForumOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
      <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
        No rooms yet
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Start a conversation and it will show up here.
      </Typography>
    </Box>
  );
}
