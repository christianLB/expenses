import { useState, useEffect } from "react";
import * as _ from "lodash";

const useCollapsedState = (expensesResult) => {
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    const collapsedDefault = _.zipObject(
      _.keys(expensesResult),
      Array(Object.keys(expensesResult).length).fill(true)
    );
    setCollapsed(collapsedDefault);
  }, [expensesResult]);

  return [collapsed, setCollapsed];
};

export default useCollapsedState;
