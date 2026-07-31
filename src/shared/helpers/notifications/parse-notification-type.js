export const parserNotificationType = (type) => {
  if (!type) return false;

  const parsedType = type.split(".");

  return {
    notification_type: parsedType[0],
    action: parsedType[1],
    id: parsedType[2],
  };
};
