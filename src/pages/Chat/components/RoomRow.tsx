import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { RoomType, type Room } from '../../../api';

interface RoomRowProps {
  room: Room;
  selected?: boolean;
  onSelect?: (room: Room) => void;
}

export default function RoomRow({
  room,
  selected = false,
  onSelect,
}: RoomRowProps) {
  const isGroup = room.type === RoomType.GROUP;
  const label = room.name ?? (isGroup ? 'Unnamed group' : 'Direct message');

  return (
    <ListItemButton
      component="li"
      selected={selected}
      onClick={() => onSelect?.(room)}
      sx={{
        borderRadius: 1,
        gap: 1.5,
        borderBottom: '1px solid',
        borderBottomColor: (theme) => alpha(theme.palette.divider, 0.2),
        '&.Mui-selected, &.Mui-selected:hover': {
          bgcolor: 'background.paper',
        },
      }}
    >
      <ListItemAvatar sx={{ minWidth: 'auto' }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: selected ? 'primary.main' : 'action.selected',
            color: selected ? 'primary.contrastText' : 'text.secondary',
          }}
        >
          {isGroup ? (
            <GroupIcon fontSize="small" />
          ) : (
            <PersonIcon fontSize="small" />
          )}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={label}
        secondary={isGroup ? 'Group' : 'Direct message'}
        slotProps={{
          primary: {
            noWrap: true,
            sx: { fontWeight: selected ? 700 : 500 },
          },
          secondary: { noWrap: true, variant: 'caption' },
        }}
      />
    </ListItemButton>
  );
}
