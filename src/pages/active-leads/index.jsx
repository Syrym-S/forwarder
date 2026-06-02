import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import axios from "axios";
import { useLeadsStore } from "../../app/store/leads-store";
import LeadCard from "../../components/leads/lead-card";
import { Box } from "@mui/material";

const ActiveLeads = () => {
  const { leads, isLoading, fetchLeads } = useLeadsStore();

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    console.log(leads);
  }, [leads]);

  if (isLoading) return <>...Загрузка</>;

  return (
    <RootLayout data={leads}>
      <Box
        sx={{
          display: "grid",
          padding: "40px",
          gap: 5,
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {leads.map((lead) => (
          <LeadCard lead={lead} />
        ))}
      </Box>
    </RootLayout>
  );
};

export default ActiveLeads;
