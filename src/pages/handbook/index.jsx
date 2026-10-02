import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
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
  const isLoading = useOptionsStore((state) => state.isTNVEDLoading);
  const error = useOptionsStore((state) => state.tnvedError);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const items = Array.isArray(tnvedOptions)
    ? tnvedOptions
    : (tnvedOptions?.results ??
      tnvedOptions?.items ??
      tnvedOptions?.data ??
      []);
  const rows = flattenRows(Array.isArray(items) ? items : [], query);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / 100));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = rows.slice((currentPage - 1) * 100, currentPage * 100);
  const hasNextPage = currentPage < totalPages;

  useEffect(() => {
    getLTNVEDOptions();
  }, [getLTNVEDOptions]);
  return (
    <RootLayout withoutDataCheck>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Справочник ТН ВЭД
      </Typography>
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          setQuery(search.trim());
        }}
        sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
      >
        <TextField
          label="Код или наименование"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />
        <Button type="submit" variant="contained" disabled={isLoading}>
          Найти
        </Button>
        <Button
          disabled={isLoading || (!search && !query)}
          onClick={() => {
            setSearch("");
            setQuery("");
            setPage(1);
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
      {!error && !isLoading && (
        <Typography variant="body2" sx={{ mb: 2, color: "#00366a" }}>
          Найдено записей: {total ?? rows.length}. Родительские группы
          отображаются перед дочерними записями.
        </Typography>
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
              visibleRows.map((row) => (
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={isLoading || currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
        >
          Назад
        </Button>
        <Typography variant="body2">
          Страница {currentPage}
          {totalPages > 0 ? ` из ${totalPages}` : ""} · По 100 записей
        </Typography>
        <Button
          disabled={isLoading || !!error || !hasNextPage}
          onClick={() => setPage(currentPage + 1)}
        >
          Далее
        </Button>
      </Box>
    </RootLayout>
  );
};

export default Handbook;

function flattenRows(items, query = "", depth = 0, parentKey = "", parentMatches = false) {
  const normalizedQuery = query.toLocaleLowerCase("ru");
  return items.flatMap((item, index) => {
    const key = `${parentKey}/${item.id ?? item.code ?? index}-${index}`;
    const children = ["groups", "positions", "subpositions", "codes", "children"]
      .flatMap((field) => Array.isArray(item[field]) ? item[field] : []);
    const matches = parentMatches || !normalizedQuery ||
      String(item.code ?? "").toLocaleLowerCase("ru").includes(normalizedQuery) ||
      String(item.name ?? "").toLocaleLowerCase("ru").includes(normalizedQuery);
    const childRows = flattenRows(children, query, depth + 1, key, matches);
    if (!matches && childRows.length === 0) return [];

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
