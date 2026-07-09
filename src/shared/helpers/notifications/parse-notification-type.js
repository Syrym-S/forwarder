export const parserNotificationType = (type) => {
  const parsedType = type.split(".");

  return {
    notification_type: parsedType[0],
    action: parsedType[1],
    id: parsedType[2],
  };
};
