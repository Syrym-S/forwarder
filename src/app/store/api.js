import axios from "axios";

export const getLeads = async () => {
  const data = await axios.get("http://localhost:3000/leads");

  return data;
};
