import React from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  MathCard,
  MathCardHeader,
  MathCardTitle,
  MathCardBody,
} from "../pages/NodePage.styles";
import { useTranslation } from "react-i18next";

interface SectionCardProps {
  title: string;
  cardtype?: "enonce" | "proof" | "default";
  variantcolor?: "primary" | "secondary" | "default";
  isEditable?: boolean;
  onEdit?: () => void;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  cardtype = "default",
  variantcolor = "default",
  isEditable = false,
  onEdit,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <MathCard cardtype={cardtype}>
      <MathCardHeader>
        <MathCardTitle variantcolor={variantcolor} variant="h6" component="h2">
          {title}
        </MathCardTitle>
        {isEditable && onEdit && (
          <IconButton
            aria-label={t("common.aria.action_button")}
            size="small"
            onClick={onEdit}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </MathCardHeader>
      <MathCardBody>{children}</MathCardBody>
    </MathCard>
  );
};
