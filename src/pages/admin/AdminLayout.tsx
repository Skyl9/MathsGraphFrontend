import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { nodeApi } from "../../services/api";
import Token from "../../services/token";
import { User } from "../../types/ApiTypes/user";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { label: "Utilisateurs", path: "/admin/users", icon: <PeopleIcon /> },
  { label: "Contenus", path: "/admin/contents", icon: <CategoryIcon /> },
  { label: "Paramètres", path: "/admin/settings", icon: <SettingsIcon /> },
];

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  const [isAdmin] = useState(() => Token.getUserRoleFromToken() === "admin");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const userId = Token.getUserIdFromToken();
    if (userId !== null) {
      nodeApi
        .getUserInfo(userId.toString())
        .then((data) => setCurrentUser(data))
        .catch(console.error);
    }
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    Token.clearToken();
    navigate("/login");
  };

  if (!isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          ml: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          bgcolor: isDark ? "rgba(9, 13, 22, 0.7)" : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}
          >
            Administration
          </Typography>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              aria-label="Bouton d'action"
              color="inherit"
              onClick={() => navigate("/")}
              title="Retour à l'accueil"
            >
              <HomeIcon />
            </IconButton>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ my: 1.5, opacity: 0.5 }}
            />

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              onClick={handleMenuClick}
              sx={{
                cursor: "pointer",
                p: 0.5,
                px: 1.5,
                borderRadius: 3,
                transition: "background-color 0.2s ease",
                "&:hover": {
                  bgcolor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              <Avatar
                src={currentUser.avatar_url || "/default-avatar.png"}
                sx={{ width: 28, height: 28 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {currentUser.username}
              </Typography>
            </Stack>

            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  bgcolor: isDark
                    ? "rgba(15, 20, 40, 0.95)"
                    : "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(8px)",
                  mt: 1.5,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => navigate(`/user/${currentUser.id}`)}
                sx={{ fontWeight: 550, py: 1 }}
              >
                Mon Profil
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/")}
                sx={{ fontWeight: 550, py: 1 }}
              >
                Retour au site
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                sx={{ color: "error.main", fontWeight: 600, py: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
            background: isDark
              ? "linear-gradient(180deg, #090d16 0%, #111827 100%)"
              : "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "primary.main",
            }}
          >
            MATHGRAPH ADMIN
          </Typography>
        </Toolbar>
        <Divider sx={{ opacity: 0.5 }} />
        <List sx={{ px: 1.5, py: 2 }}>
          {navItems.map(({ label, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <ListItemButton
                key={path}
                onClick={() => navigate(path)}
                sx={{
                  borderRadius: 2.5,
                  mb: 1,
                  py: 1.2,
                  px: 2,
                  bgcolor: isActive
                    ? isDark
                      ? "rgba(14, 165, 233, 0.15)"
                      : "rgba(14, 165, 233, 0.08)"
                    : "transparent",
                  color: isActive ? "primary.main" : "text.secondary",
                  borderLeft: isActive
                    ? `3px solid ${theme.palette.primary.main}`
                    : "3px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.03)"
                      : "rgba(0, 0, 0, 0.02)",
                    color: "text.primary",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: isActive ? "primary.main" : "text.secondary",
                    transition: "color 0.2s ease",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.9rem",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, bgcolor: "background.default" }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
