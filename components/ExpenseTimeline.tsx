import React, { useMemo } from "react";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import MonthColumnView from "./MonthColumnView.tsx";
//...
const views = {
  month: true,
  year: MonthColumnView,
  day: true,
};

const localizer = momentLocalizer(moment);

const ExpenseTimeline = ({ expenses }) => {
  const events = expenses?.map((expense) => ({
    start: new Date(expense.date),
    end: new Date(expense.dueDate),
    title: expense.name,
    resourceId: 1,
  }));

  return (
    <Calendar
      localizer={localizer}
      defaultDate={new Date()}
      defaultView="month"
      events={events}
      style={{ height: 500 }}
      views={views}
    />
  );
};

export default ExpenseTimeline;
