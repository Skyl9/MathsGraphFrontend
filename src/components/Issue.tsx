import React from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

// Remplacez par l'URL de création d'issue de votre repo
const GITHUB_ISSUE_URL = "https://github.com/Skyl9/MathsGraphFrontend/issues";

export const ReportIssueButton: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Button
      variant="outlined"
      color="secondary"
      href={GITHUB_ISSUE_URL}
      target="_blank"
      rel="noreferrer"
      sx={{ textTransform: "none" }}
    >
      {t("common.report_issue")}
    </Button>
  );
};
