import { useEffect, useState } from "react";
import RootLayout from "../../components/layout/root-layout";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddLeadForm from "../../features/leads/add-lead-form";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import LeadHeading from "../../components/leads/lead-item/lead-heading";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import PageLoader from "../../shared/ui/loaders/page-loader";
import ShareModal from "../../components/leads/lead-item/share-modal";
import LeadItemMainContainer from "../../components/leads/lead-item/lead-item-main-container";
import { LEAD_TABS } from "../../shared/const/leads";
import ChatFirstVertion from "../../components/chat/chat-first-vertion";

const mockUserCustomer = {
  fio: "Арман Рахатов",
  avatar:
    "https://avatars.mds.yandex.net/i?id=7940f02c803cd4419ad3927674dbd9ba_l-5850566-images-thumbs&n=13",
  role: "customer",
};

const mockUserDriver = {
  fio: "Рустам Илиясов",
  avatar:
    "https://avatars.mds.yandex.net/i?id=c79fb37a003821a0bbeeb4aac87a429d_l-10595999-images-thumbs&n=13",
  role: "driver",
};

const mockUserFactor = {
  fio: "Марал Жахан",
  avatar:
    "https://media.gettyimages.com/id/1197925988/photo/young-woman-working-in-factor.jpg?s=1024x1024&w=gi&k=20&c=inFzr37F6FO9UTXNBenFwV3tyEMJR9NoSPTXeLTSmHg=",
  role: "factor",
};

const LeadItem = () => {
  const { id } = useParams();

  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);

  const [currentTab, setCurrentTab] = useState(LEAD_TABS.lead_details);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [documentError, setDocumentError] = useState("");

  const leadData = useLeadsStore((state) => state.currentLead);
  const files = useLeadsStore((state) => state.files);

  const defaultValues = useFormDefaultValues(leadData, files);

  const openEditForm = () => {
    setOpenEdit(true);
  };

  const handleOpenShareModal = () => {
    setOpenShareModal(true);
  };

  const handleCloseShareModal = () => {
    setOpenShareModal(false);
  };

  useEffect(() => {
    let isCancelled = false;

    async function loadDocuments() {
      if (!id) {
        return;
      }

      try {
        setDocumentError("");

        await getLeadFiles(id);
      } catch (error) {
        if (!isCancelled) {
          setDocumentError(
            error.response?.data?.message ||
              error.message ||
              "Не удалось загрузить документы",
          );
        }
      }
    }

    getLeadItem(id);
    loadDocuments();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (!leadData)
    return (
      <RootLayout withoutDataCheck>
        <PageLoader />
      </RootLayout>
    );

  return (
    <RootLayout data={leadData}>
      <Box
        sx={{
          px: {
            xs: 0,
            md: 10,
          },
        }}
      >
        <LeadHeading leadData={leadData} openEditForm={openEditForm} />

        {openEdit && (
          <AddLeadForm
            editingItemId={id}
            openForm={openEdit}
            setOpenForm={setOpenEdit}
            initialValues={defaultValues}
            isEdit
          />
        )}

        <Box
          sx={{
            pt: 2,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Переключение разделов"
            sx={{
              alignSelf: {
                xs: "stretch",
                sm: "auto",
              },
              "& .MuiTab-root": {
                px: 1.5,
                minWidth: 40,
                textTransform: "none",
              },
            }}
          >
            <Tab value={LEAD_TABS.lead_details} label="Детали лида" />

            <Tab value={LEAD_TABS.customer_chat} label="Чат с заказчиком" />

            <Tab value={LEAD_TABS.driver_chat} label="Чат с водителем" />

            <Tab value={LEAD_TABS.factor_chat} label="Чат с фактором" />
          </Tabs>
          <Button
            color="primary"
            variant="outlined"
            onClick={handleOpenShareModal}
          >
            Поделиться
          </Button>
        </Box>

        {openShareModal && (
          <ShareModal
            leadId={id}
            openShareModal={openShareModal}
            handleCloseShareModal={handleCloseShareModal}
          />
        )}

        {currentTab === LEAD_TABS.lead_details && (
          <LeadItemMainContainer
            leadData={leadData}
            documentError={documentError}
            setDocumentError={setDocumentError}
          />
        )}

        {currentTab === LEAD_TABS.customer_chat && (
          <ChatFirstVertion mockUser={mockUserCustomer} />
        )}

        {currentTab === LEAD_TABS.driver_chat && (
          <ChatFirstVertion mockUser={mockUserDriver} />
        )}

        {currentTab === LEAD_TABS.factor_chat && (
          <ChatFirstVertion mockUser={mockUserFactor} />
        )}
      </Box>
    </RootLayout>
  );
};

export default LeadItem;
