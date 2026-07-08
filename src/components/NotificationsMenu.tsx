import React, { useEffect, useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { nodeApi } from "../services/api";
import { useNotificationStore } from "../stores/useNotificationStore";
import { Notification } from "../types/ApiTypes/notification";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const NotificationsMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    unreadCount,
    setUnreadCount,
    decrementUnreadCount,
    resetUnreadCount,
  } = useNotificationStore();

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await nodeApi.getNotifications();
      setNotifications(data || []);
      setUnreadCount((data || []).length);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    // Avoid synchronous state updates in effect
    const initFetch = async () => {
      await fetchNotifications();
    };
    initFetch();
  }, [fetchNotifications]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (id: number) => {
    try {
      await nodeApi.markNotificationRead(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      decrementUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await nodeApi.markAllNotificationsRead();
      setNotifications([]);
      resetUnreadCount();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: { maxHeight: 400, width: "350px" },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Tout marquer comme lu
            </Button>
          )}
        </Box>
        <Divider />
        {loading ? (
          <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>Aucune nouvelle notification</MenuItem>
        ) : (
          notifications.map((notif) => (
            <MenuItem
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              sx={{
                whiteSpace: "normal",
                py: 1.5,
                borderBottom: "1px solid #eee",
              }}
            >
              <Box>
                <Typography variant="body2">{notif.message}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {dayjs(notif.created_at).fromNow()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};
