import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { LuPlus } from "react-icons/lu";
import { toast } from "../../utils/errorHandler";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import Modal from "../../components/Modal";
import CreateSessionForm from "../../components/CreateSessionForm";
import SummaryCard from "../../components/SummaryCard";
import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/apiPaths";
import { CARD_BG } from "../../utils/data";
import DeleteAlertContent from "../../components/DeleteAlertContent";
import type { ISession } from "../../types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [editSessionData, setEditSessionData] = useState<ISession | null>(null);
  const [session, setSession] = useState<ISession[]>([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<{
    open: boolean;
    data: ISession | null;
  }>({
    open: false,
    data: null,
  });
  const [isDeletingSession, setIsDeletingSession] = useState(false);

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSession(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const deleteSession = async (sessionData: ISession) => {
    try {
      setIsDeletingSession(true);
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("Session Deleted Successfully", {
        description: "The interview session record has been permanently removed.",
      });
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();
    } catch (error) {
      toast.error("Error deleting session");
      console.error("Error deleting session", error);
    } finally {
      setIsDeletingSession(false);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
        {session.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl mb-6">
              🎯
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Interview Sessions Yet
            </h2>
            <p className="max-w-md text-sm text-gray-500 mb-6">
              Create your first session to generate AI-powered interview questions 
              tailored to your target role and experience level.
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff9324] to-[#e99a4b] px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-orange-200"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="text-lg" />
              Create Your First Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 px-4 pt-1 pb-4 md:grid-cols-3 md:gap-7 md:px-0">
            {session?.map((data, idx) => {
              const {
                _id,
                role = "",
                topicsToFocus = "",
                experience = "-",
                questions = [],
                description = "",
                updatedAt,
              } = data || {};

              return (
                <SummaryCard
                  key={_id || idx}
                  colors={CARD_BG[idx % CARD_BG.length]}
                  role={role}
                  topicsToFocus={topicsToFocus}
                  experience={experience}
                  questions={questions.length || 0}
                  masteredCount={questions.filter(q => (q as any).status === 'mastered').length}
                  description={description}
                  lastUpdated={
                    updatedAt ? moment(updatedAt).format("Do MMM YYYY") : ""
                  }
                  onSelect={() => navigate(`/interview-prep/${_id}`)}
                  onEdit={() => setEditSessionData(data)}
                  onDelete={() => setOpenDeleteAlert({ open: true, data })}
                />
              );
            })}
          </div>
        )}
        <button
          className="fixed right-10 bottom-10 flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full bg-linear-to-r from-[#ff9324] to-[#e99a4b] px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black hover:text-white hover:shadow-2xl hover:shadow-orange-300 md:right-20 md:bottom-20 md:h-12"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div>
          <CreateSessionForm 
            onSuccess={() => {
              setOpenCreateModal(false);
              fetchAllSessions();
            }}
          />
        </div>
      </Modal>

      <Modal
        isOpen={!!editSessionData}
        onClose={() => setEditSessionData(null)}
        hideHeader
      >
        <div>
          {editSessionData && (
            <CreateSessionForm 
              initialData={editSessionData as any}
              onSuccess={() => {
                setEditSessionData(null);
                fetchAllSessions();
                toast.success("Session Updated Successfully");
              }}
            />
          )}
        </div>
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this session detail?"
            isDeleting={isDeletingSession}
            onDelete={() =>
              openDeleteAlert.data && deleteSession(openDeleteAlert.data)
            }
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
