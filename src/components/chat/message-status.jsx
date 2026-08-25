import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const MessageStatus = ({ is_arrived, is_viewed }) => {
  if (is_arrived) {
    return (
      <DoneAllIcon
        color={is_viewed ? "primary" : ""}
        sx={{
          fontSize: 16,
        }}
      />
    );
  }

  return (
    <DoneIcon
      sx={{
        fontSize: 16,
        color: "text.secondary",
      }}
    />
  );
};

export default MessageStatus;
