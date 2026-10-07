import { Box, Chip } from "@mui/material";
import { useEffect, useRef } from "react";

const FloatingFilePreview = ({ file, disabled, onRemove }) => {
  const imageRef = useRef(null);
  useEffect(() => {
    if (!file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    if (imageRef.current) imageRef.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, maxWidth: "100%" }}>
    {file.type.startsWith("image/") && <Box component="img" ref={imageRef} alt={file.name} sx={{ width: 36, height: 36, objectFit: "cover", borderRadius: 1 }} />}
    <Chip label={file.name} size="small" disabled={disabled} onDelete={onRemove} sx={{ maxWidth: "calc(100% - 40px)" }} />
  </Box>;
};

export default FloatingFilePreview;
