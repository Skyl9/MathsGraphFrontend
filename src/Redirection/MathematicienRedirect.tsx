import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircularProgress, Container, Typography } from '@mui/material'
import { nodeApi } from '../services/api'
import {Mathematicien} from "../types/ApiTypes/mathematicien";


export const MathematicienRedirect = () => {
    const { mathematicienName } = useParams<{ mathematicienName: string }>()
    const navigate = useNavigate()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!mathematicienName) {
            setError("Type invalide.")
            return
        }

        const fetchAndRedirect = async () => {
            try {
                const data: Mathematicien = await nodeApi.getMathematicienId(mathematicienName)
                // optionnel : vous pourriez utiliser data.nom pour du tracking ou logging
                navigate(`/mathematicien/${data.id}`, { replace: true })
            } catch (err) {
                console.error(err)
                setError("Impossible de trouver la catégorie demandée.")
            }
        }

        fetchAndRedirect()
    }, [mathematicienName, navigate])

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