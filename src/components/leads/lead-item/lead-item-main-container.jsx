import LeadAvrSection from "../documents/lead-avr-section";
import CargoCard from "./lead-cargo-info";
import LeadMap from "../lead-map";
import LeadCustomerInfo from "./lead-customer-info";
import LeadRouteInfo from "./lead-route-info";
import Section from "./lead-detail-section";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LeadCargoFilesContainer from "../lead-cargo-files-container";
import LeadDriverInfo from "./lead-driver-info";
import { useEffect, useState } from "react";
import { uploadLeadFileApi } from "../../../app/store/leads/api";
import { useLeadsStore } from "../../../app/store/leads/leads-store";
import { LeadDocumentsSection } from "../documents/LeadDocumentsSection";
import { STATUS } from "../../../shared/const/tenders";
import { useParams } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { useNotificationsStore } from "../../../app/store/notifications/noti-store";
import { parserNotificationType } from "../../../shared/helpers/notifications/parse-notification-type";
import { NOTIFICATION_TYPE } from "../../../shared/const/notification-types";

const LeadItemMainContainer = ({
  leadData,
  documentError,
  setDocumentError,
}) => {
  const { id } = useParams();

  const features = window.APP_DATA?.features || {};
  const isMustSignDocument =
    features.sign_provider_aitu || features.sign_provider_ncanode;

  const files = useLeadsStore((state) => state.files);
  const driverAvrDocument = useLeadsStore((state) => state.driverAvrDocument);
  const customerAvrDocument = useLeadsStore(
    (state) => state.customerAvrDocument,
  );
  const newNotification = useNotificationsStore(
    (state) => state.newNotification,
  );
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
  const isAvrLoading = useLeadsStore((state) => state.isAvrLoading);
  const isSignAvrLoading = useLeadsStore((state) => state.isSignAvrLoading);
  const signDriverAvrDocument = useLeadsStore(
    (state) => state.signDriverAvrDocument,
  );
  const getDriverAvrDocument = useLeadsStore(
    (state) => state.getDriverAvrDocument,
  );

  const signCustomerAvrDocument = useLeadsStore(
    (state) => state.signCustomerAvrDocument,
  );
  const getCustomerAvrDocument = useLeadsStore(
    (state) => state.getCustomerAvrDocument,
  );
  const error = useLeadsStore((state) => state.error);

  const [isRefreshingAvr, setIsRefreshingAvr] = useState(false);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [deletingDocumentIds, setDeletingDocumentIds] = useState([]);

  const leadPoints = [
    leadData?.from_location,
    ...(leadData?.waypoints || []),
    leadData?.to_location,
  ];

  const cargosCount = leadData?.cargos?.length;
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

  const leadAvrDF = leadData?.avr_df;
  const leadAvrFC = leadData?.avr_fc;

  async function reloadLeadDocuments(leadId) {
    await getLeadFiles(leadId);
  }

  async function handleAddDocument({ file }) {
    if (!id || !file) return;

    try {
      setIsDocumentUploading(true);
      setDocumentError("");

      await uploadLeadFileApi(id, {
        file,
        name: file.name,
        context: file.context,
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

  const { notification_type } = parserNotificationType(newNotification?.type);

  const handleConfirmDelivery = async () => {
    await confirmLeadDelivery(id);
    await getLeadItem(id);
  };

  const handleRefreshAvr = async () => {
    setIsRefreshingAvr(true);
    try {
      await Promise.all([
        getLeadItem(id),
        getDriverAvrDocument(id),
        getCustomerAvrDocument(id),
      ]);
    } finally {
      setIsRefreshingAvr(false);
    }
  };

  const handleGenerateAvrDocument = async () => {
    await generateAvrDocument(id);
    if (!leadAvrDF) {
      await getDriverAvrDocument(id);
    } else {
      await getCustomerAvrDocument(id);
    }
  };

  const handleSignDriverAvrDocument = async () => {
    const response = await signDriverAvrDocument(id);
    const link = response?.data?.sign_url;

    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleSignCustomerAvrDocument = async () => {
    const response = await signCustomerAvrDocument(id);
    const link = response?.data?.sign_url;

    if (link) window.open(link, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (
      leadData.status === STATUS.sign_avr ||
      leadData.status === STATUS.finished
    ) {
      getDriverAvrDocument(id);
      getCustomerAvrDocument(id);
    }
  }, []);

  useEffect(() => {
    if (notification_type === NOTIFICATION_TYPE.shipping) {
      getLeadItem(id);
    }
  }, [newNotification]);

  return (
    <>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          my: 2,
        }}
      >
        <LeadMap waypoints={waypoints} from={from} to={to} id={id} />
      </Box>

      {((leadData.status === STATUS.sign_avr && isMustSignDocument) ||
        (leadData.status === STATUS.finished && isMustSignDocument)) && (
        <LeadAvrSection
          driverDocument={driverAvrDocument}
          customerDocument={customerAvrDocument}
          driverSigned={Boolean(leadAvrDF)}
          customerSigned={Boolean(leadAvrFC)}
          readOnly={leadData.status === STATUS.finished}
          isLoading={isAvrLoading || isRefreshingAvr}
          isGenerating={isGenerateAvrLoading}
          isSigning={isSignAvrLoading}
          error={error}
          onRefresh={handleRefreshAvr}
          onGenerate={handleGenerateAvrDocument}
          onSignDriver={handleSignDriverAvrDocument}
          onSignCustomer={handleSignCustomerAvrDocument}
        />
      )}

      {isAllPassed && leadData.status === STATUS.verification_unloading && (
        <Section
          title="Завершить рейс"
          icon={<DescriptionOutlinedIcon color="primary" />}
        >
          <Button
            color="error"
            variant="outlined"
            disabled={isConfirmLoading}
            onClick={handleConfirmDelivery}
          >
            {isConfirmLoading ? "...Завершение рейса" : "Завершить рейс"}
          </Button>
        </Section>
      )}

      <LeadRouteInfo leadData={leadData} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            xl: "repeat(2, minmax(0, 1fr))",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        <LeadCustomerInfo leadData={leadData} canDetach />
        <LeadDriverInfo leadData={leadData} canDetach />
      </Box>

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
            <CargoCard
              key={cargo.id || index}
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
    </>
  );
};

export default LeadItemMainContainer;
