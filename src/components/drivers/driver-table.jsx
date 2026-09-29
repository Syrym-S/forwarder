import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useEffect, useRef, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import BlockDriverModal from "./block-driver-modal";
import useDriversColumns from "../../shared/hooks/drivers/use-drivers-column";

const DriversTable = ({
  drivers,
  setSelectedDriver,
  handleBanDriver,
}) => {
  const apiRef = useGridApiRef();
  const tableRef = useRef(null);
  const [driverToBlock, setDriverToBlock] = useState(null);
  const [copyNotice, setCopyNotice] = useState(null);

  useEffect(() => {
    apiRef.current.unstable_setColumnVirtualization(false);
  }, [apiRef]);

  useEffect(() => {
    const table = tableRef.current;
    const scroller = table.querySelector(".MuiDataGrid-virtualScroller");
    if (!scroller) return;

    const updateDivider = () => {
      const remaining =
        scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
      table.dataset.showPinnedDivider = String(remaining > 1);
    };

    const observer = new ResizeObserver(updateDivider);
    observer.observe(scroller);
    const content = scroller.querySelector(
      ".MuiDataGrid-virtualScrollerContent",
    );
    if (content) observer.observe(content);
    table.addEventListener("scroll", updateDivider, true);
    updateDivider();

    return () => {
      observer.disconnect();
      table.removeEventListener("scroll", updateDivider, true);
    };
  }, []);

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyNotice({ severity: "success", message: "Ссылка скопирована" });
    } catch {
      setCopyNotice({
        severity: "error",
        message: "Не удалось скопировать ссылку",
      });
    }
  };
  const columns = useDriversColumns(
    setSelectedDriver,
    setDriverToBlock,
    handleCopyLink,
  );

  return (
    <Paper
      ref={tableRef}
      sx={{
        my: "10px",
        '&[data-show-pinned-divider="true"] .driver-link-cell, &[data-show-pinned-divider="true"] .driver-link-header':
          {
            boxShadow: "-2px 0 4px rgba(0, 0, 0, 0.08)",
          },
      }}
    >
      {driverToBlock && (
        <BlockDriverModal
          driver={driverToBlock}
          onConfirm={handleBanDriver}
          onClose={() => setDriverToBlock(null)}
        />
      )}
      <DataGrid
        apiRef={apiRef}
        rows={drivers}
        getRowId={(row) => row.id}
        getRowClassName={({ row }) =>
          row.in_black_list === true ? "driver-blocked" : ""
        }
        columns={columns}
        checkboxSelection
        sx={{
          border: 0,
          boxShadow: 0,
          minHeight: "80vh",
          "& .driver-actions-cell, & .driver-actions-header, & .driver-link-cell, & .driver-link-header":
            {
              position: "sticky",
              right: 0,
              zIndex: 2,
              boxShadow: "none",
              borderLeft: 0,
              borderRight: 0,
            },
          "& .driver-link-header .MuiDataGrid-columnSeparator, & .driver-actions-header .MuiDataGrid-columnSeparator":
            {
              display: "none",
            },
          "& .driver-link-cell, & .driver-link-header": {
            right: 110,
          },
          "& .driver-actions-cell, & .driver-link-cell": {
            backgroundColor: "inherit",
          },
          "& .driver-actions-header, & .driver-link-header": {
            backgroundColor: "background.paper",
            zIndex: 3,
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: "#f5f7fa",
          },

          "& .MuiDataGrid-row:nth-of-type(odd)": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-row.driver-blocked": {
            backgroundColor: "#fff1f0",
            "&:hover": {
              backgroundColor: "#ffe4e2",
            },
          },
        }}
        localeText={{
          noRowsLabel: "Список водителей пуст",
        }}
      />
      <Snackbar
        open={!!copyNotice}
        autoHideDuration={3000}
        onClose={() => setCopyNotice(null)}
      >
        <Alert
          severity={copyNotice?.severity || "success"}
          onClose={() => setCopyNotice(null)}
        >
          {copyNotice?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DriversTable;
