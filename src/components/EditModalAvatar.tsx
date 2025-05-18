import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

interface EditModalAvatarProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (avatarUrl: string) => void;
}

export const EditModalAvatar: React.FC<EditModalAvatarProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    onSubmit,
                                                                }) => {
    const [avatarUrl, setAvatarUrl] = useState("");

    const handleSubmit = () => {
        onSubmit(avatarUrl);
        setAvatarUrl(""); // Reset input après submit
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute" as const,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    minWidth: 300,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Ajouter un lien vers une photo de profil (Vérifier bien que le lien possède la bonne extension à la fin)
                </Typography>
                <TextField
                    label="URL de l'avatar"
                    fullWidth
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={!avatarUrl}>
                        Valider
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};