// ContentsPage.tsx
import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, CircularProgress, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { nodeApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface ContentRow {
  id: number;
  nom: string;
  type: string;
}

const ContentsPage: React.FC = () => {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    nodeApi.getAllContents()
      .then((data: ContentRow[]) => setRows(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'nom', headerName: 'Nom', flex: 1 },
    { field: 'type', headerName: 'Type', width: 140 }
  ];

  if (loading) return <CircularProgress />;

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
