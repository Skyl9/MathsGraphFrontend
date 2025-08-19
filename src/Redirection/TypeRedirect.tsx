import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircularProgress, Container, Typography } from '@mui/material'
import { nodeApi } from '../services/api'
import {TypeInfo} from "../types/types";


export const TypeRedirect: React.FC = () => {
    const { typeName } = useParams<{ typeName: string }>()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!typeName) {
            setError("Type invalide.")
            return
        }

        const fetchAndRedirect = async () => {
            try {
                const data: TypeInfo = await nodeApi.getTypeId(typeName)
                // optionnel : vous pourriez utiliser data.nom pour du tracking ou logging
                navigate(`/type/${data.id}`, { replace: true })
            } catch (err) {
                console.error(err)
                setError("Impossible de trouver la catégorie demandée.")
            }
        }

        fetchAndRedirect()
    }, [typeName, navigate])

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