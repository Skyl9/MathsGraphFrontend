import React from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, IconButton, Link, Box, CardActions } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/NodeDetails.css';

interface NodeDetailsProps {
    position: [number, number, number];
    nom: string;
    typeMath: string;
    id: number;
    onClose: () => void; // Typage précis pour onClose
}

export default function NodeDetails({ position, nom, typeMath, id, onClose }: NodeDetailsProps) {
    return (
        <Html position={position}>
            <motion.div
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
            >
                <Card sx={{ minWidth: 250}}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                    <CardContent style={{ position: 'relative' }}> {/* Position relative pour le positionnement absolu */}


                            {id ? (
                                    <Typography variant="h6" component="h5">{nom}</Typography>
                            ) : (
                                <Typography variant="h6" component="h5">{nom}</Typography>
                            )}
                            <Typography variant="body2" color="text.secondary">Type : {typeMath}</Typography>

                    </CardContent>
                    <CardActions>
                        <Link href={`/node/${id}`} aria-label={`Details for node ${nom}`} >Plus</Link>
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                             // Positionnement du bouton
                        >
                            <CloseIcon />
                        </IconButton>
                    </CardActions>
                </Box>
                </Card>
            </motion.div>
        </Html>
    );
}