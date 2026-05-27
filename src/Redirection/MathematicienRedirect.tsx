import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircularProgress, Container, Typography } from '@mui/material'
import { nodeApi } from '../services/api'
import {Mathematicien} from "../types/ApiTypes/mathematicien";


export const MathematicienRedirect = () => {
    const { mathematicienName } = useParams<{ mathematicienName: string }>()
    const navigate = useNavigate()

    useEffect(() => {
        if (!mathematicienName) {
            navigate('/404', { replace: true })
            return
        }

        const fetchAndRedirect = async () => {
            try {
                const data: Mathematicien = await nodeApi.getMathematicienId(mathematicienName)
                // optionnel : vous pourriez utiliser data.nom pour du tracking ou logging
                navigate(`/mathematicien/${data.id}`, { replace: true })
            } catch (err) {
                console.error(err)
                navigate('/404', { replace: true })
            }
        }

        fetchAndRedirect()
    }, [mathematicienName, navigate])

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