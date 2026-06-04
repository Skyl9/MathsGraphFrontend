import { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  Button,
  Alert,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { nodeApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ContentAdmin } from "../../types/ApiTypes/admin";

const ContentsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: rows = [],
    isLoading: loading,
    error,
  } = useQuery<ContentAdmin[]>({
    queryKey: ["adminContents"],
    queryFn: () => nodeApi.getAllContents(),
  });

  const filteredRows = rows.filter((content) => {
    const query = searchQuery.toLowerCase();
    return (
      content.nom.toLowerCase().includes(query) ||
      content.type.toLowerCase().includes(query) ||
      content.id.toString().includes(query)
    );
  });

  const handleEditRow = (row: ContentAdmin) => {
    const type = (row.type || "").toLowerCase();
    if (type === "concept") navigate(`/concept/${row.id}`);
    else if (type === "category" || type === "catégorie")
      navigate(`/category/${row.id}`);
    else if (type === "mathematicien" || type === "mathématicien")
      navigate(`/mathematicien/${row.id}`);
    else if (type === "type") navigate(`/type/${row.id}`);
    else navigate(`/concept/${row.id}`);
  };

  const columns: GridColDef<ContentAdmin>[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "nom",
      headerName: "Nom",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      width: 180,
      renderCell: (params) => {
        const type = ((params.value as string) || "").toLowerCase();
        let icon = <HelpOutlineIcon fontSize="small" />;
        let color: "primary" | "secondary" | "info" | "default" = "default";
        let label = params.value;

        if (type === "concept") {
          icon = <LightbulbIcon fontSize="small" />;
          color = "primary";
          label = "Concept";
        } else if (type === "mathematicien" || type === "mathématicien") {
          icon = <PersonIcon fontSize="small" />;
          color = "secondary";
          label = "Mathématicien";
        } else if (type === "category" || type === "catégorie") {
          icon = <CategoryIcon fontSize="small" />;
          color = "info";
          label = "Catégorie";
        }

        return (
          <Chip
            icon={icon}
            label={label}
            color={color}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              borderRadius: 1.5,
              "& .MuiChip-icon": {
                marginLeft: 1,
              },
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleEditRow(params.row)}
          title="Modifier cet élément"
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">
          {error instanceof Error
            ? error.message
            : "Une erreur est survenue lors du chargement des contenus."}
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
            Contenus
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérer les fiches de concepts mathématiques, catégories et
            biographies des mathématiciens.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            placeholder="Rechercher..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: 240,
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/contents/new")}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 14px 0 rgba(25, 118, 210, 0.25)",
              "&:hover": {
                boxShadow: "0 6px 20px 0 rgba(25, 118, 210, 0.35)",
              },
            }}
          >
            Nouveau contenu
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 4,
          overflow: "hidden",
          background: isDark
            ? "rgba(255, 255, 255, 0.02)"
            : "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(16px)",
          border: "1px solid",
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.06)",
          boxShadow: isDark
            ? "0 8px 32px 0 rgba(0, 0, 0, 0.2)"
            : "0 8px 32px 0 rgba(31, 38, 135, 0.04)",
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
      </Paper>
    </Box>
  );
};

export default ContentsPage;
