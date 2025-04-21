import React from 'react';
import {FormControl, OutlinedInput} from "@mui/material";

interface AliasEditProps {
  alias: string;
  index: number;
  onChange: (index: number, value: string) => void;
}

const AliasEdit: React.FC<AliasEditProps> = ({ alias, index, onChange }) => {
  return (
      <div className={"alias-edit-line"}>
      <form noValidate autoComplete="off">
          <FormControl sx={{ width: '25ch' }}>
              <OutlinedInput placeholder="Entrer l'alias"
                             value ={alias}
                             onChange={(e) => onChange(index, e.target.value)}/>
          </FormControl>
      </form>
      </div>
  );
};

export default AliasEdit;