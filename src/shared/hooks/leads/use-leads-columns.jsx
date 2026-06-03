import { NavLink } from "react-router-dom";

const useLeadsColumns = (data) => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 200,
      renderCell: (row) => (
        <NavLink
          to={`/lead-item/${row.id}`}
          style={{
            textDecoration: "none",
          }}
        >
          {row.id}
        </NavLink>
      ),
    },
    { field: "status", headerName: "Статус", width: 200 },
    { field: "num", headerName: "Номер", width: 200 },
    {
      field: "driver",
      headerName: "Driver",
      width: 200,
    },
    {
      field: "to_location",
      headerName: "Куда",
      width: 200,
    },
    {
      field: "from_location",
      headerName: "Откуда",
      width: 200,
    },
  ];

  return columns;
};

export default useLeadsColumns;
