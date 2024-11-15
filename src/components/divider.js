import React from 'react';
import {View} from 'react-native';

export default function Divider ({ orientation = 'horizontal', color = "bg-gray-400", className }) {
  const dividerStyles = [
    orientation === 'horizontal' ? 'w-full' : 'w-px',
    orientation === 'vertical' ? 'h-full' : 'h-px',
    color,
    className,
    "z-0"
  ];

  return <View className={dividerStyles.join(" ")} />;
};