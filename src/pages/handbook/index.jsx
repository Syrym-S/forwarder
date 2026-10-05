import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useOptionsStore } from "../../app/store/options";
import RootLayout from "../../components/layout/root-layout";

const Handbook = () => {
  const tnvedOptions = useOptionsStore((state) => state.tnvedOptions);
  const getLTNVEDOptions = useOptionsStore((state) => state.getLTNVEDOptions);
  const tnvedCount = useOptionsStore((state) => state.tnvedCount);
  const isLoading = useOptionsStore((state) => state.isTNVEDLoading);
  const error = useOptionsStore((state) => state.tnvedError);
  const [search, setSearch] = useState("");
  const [request, setRequest] = useState(null);
  const { query = "", page = 1 } = request ?? {};
  const pendingSearch = search.trim() !== query;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRequest((previous) =>
        search.trim() === (previous?.query ?? "")
          ? previous
          : search.trim() ? { query: search.trim(), page: 1 } : null,
      );
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const rows = useMemo(() => {
    const items = Array.isArray(tnvedOptions)
      ? tnvedOptions
      : (tnvedOptions?.results ??
        tnvedOptions?.items ??
        tnvedOptions?.data ??
        []);
    return flattenRows(Array.isArray(items) ? items : []);
  }, [tnvedOptions]);
  const perPage = Number(tnvedOptions?.per_page) || 100;
  const totalPages = Math.max(1, Math.ceil(tnvedCount / perPage));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (request === null) {
      getLTNVEDOptions();
      return;
    }
    getLTNVEDOptions({ page: request.page, q: request.query });
  }, [request, getLTNVEDOptions]);

  return (
    <RootLayout withoutDataCheck>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Справочник ТН ВЭД
      </Typography>
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          setRequest(search.trim() ? { query: search.trim(), page: 1 } : null);
        }}
        sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
      >
        <TextField
          label="Код или наименование"
          size="small"
          value={search}
          onChange={(event) => {
            const value = event.target.value;
            setSearch(value);
            if (!value.trim()) setRequest(null);
          }}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          Найти
        </Button>
        <Button
          disabled={isLoading || (!search && !query)}
          onClick={() => {
            setSearch("");
            setRequest(null);
          }}
        >
          Сбросить
        </Button>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        aria-busy={isLoading}
        sx={{ border: "1px solid #dce3ed", borderRadius: 2, boxShadow: "none" }}
      >
        {isLoading && <LinearProgress />}
        <Table
          aria-label="Справочник ТН ВЭД"
          sx={{
            "& .MuiTableCell-root": {
              color: "#00366a",
              borderColor: "#e3eaf3",
              px: 2.5,
              py: 2.5,
            },
            "& .MuiTableCell-head": {
              bgcolor: "#f0f4f9",
              color: "#61788f",
              fontWeight: 600,
            },
            "& .MuiTableRow-root:last-child .MuiTableCell-body": {
              borderBottom: 0,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: { xs: 150, md: 300 } }}>Код</TableCell>
              <TableCell>Наименование</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading && !error && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  {query ? "Ничего не найдено" : "Справочник пуст"}
                </TableCell>
              </TableRow>
            )}
            {!error &&
              rows.map((row) => (
                <TableRow
                  key={row.key}
                  hover
                  sx={{
                    bgcolor: row.isParent ? "#f5f5f5" : "background.paper",
                  }}
                >
                  <TableCell
                    sx={{ whiteSpace: "nowrap", verticalAlign: "top" }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        ml: row.depth * 3.75,
                        pl: row.depth ? 1.25 : 0,
                        borderLeft: row.depth ? "2px solid #dce3ed" : "none",
                        fontWeight: row.isParent ? 600 : 400,
                      }}
                    >
                      {row.code ?? "—"}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: row.isParent ? 600 : 400,
                    }}
                  >
                    {row.name}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!error && tnvedCount > 0 && (
        <Pagination
          shape="rounded"
          page={currentPage}
          count={totalPages}
          disabled={isLoading || pendingSearch}
          onChange={(_, nextPage) => setRequest({ query, page: nextPage })}
          sx={{
            width: "fit-content",
            mx: "auto",
            mt: 2,
            "& .MuiPaginationItem-root": {
              color: "#1F2937",
              fontWeight: 500,
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "primary.main",
              color: "#fff",
              "&:hover": {
                backgroundColor: "primary.main",
              },
            },
          }}
        />
      )}
    </RootLayout>
  );
};

export default Handbook;

function flattenRows(items, depth = 0, parentKey = "") {
  return items.flatMap((item, index) => {
    const key = `${parentKey}/${item.id ?? item.code ?? index}-${index}`;
    const children = [
      "groups",
      "positions",
      "subpositions",
      "codes",
      "children",
    ].flatMap((field) => (Array.isArray(item[field]) ? item[field] : []));
    const childRows = flattenRows(children, depth + 1, key);

    return [
      {
        ...item,
        depth,
        key,
        isParent: children.length > 0,
      },
      ...childRows,
    ];
  });
}
