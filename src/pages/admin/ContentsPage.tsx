import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress, Button, Stack, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { nodeApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ContentAdmin } from '../../types/ApiTypes/admin';

const ContentsPage = () => {
  const navigate = useNavigate();

  const { data: rows = [], isLoading: loading, error } = useQuery<ContentAdmin[]>({
    queryKey: ['adminContents'],
    queryFn: () => nodeApi.getAllContents()
  });

  const columns: GridColDef<ContentAdmin>[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nom', headerName: 'Nom', flex: 1 },
    { field: 'type', headerName: 'Type', width: 140 }
  ];

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error instanceof Error ? error.message : 'Une erreur est survenue'}</Alert>;

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate('/admin/contents/new')}
      >
        Nouveau contenu
      </Button>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Stack>
  );
};

export default ContentsPage;


