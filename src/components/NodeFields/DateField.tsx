import React from 'react';
import dayjs from 'dayjs';

interface DateFieldProps {
  date: string;
  title?: string;
}

const DateField: React.FC<DateFieldProps> = ({ date, title = "Date dernière modification" }) => {
  const formattedDate = dayjs(date).format('DD-MM-YYYY HH:mm:ss');
  
  return (
    <div className="node-wrapper">
      <div className="field-title">{title} :</div>
      <div className="field-content">
        {formattedDate}
      </div>
    </div>
  );
};

export default DateField;