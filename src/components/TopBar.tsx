import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Link,
  IconButton,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const NavLeft = styled("nav")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "flex-start",
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
}));

const NavRight = styled("nav")(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "flex-end",
  alignItems: "center",
  flex: 1,
}));
import { LogoutButton } from "./LogoutButton";
import Token from "../services/token";
import logo from "../assets/logo.svg";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Icône Lune
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Icône Soleil
import { useTranslation } from "react-i18next";
import { GlobalSearchBar } from "./GlobalSearchBar.tsx";
import { useUIStore } from "../stores/useUIStore.ts";
import { NotificationsMenu } from "./NotificationsMenu.tsx";

export const TopBar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(() =>
    Token.getUsernameFromToken(),
  );
  const theme = useTheme();
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    const newLang = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  return (
    <AppBar position="static" color="default">
      <Toolbar sx={{ justifyContent: "space-around" }}>
        <NavLeft>
          <div>
            <Link href={"/"} underline="none" color={"textPrimary"}>
              <img src={logo} alt={"Logo"}></img>
              <Typography>MATHGRAPH</Typography>
            </Link>
          </div>
          <Button onClick={toggleLanguage} color="inherit" sx={{ ml: 2 }}>
            {i18n.language === "fr" ? "🇬🇧 EN" : "🇫🇷 FR"}
          </Button>
          <IconButton
            aria-label={t("topbar.toggle_theme")}
            sx={{ ml: 1 }}
            onClick={toggleDarkMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </NavLeft>
        <NavRight>
          <GlobalSearchBar />

          {username ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <NotificationsMenu />
              <Typography variant="body1">
                {t("app.hello")},{" "}
                <Link href={"/username/" + username}>{username}</Link>
              </Typography>
              <LogoutButton onLogout={() => setUsername(null)} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" href="/login">
                {t("app.login")}
              </Button>
              <Button variant="contained" href="/register">
                {t("app.register")}
              </Button>
            </Box>
          )}
        </NavRight>
      </Toolbar>
    </AppBar>
  );
};
