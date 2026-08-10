import { Box, Typography } from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';

export default function NoRoomSelected() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Box>
        <ForumOutlinedIcon sx={{ fontSize: 120, color: 'text.disabled' }} />
        <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
          No conversation selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Pick a room from the sidebar to start chatting.
        </Typography>
      </Box>
    </Box>
  );
}
