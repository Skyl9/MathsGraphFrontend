import { useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import {
  Box,
  Alert,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  useTheme,
  Skeleton,
} from "@mui/material";
import { GlassPaper } from "../../components/GlassPaper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { nodeApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../../types/ApiTypes/user";
import { useTranslation } from "react-i18next";

const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: rows = [],
    isLoading: loading,
    error,
  } = useQuery<User[]>({
    queryKey: ["adminUsers"],
    queryFn: () => nodeApi.getAllUsers(),
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    // await nodeApi.deleteUser(id.toString());
    queryClient.setQueryData(["adminUsers"], (old: User[] | undefined) =>
      old ? old.filter((u) => u.id !== id) : [],
    );
  };

  const filteredRows = rows.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.role?.toLowerCase() || "").includes(query)
    );
  });

  const columns: GridColDef<User>[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Nom d’utilisateur", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    {
      field: "role",
      headerName: "Rôle",
      width: 130,
      renderCell: (params) => {
        const role = params.value as string;
        let color: "error" | "warning" | "info" | "default" = "default";
        if (role === "admin") color = "error";
        else if (role === "moderator" || role === "mod") color = "warning";
        else if (role === "user") color = "info";

        return (
          <Chip
            label={role.toUpperCase()}
            color={color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 600, borderRadius: 1.5 }}
          />
        );
      },
    },
    {
      field: "is_active",
      headerName: "Statut",
      width: 120,
      renderCell: (params) => {
        const isActive = params.value as boolean;
        return (
          <Chip
            label={isActive ? "Actif" : "Inactif"}
            color={isActive ? "success" : "default"}
            size="small"
            variant={isActive ? "outlined" : "outlined"}
            sx={{
              fontWeight: 600,
              borderRadius: 1.5,
              ...(isActive
                ? {
                    bgcolor: isDark
                      ? "rgba(46, 125, 50, 0.12)"
                      : "rgba(46, 125, 50, 0.08)",
                    borderColor: "success.main",
                    color: isDark ? "success.light" : "success.dark",
                  }
                : {
                    bgcolor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                    borderColor: "action.disabled",
                    color: "text.secondary",
                  }),
            }}
          />
        );
      },
    },
    {
      field: "created_at",
      headerName: "Créé le",
      width: 150,
      renderCell: (params) => {
        const val = params.value;
        if (!val) return "";
        try {
          return new Date(val).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        } catch {
          return val;
        }
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon sx={{ color: "primary.main" }} />}
          label="Éditer"
          onClick={() => navigate(`/admin/users/${params.id}`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon sx={{ color: "error.main" }} />}
          label={t("admin.common.delete")}
          onClick={() => handleDelete(Number(params.id))}
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 1 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width={300} height={20} />
          </Box>
          <Skeleton
            variant="rounded"
            width={260}
            height={40}
            sx={{ borderRadius: 3 }}
          />
        </Box>
        <GlassPaper elevation={0} sx={{ p: 0 }}>
          <Skeleton variant="rounded" width="100%" height={600} />
        </GlassPaper>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du chargement des utilisateurs."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}
          >
            Utilisateurs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérer les comptes utilisateurs, attribuer les rôles et
            activer/désactiver les comptes.
          </Typography>
        </Box>
        <TextField
          placeholder={t("admin.common.search_placeholder")}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: 260,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: isDark
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.02)",
              "& fieldset": {
                borderColor: isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <GlassPaper
        elevation={0}
        sx={{
          p: 0,
          overflow: "hidden",
        }}
      >
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.015)",
                borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 650,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)"}`,
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.03)"
                  : "rgba(0, 0, 0, 0.02)",
              },
              "& .MuiDataGrid-row:nth-of-type(even)": {
                bgcolor: isDark
                  ? "rgba(255, 255, 255, 0.01)"
                  : "rgba(0, 0, 0, 0.005)",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              },
            }}
          />
        </Box>
      </GlassPaper>
    </Box>
  );
};

export default UsersPage;
