// hooks/useIcon.js
import { useState, useEffect } from "react";
import * as AllIcons from "react-icons/all";
import { IoMdClose } from "react-icons/io";

const useIcon = (iconName) => {
  const [IconComponent, setIconComponent] = useState(() => IoMdClose);

  useEffect(() => {
    const loadIcon = () => {
      const Icon = AllIcons[iconName];

      if (!Icon) {
        console.error(`Icon "${iconName}" not found in react-icons.`);
        return;
      }

      setIconComponent(() => Icon);
    };

    loadIcon();
  }, [iconName]);

  return IconComponent;
};

export default useIcon;
