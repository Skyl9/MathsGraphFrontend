import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

interface AvatarEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (avatarUrl: string) => void;
}

export const AvatarEditModal: React.FC<AvatarEditModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const { t } = useTranslation();

  const handleSubmit = () => {
    onSubmit(avatarUrl);
    setAvatarUrl(""); // Reset input après submit
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-avatar-title">
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
        <Typography id="modal-avatar-title" variant="h6" gutterBottom>
          {t("avatar_edit.instruction")}
        </Typography>
        <TextField
          label={t("avatar_edit.url_label")}
          fullWidth
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!avatarUrl}
          >
            {t("common.validate")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
