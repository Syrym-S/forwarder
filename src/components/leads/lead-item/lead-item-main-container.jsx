import { useParams } from "react-router-dom";
import LeadMap from "../lead-map";
import { Box, Button, CircularProgress } from "@mui/material";
import LeadCustomerInfo from "./lead-customer-info";
import LeadRouteInfo from "./lead-route-info";
import Section from "../../../shared/ui/section";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LeadCargoInfo from "./lead-cargo-info";
import LeadCargoFilesContainer from "../lead-cargo-files-container";
import LeadDriverInfo from "./lead-driver-info";
import { useEffect, useState } from "react";
import { uploadLeadFileApi } from "../../../app/store/leads/api";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { LeadDocumentsSection } from "../documents/LeadDocumentsSection";
import { STATUS } from "../../../shared/const/tenders";
import RenderErrorContext from "../../../shared/ui/errors/render-error-context";
import { LeadDocumentCard } from "../documents/LeadDocumentCard";

const LeadItemMainContainer = ({
  leadData,
  documentError,
  setDocumentError,
}) => {
  const { id } = useParams();

  const files = useLeadsStore((state) => state.files);
  const avrDocument = useLeadsStore((state) => state.avrDocument);
  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const deleteLeadFile = useLeadsStore((state) => state.deleteLeadFile);
  const isConfirmLoading = useLeadsStore((state) => state.isConfirmLoading);
  const confirmLeadDelivery = useLeadsStore(
    (state) => state.confirmLeadDelivery,
  );
  const generateAvrDocument = useLeadsStore(
    (state) => state.generateAvrDocument,
  );
  const isGenerateAvrLoading = useLeadsStore(
    (state) => state.isGenerateAvrLoading,
  );
  const isSignAvrLoading = useLeadsStore((state) => state.isSignAvrLoading);
  const signAvrDocument = useLeadsStore((state) => state.signAvrDocument);
  const getAvrDocument = useLeadsStore((state) => state.getAvrDocument);
  const error = useLeadsStore((state) => state.error);

  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [deletingDocumentIds, setDeletingDocumentIds] = useState([]);

  const leadPoints = [
    leadData?.from_location,
    ...(leadData?.waypoints || []),
    leadData?.to_location,
  ];

  const cargosCount = leadData?.cargos?.length;
  const isEditableStatus =
    leadData?.status !== STATUS.finished && leadData?.status !== STATUS.deleted;
  const isAllPassed = leadPoints.every((item) => item?.is_passed);

  const from = {
    lat: leadData?.from_location.lat,
    lon: leadData?.from_location.lon,
  };
  const to = {
    lat: leadData?.to_location.lat,
    lon: leadData?.to_location.lon,
  };

  const waypoints = leadData?.waypoints?.map((waypoint) => {
    return {
      lat: waypoint.lat,
      lon: waypoint.lon,
    };
  });

  async function reloadLeadDocuments(leadId) {
    await getLeadFiles(leadId);
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

  const handleConfirmDelivery = async () => {
    await confirmLeadDelivery(id);
    await getLeadItem(id);
  };

  const handleGenerateAvrDocument = async () => {
    await generateAvrDocument(id);
  };

  const handleSignAvrDocument = async () => {
    const response = await signAvrDocument(id);
    const link = response.data.sign_url;

    window.open(link, "_blank");
  };

  useEffect(() => {
    if (leadData.status === STATUS.finished) {
      getAvrDocument(id);
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          boxShadow: 1,
          borderRadius: 2,
          overflow: "hidden",
          my: 3,
        }}
      >
        <LeadMap waypoints={waypoints} from={from} to={to} id={id} />
      </Box>
      {leadData.status === STATUS.finished && (
        <Box
          sx={{
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              my: 1,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGenerateAvrDocument}
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              {isGenerateAvrLoading && <CircularProgress size={12} />}
              Сгенерировать AVR документ для подписи
            </Button>

            <Button
              variant="outlined"
              color="primary"
              onClick={handleSignAvrDocument}
            >
              {isSignAvrLoading && <CircularProgress size={12} />}
              Подписать документ
            </Button>
          </Box>
          {error && <RenderErrorContext error={error} />}

          <Box
            sx={{
              width: "30%",
            }}
          >
            <LeadDocumentCard document={avrDocument?.document} />
          </Box>
        </Box>
      )}
      <LeadRouteInfo leadData={leadData} />

      <LeadCustomerInfo leadData={leadData} />

      <Section
        title={`Груз`}
        icon={<LocalShippingOutlinedIcon color="primary" />}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
          }}
        >
          {leadData?.cargos?.map((cargo, index) => (
            <LeadCargoInfo
              cargosCount={cargosCount}
              cargo={cargo}
              lead={leadData}
              index={index}
              isLeadsPage
            />
          ))}
        </Box>
      </Section>

      <LeadCargoFilesContainer
        leatData={leadData}
        cargoActions={leadData?.cargo_actions}
      />

      <LeadDriverInfo leadData={leadData} />

      <Section
        title="Документы"
        icon={<DescriptionOutlinedIcon color="primary" />}
      >
        <LeadDocumentsSection
          leadStatus={leadData?.status}
          documents={files.reverse()}
          onAddDocument={handleAddDocument}
          onDeleteDocument={handleDeleteFileFromDB}
          isUploading={isDocumentUploading}
          uploadError={documentError}
          deletingDocumentIds={deletingDocumentIds}
        />
      </Section>

      {isEditableStatus && isAllPassed && (
        <Button
          color="error"
          variant="outlined"
          disabled={isConfirmLoading}
          onClick={handleConfirmDelivery}
        >
          {isConfirmLoading ? "...Завершение рейса" : "Завершить рейс"}
        </Button>
      )}
    </>
  );
};

export default LeadItemMainContainer;
