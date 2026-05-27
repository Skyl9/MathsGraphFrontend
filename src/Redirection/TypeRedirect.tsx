import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CircularProgress, Container, Typography } from '@mui/material'
import { nodeApi } from '../services/api'
import {Type} from "../types/ApiTypes/type";


export const TypeRedirect = () => {
    const { typeName } = useParams<{ typeName: string }>()
    const navigate = useNavigate()

    useEffect(() => {
        if (!typeName) {
            navigate('/404', { replace: true })
            return
        }

        const fetchAndRedirect = async () => {
            try {
                const data: Type = await nodeApi.getTypeId(typeName)
                // optionnel : vous pourriez utiliser data.nom pour du tracking ou logging
                navigate(`/type/${data.id}`, { replace: true })
            } catch (err) {
                console.error(err)
                navigate('/404', { replace: true })
            }
        }

        fetchAndRedirect()
    }, [typeName, navigate])

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