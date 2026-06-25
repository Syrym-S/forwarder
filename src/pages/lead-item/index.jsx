import React, { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { LeadDocumentsSection } from "../../components/leads/documents/LeadDocumentsSection";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import AddLeadForm from "../../features/leads/add-lead-form";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import LeadMap from "../../components/leads/lead-map";
import { getLeadFilesApi, uploadLeadFileApi } from "../../app/store/leads/api";
import { mapLeadFilesResponseFromApi } from "../../features/leads/model/lead-files.adapter";
import Loader from "../../components/layout/loader";
import RenderStatus from "../../shared/ui/render-status";
import LeadHeading from "../../components/leads/lead-item/lead-heading";
import LeadCustomerInfo from "../../components/leads/lead-item/lead-customer-info";
import LeadRouteInfo from "../../components/leads/lead-item/lead-route-info";
import LeadCargoInfo from "../../components/leads/lead-item/lead-cargo-info";
import CargoLoadVerification from "../../components/leads/lead-item/cargo-load-verification";
import LeadDriverInfo from "../../components/leads/lead-item/lead-driver-info";
import Section from "../../shared/ui/section";
import CargoUnloadVerification from "../../components/leads/lead-item/cargo-unload-verification";
import { STATUS } from "../../shared/const/tenders";
import { useLeadsStore } from "../../app/store/leads/leads-store";

const LeadItem = () => {
  const { id } = useParams();

  const [openEdit, setOpenEdit] = useState(false);

  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const leadData = useLeadsStore((state) => state.currentLead);
  const files = useLeadsStore((state) => state.files);
  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);
  const deleteLeadFile = useLeadsStore((state) => state.deleteLeadFile);
  const verifyCargo = useLeadsStore((state) => state.verifyCargo);
  const rejectCargo = useLeadsStore((state) => state.rejectCargo);
  const verifyCargoUnload = useLeadsStore((state) => state.verifyCargoUnload);
  const rejectCargoUnload = useLeadsStore((state) => state.rejectCargoUnload);
  const confirmLeadDelivery = useLeadsStore(
    (state) => state.confirmLeadDelivery,
  );

  const cargoActions = leadData?.cargo_actions[0];
  const filesFromDriver = cargoActions?.files;
  const isVerified = cargoActions?.is_verified;

  const uploadCargoActions = leadData?.cargo_actions[1];
  const filesFromDriverToUnload = uploadCargoActions?.files;
  const isUnloadVerified = uploadCargoActions?.is_verified;

  const defaultValues = useFormDefaultValues(leadData, files);

  const [documents, setDocuments] = useState([]);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [documentError, setDocumentError] = useState("");
  const [deletingDocumentIds, setDeletingDocumentIds] = useState([]);

  const openEditForm = () => {
    setOpenEdit(true);
  };

  useEffect(() => {
    getLeadItem(id);
    getLeadFiles(id);
  }, [id]);

  const from = {
    lat: leadData?.from_location.lat,
    lon: leadData?.from_location.lon,
  };
  const to = {
    lat: leadData?.to_location.lat,
    lon: leadData?.to_location.lon,
  };

  async function reloadLeadDocuments(leadId) {
    const response = await getLeadFilesApi(leadId);
    const mappedDocuments = mapLeadFilesResponseFromApi(response);

    setDocuments(mappedDocuments);
  }

  async function handleAddDocument({ name, context, file }) {
    if (!id || !file) return;

    try {
      setIsDocumentUploading(true);
      setDocumentError("");

      await uploadLeadFileApi(id, {
        file,
        name,
        context,
      });

      await reloadLeadDocuments(id);
      await getLeadFiles(id);
    } catch (error) {
      setDocumentError(
        error.response?.data?.message ||
          error.message ||
          "Не удалось загрузить документ",
      );
    } finally {
      setIsDocumentUploading(false);
    }
  }

  const handleDeleteFileFromDB = async (lead_id, file_path) => {
    await deleteLeadFile(lead_id, file_path);
    await getLeadFiles(lead_id);
  };

  const handleVerifyCargo = async () => {
    await verifyCargo(id);
    await getLeadItem(id);
  };

  const handleRejectCargo = async () => {
    await rejectCargo(id);
    await getLeadItem(id);
  };

  const handleVerifyCargoUnload = async () => {
    await verifyCargoUnload(id);
    await getLeadItem(id);
  };

  const handleRejectCargoUnload = async () => {
    await rejectCargoUnload(id);
    await getLeadItem(id);
  };

  const handleConfirmDelivery = async () => {
    await confirmLeadDelivery(id);
    await getLeadItem(id);
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadDocuments() {
      if (!id) {
        return;
      }

      try {
        setDocumentError("");

        const response = await getLeadFilesApi(id);
        const mappedDocuments = mapLeadFilesResponseFromApi(response);

        if (!isCancelled) {
          setDocuments(mappedDocuments);
        }
      } catch (error) {
        if (!isCancelled) {
          setDocuments([]);
          setDocumentError(
            error.response?.data?.message ||
              error.message ||
              "Не удалось загрузить документы",
          );
        }
      }
    }

    loadDocuments();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (!leadData) return <Loader />;

  return (
    <RootLayout data={leadData}>
      <LeadHeading leadData={leadData} openEditForm={openEditForm} />

      <AddLeadForm
        editingItemId={id}
        openForm={openEdit}
        setOpenForm={setOpenEdit}
        initialValues={defaultValues}
        isEdit
      />

      <LeadMap from={from} to={to} id={id} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LeadCustomerInfo leadData={leadData} />

        <LeadRouteInfo leadData={leadData} />

        <LeadCargoInfo leadData={leadData} />

        {filesFromDriver && (
          <CargoLoadVerification
            filesFromDriver={filesFromDriver}
            isVerified={isVerified}
            handleVerifyCargo={handleVerifyCargo}
            handleRejectCargo={handleRejectCargo}
          />
        )}

        {filesFromDriverToUnload && (
          <CargoUnloadVerification
            isUnloadVerified={isUnloadVerified}
            filesFromDriverToUnload={filesFromDriverToUnload}
            handleVerifyCargoUnload={handleVerifyCargoUnload}
            handleRejectCargoUnload={handleRejectCargoUnload}
          />
        )}

        <LeadDriverInfo leadData={leadData} />

        <Section
          title="Документы"
          icon={<DescriptionOutlinedIcon color="primary" />}
        >
          <LeadDocumentsSection
            documents={files}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteFileFromDB}
            isUploading={isDocumentUploading}
            uploadError={documentError}
            deletingDocumentIds={deletingDocumentIds}
          />
        </Section>

        {leadData.status === STATUS.verification_unloading && (
          <Button
            color="error"
            variant="outlined"
            onClick={handleConfirmDelivery}
          >
            Завершить рейс
          </Button>
        )}
      </Container>
    </RootLayout>
  );
};

export default LeadItem;
