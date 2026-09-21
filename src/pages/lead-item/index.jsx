import RootLayout from "../../components/layout/root-layout";
import AddLeadForm from "../../features/leads/add-lead-form";
import LeadHeading from "../../components/leads/lead-item/lead-heading";
import PageLoader from "../../shared/ui/loaders/page-loader";
import ShareModal from "../../components/leads/lead-item/share-modal";
import LeadItemMainContainer from "../../components/leads/lead-item/lead-item-main-container";
import ChatFirstVertion from "../../components/chat/chat-first-vertion";
import ShareLeadLinkBlock from "../../components/leads/lead-item/share-lead-link-block";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import { useFormDefaultValues } from "../../shared/hooks/leads/use-form-default-values";
import { useLeadsStore } from "../../app/store/leads/leads-store";
import { LEAD_TABS } from "../../shared/const/leads";
import {
  FINISHED_LEAD_STATUSES,
  IN_PROGRESS_STATUSES,
  STATUS,
} from "../../shared/const/tenders";
import ConfirmModal from "../../shared/ui/confirm-modal";
import WarningModal from "../../components/leads/lead-item/warning-modal";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import InfoItem from "../../shared/ui/info-item";

const LeadItem = () => {
  const { id } = useParams();

  const [currentTab, setCurrentTab] = useState(LEAD_TABS.lead_details);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openWarningModal, setOpenWarningModal] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFinishEmergency, setOpenFinishEmergency] = useState(false);
  const [documentError, setDocumentError] = useState("");
  const [shareUrl, setShareUrl] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [emergencyComment, setEmergencyComment] = useState("");

  const leadData = useLeadsStore((state) => state.currentLead);
  const files = useLeadsStore((state) => state.files);
  const showEmergencyButton = IN_PROGRESS_STATUSES.includes(leadData?.status);
  const defaultValues = useFormDefaultValues(leadData, files);
  const isActive = !FINISHED_LEAD_STATUSES.includes(leadData?.status);
  const getLeadFiles = useLeadsStore((state) => state.getLeadFiles);
  const getLeadItem = useLeadsStore((state) => state.getLeadItem);
  const sendEmergencySituation = useLeadsStore(
    (state) => state.sendEmergencySituation,
  );
  const finishEmergencySituation = useLeadsStore(
    (state) => state.finishEmergencySituation,
  );
  const isSentEmergencyLoading = useLeadsStore(
    (state) => state.isSentEmergencyLoading,
  );
  const isFinishEmergencyLoading = useLeadsStore(
    (state) => state.isFinishEmergencyLoading,
  );

  const openEditForm = () => {
    setOpenEdit(true);
  };

  const handleOpenShareModal = () => {
    setOpenShareModal(true);
  };

  const handleCloseShareModal = () => {
    setOpenShareModal(false);
  };

  const handleOpenWarningModal = () => {
    setOpenWarningModal(true);
  };

  const handleCloseWarningModal = () => {
    setOpenWarningModal(false);
  };

  const handleOpenFinishEmergencyModal = () => {
    setOpenFinishEmergency(true);
  };

  const handleCloseFinishEmergencyModal = () => {
    setOpenFinishEmergency(false);
  };

  const handleSendEmergencySituation = async () => {
    await sendEmergencySituation(id, {
      emergency_situation_comment: emergencyComment,
    });
    handleCloseWarningModal();
    setConfirm(false);

    await getLeadItem(id);
  };

  const handleFinishEmergencySituation = async () => {
    await finishEmergencySituation(id);
    handleCloseFinishEmergencyModal();

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
            py: 2,
            width: "100%",
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "start",
              md: "center",
            },
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

            <Tab
              value={LEAD_TABS.customer_chat}
              disabled={!leadData.customer.name}
              label="Чат с заказчиком"
            />

            <Tab
              value={LEAD_TABS.driver_chat}
              disabled={!leadData.driver.fio}
              label="Чат с водителем"
            />

            <Tab
              value={LEAD_TABS.factor_chat}
              label="Чат с фактором"
              disabled={isActive}
            />
          </Tabs>

          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >
            {showEmergencyButton && (
              <Tooltip title="Сообщить об аварии" arrow>
                <IconButton
                  color="error"
                  onClick={handleOpenWarningModal}
                  sx={{
                    height: 30,
                    width: 30,
                    p: 3,
                  }}
                >
                  <WarningAmberRoundedIcon
                    sx={{
                      fontSize: 28,
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}

            {leadData.status === STATUS.emergency_situation && (
              <Tooltip title="Закрыть авариную ситуацию" arrow>
                <IconButton
                  color="error"
                  onClick={handleOpenFinishEmergencyModal}
                  sx={{
                    height: 30,
                    width: 30,
                    p: 3,
                  }}
                >
                  <DoNotDisturbOnOutlinedIcon
                    sx={{
                      fontSize: 28,
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Поделиться лидом" arrow>
              <IconButton
                color="primary"
                onClick={handleOpenShareModal}
                sx={{
                  height: 30,
                  width: 30,
                  p: 3,
                }}
              >
                <IosShareOutlinedIcon
                  sx={{
                    fontSize: 25,
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box
          sx={{
            py: 1,
            width: "50%",
          }}
        >
          {leadData.emergency_situation_comment && (
            <InfoItem
              color="error"
              label={"Коментарий по аварийному случаю"}
              value={leadData.emergency_situation_comment}
            />
          )}
        </Box>

        {openShareModal && (
          <ShareModal
            leadId={id}
            openShareModal={openShareModal}
            handleCloseShareModal={handleCloseShareModal}
            setShareUrl={setShareUrl}
          />
        )}

        {shareUrl && (
          <ShareLeadLinkBlock
            open={shareUrl}
            link={shareUrl.url}
            expiresAt={shareUrl.expires_at}
            onClose={() => setShareUrl(null)}
          />
        )}

        {openWarningModal && (
          <WarningModal
            openWarningModal={openWarningModal}
            handleCloseShareModal={handleCloseWarningModal}
            setConfirm={setConfirm}
            comment={emergencyComment}
            setComment={setEmergencyComment}
          />
        )}

        {confirm && (
          <ConfirmModal
            warning
            open={confirm}
            title={"Внимание!"}
            description={
              "Вы уверены, что хотите сообщить об аварийном случае? Данное действие может привести к отмене факторинга и завершению лида. Отменить это действие будет невозможно."
            }
            onCancel={() => setConfirm(false)}
            onConfirm={handleSendEmergencySituation}
            isLoading={isSentEmergencyLoading}
          />
        )}

        {openFinishEmergency && (
          <ConfirmModal
            open={openFinishEmergency}
            title={"Внимание!"}
            description={
              "Вы уверены, что хотите закрыть аварийную ситуацию? Данное действие завершит отслеживание лида, и закроет лид"
            }
            onCancel={handleCloseFinishEmergencyModal}
            onConfirm={handleFinishEmergencySituation}
            isLoading={isFinishEmergencyLoading}
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
          <ChatFirstVertion messageType={"lead"} />
        )}

        {currentTab === LEAD_TABS.driver_chat && (
          <ChatFirstVertion messageType={"cargo"} />
        )}

        {currentTab === LEAD_TABS.factor_chat && (
          <ChatFirstVertion messageType={"factoring"} />
        )}
      </Box>
    </RootLayout>
  );
};

export default LeadItem;
