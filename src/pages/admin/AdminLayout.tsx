import {useEffect, useState} from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
    Box, Stack, Avatar
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import {nodeApi} from "../../services/api";
import Token from "../../services/token";
import { User } from "../../types/ApiTypes/user";


const navItems = [
    { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { label: "Utilisateurs", path: "/admin/users", icon: <PeopleIcon /> },
    { label: "Contenus", path: "/admin/contents", icon: <CategoryIcon /> },
    { label: "Paramètres", path: "/admin/settings", icon: <SettingsIcon /> }
];

const drawerWidth = 240;

const AdminLayout = () => {
    const navigate = useNavigate();
    const [currentUser,setcurrentUser] = useState<Partial<User>>({})
    useEffect(()=>{
        const userId = Token.getUserIdFromToken();
        if (userId) {
            nodeApi.getUserInfo(userId)
                .then((data)=>setcurrentUser(data))
                .catch(console.error);
        }
    }, []);


    return (
        <Box sx={{ display: "flex" }}>
            <AppBar position="fixed" sx={{ ml: drawerWidth, width: `calc(100% - ${drawerWidth}px)` }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Panneau Admin
                    </Typography>
                    <IconButton color="inherit" onClick={() => navigate("/")}>
                        <HomeIcon />
                    </IconButton>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2, mr: 2 }}>
                        <Avatar src={currentUser.avatar_url} sx={{ width: 28, height: 28 }} />
                        <Typography variant="body1">{currentUser.username}</Typography>
                    </Stack>

                    <IconButton color="inherit" onClick={() => {/* déconnexion */}}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" }
                }}
            >
                <Toolbar />
                <List>
                    {navItems.map(({ label, path, icon }) => (
                        <ListItemButton key={path} onClick={() => navigate(path)}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* pour le offset de l’AppBar */}
                <Outlet />  {/* Affichera Dashboard, Users, Contents, etc. */}
            </Box>
        </Box>
    );
};

export default AdminLayout;