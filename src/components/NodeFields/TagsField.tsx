import { Link } from '@mui/material';
import React from 'react';
import {Tag} from "../../types/types";

interface TagProps {
  tags: Tag[]|null;
}

const TagField: React.FC<TagProps> = ({ tags}) => {
    return (
    <div className="node-wrapper">
      <div className="field-title">Tags :</div>
      <div className="field-content">
        {tags && tags.length > 0
          ? tags.map((tag) => (
              <Link key={tag.id} href={"/tag/"+tag.id}>
              <div >{tag.tag}</div>
              </Link>
            ))
          : "Aucun Tag"}
      </div>
    </div>
  );
};

export default TagField;