import React from 'react'
import { Button } from '@mui/material'

// Remplacez par l'URL de création d'issue de votre repo
const GITHUB_ISSUE_URL = 'https://github.com/Skyl9/MathsGraphFrontend/issues'

export const ReportIssueButton: React.FC = () => (
    <Button
        variant="outlined"
        color="secondary"
        href={GITHUB_ISSUE_URL}
        target="_blank"
        rel="noreferrer"
        sx={{ textTransform: 'none' }}
    >
        Signaler un problème
    </Button>
)