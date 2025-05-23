import { Link } from '@mui/material';
import React from 'react';
import {Tag} from "../../types/types";

interface AliasesFieldProps {
  tags: Tag[];
}

const TagField: React.FC<AliasesFieldProps> = ({ tags}) => {
  return (
    <div className="node-wrapper">
      <div className="field-title">Tags :</div>
      <div className="field-content">
        {tags.length > 0
          ? tags.map((tag, index) => (
              <Link href={"/tag/"+tag.id}>
              <div key={index}>{tag.tag}</div>
              </Link>
            ))
          : "Aucun alias"}
      </div>
    </div>
  );
};

export default TagField;