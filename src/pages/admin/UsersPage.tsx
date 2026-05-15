// UsersPage.tsx
import React from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, CircularProgress, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { nodeApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UserRow {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

const UsersPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rows = [], isLoading: loading, error } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => nodeApi.getAllUsers()
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    // await nodeApi.deleteUser(id.toString());
    // On invalide le cache pour rafraîchir la liste
    queryClient.setQueryData(['adminUsers'], (old: UserRow[] | undefined) => old ? old.filter(u => u.id !== id) : []);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Nom d’utilisateur', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'role', headerName: 'Rôle', width: 120 },
    { field: 'is_active', headerName: 'Actif', width: 100, type: 'boolean' },
    { field: 'created_at', headerName: 'Créé le', width: 160 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Éditer"
          onClick={() => navigate(`/admin/users/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Supprimer"
          onClick={() => handleDelete(Number(params.id))}
        />
      ]
    }
  ];

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{(error as any).message}</Alert>;

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid rows={rows} columns={columns}/>
    </Box>
  );
};

export default UsersPage;