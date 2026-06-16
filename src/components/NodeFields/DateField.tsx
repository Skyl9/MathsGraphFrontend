import React from "react";
import dayjs from "dayjs";
import { FieldWrapper, FieldTitle, FieldContent } from "./NodeField.styles";

interface DateFieldProps {
  date: string;
  title?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  date,
  title = "Date dernière modification",
}) => {
  const formattedDate = dayjs(date).format("DD-MM-YYYY HH:mm:ss");

  return (
    <FieldWrapper>
      <FieldTitle>{title} :</FieldTitle>
      <FieldContent>{formattedDate}</FieldContent>
    </FieldWrapper>
  );
};

export default DateField;
