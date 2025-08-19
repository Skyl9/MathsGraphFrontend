import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircularProgress, Container, Typography } from '@mui/material'
import { nodeApi } from '../services/api'
import {CategoryInfo} from "../types/types";


export const CategoryRedirect: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!categoryName) {
            setError("Catégorie invalide.")
            return
        }

        const fetchAndRedirect = async () => {
            try {
                const data: CategoryInfo = await nodeApi.getCategoryId(categoryName)
                // optionnel : vous pourriez utiliser data.nom pour du tracking ou logging
                navigate(`/category/${data.id}`, { replace: true })
            } catch (err) {
                console.error(err)
                setError("Impossible de trouver la catégorie demandée.")
            }
        }

        fetchAndRedirect()
    }, [categoryName, navigate])

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Container>
        )
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8
            }}
        >
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Redirection en cours...</Typography>
        </Container>
    )
}