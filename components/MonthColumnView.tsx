import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-big-calendar";
import TimeGrid from "react-big-calendar/lib/TimeGrid";

export default function MonthColumnView({
  date,
  localizer,
  max = localizer.endOf(new Date(), "year"),
  min = localizer.startOf(new Date(), "year"),
  scrollToTime = localizer.startOf(new Date(), "year"),
  ...props
}) {
  const currRange = useMemo(
    () => MonthColumnView.range(date, { localizer }),
    [date, localizer]
  );

  return (
    <TimeGrid
      date={date}
      eventOffset={15}
      localizer={localizer}
      max={max}
      min={min}
      range={currRange}
      scrollToTime={scrollToTime}
      {...props}
    />
  );
}

MonthColumnView.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  localizer: PropTypes.object,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  scrollToTime: PropTypes.instanceOf(Date),
};

MonthColumnView.range = (date, { localizer }) => {
  const start = date;
  const end = localizer.add(start, 12, "month");

  let current = start;
  const range = [];

  while (localizer.lte(current, end, "month")) {
    //@ts-ignore
    range.push(current);
    current = localizer.add(current, 30, "day");
  }

  return range;
};

MonthColumnView.navigate = (date, action, { localizer }) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return localizer.add(date, -12, "month");

    case Navigate.NEXT:
      return localizer.add(date, 12, "month");

    default:
      return date;
  }
};

MonthColumnView.title = (date, { localizer }) => {
  const [start, ...rest] = MonthColumnView.range(date, { localizer });
  //return localizer.format({ start, end: rest.pop() }, "dayRangeHeaderFormat");
  return localizer.format(date, "YYYY");
};
