import { Box, IconButton, Paper, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function RoomView() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
        {/* messages go here */}
      </Box>

      <Paper
        component="form"
        elevation={0}
        square
        onSubmit={(event) => event.preventDefault()}
        sx={{
          display: 'flex',
          alignItems: 'center',
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
        />
        <IconButton type="submit" color="primary" aria-label="Send message">
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
