import { Link } from "@mui/material";
import React from "react";
import { Tag } from "../../types/types";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

interface TagProps {
  tags: Tag[] | null;
}

const TagField: React.FC<TagProps> = ({ tags }) => {
  return (
    <FieldWrapper>
      <FieldTitle>Tags :</FieldTitle>
      <FieldContent>
        {tags && tags.length > 0
          ? tags.map((tag) => (
              <Link key={tag.id} href={"/tag/" + tag.id}>
                <div>{tag.tag}</div>
              </Link>
            ))
          : "Aucun Tag"}
      </FieldContent>
    </FieldWrapper>
  );
};

export default TagField;
