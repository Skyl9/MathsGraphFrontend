import React from "react";
import { FormControl, OutlinedInput } from "@mui/material";
import { useTranslation } from "react-i18next";

interface AliasEditProps {
  alias: string;
  index: number;
  onChange: (index: number, value: string) => void;
}

const AliasEdit: React.FC<AliasEditProps> = ({ alias, index, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className={"alias-edit-line"}>
      <form noValidate autoComplete="off">
        <FormControl sx={{ width: "25ch" }}>
          <OutlinedInput
            placeholder={t("alias.placeholder")}
            value={alias}
            onChange={(e) => onChange(index, e.target.value)}
          />
        </FormControl>
      </form>
    </div>
  );
};

export default AliasEdit;
