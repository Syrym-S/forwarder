import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import CreateFactoringForm from "../../features/factoring/create-factoring-form";
import { Box, Button, Pagination, Tab, Tabs } from "@mui/material";
import { useFactoringStore } from "../../app/store/factoring/factoring-store";
import FactoringCard from "../../components/factoring/factoring-card";
import Loader from "../../components/layout/loader";
import FactoringTable from "../../components/factoring/factoring-table";
import { VIEWS } from "../../shared/const/leads";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewTabs from "../../shared/ui/view-tabs";

const Factoring = () => {
  const factorings = useFactoringStore((state) => state.factorings);
  const isLoading = useFactoringStore((state) => state.isLoading);
  const getFactorings = useFactoringStore((state) => state.getFactorings);
  const count = useFactoringStore((state) => state.count);
  const perPage = useFactoringStore((state) => state.perPage);

  const [openFormModal, setOpenFormModal] = useState(false);
  const [view, setView] = useState(VIEWS.table);
  const [page, setPage] = useState(1);

  const PAGE_COUNT = Math.ceil(count / perPage);
  const isCradsView = view === VIEWS.cards;

  const handleModalOpen = () => {
    setOpenFormModal(true);
  };

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleModalClose = () => {
    setOpenFormModal(false);
  };

  useEffect(() => {
    getFactorings({
      page: page,
    });
  }, [page]);

  if (isLoading) return <Loader />;

  return (
    <RootLayout withoutDataCheck>
      <ViewTabs
        view={view}
        setView={setView}
        handleOpenForm={handleModalOpen}
      />

      {isCradsView && (
        <Box
          sx={{
            width: "60%",
            mx: "auto",
            display: "grid",
            gap: 2,
            gridTemplateColumns: "1fr",
          }}
        >
          {factorings.map((factoring) => (
            <FactoringCard factoring={factoring} key={factoring.index} />
          ))}
        </Box>
      )}

      {!isCradsView && <FactoringTable factorings={factorings} />}

      <Pagination
        sx={{
          mx: "auto",
          width: isCradsView ? "60%" : "100%",
        }}
        page={page}
        count={PAGE_COUNT}
        onChange={handlePageChange}
      />

      <CreateFactoringForm
        openFormModal={openFormModal}
        handleModalClose={handleModalClose}
      />
    </RootLayout>
  );
};

export default Factoring;
