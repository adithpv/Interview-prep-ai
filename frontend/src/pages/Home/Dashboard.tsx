import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { LuPlus } from "react-icons/lu";
import { toast } from "react-hot-toast";
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
  const [session, setSession] = useState<ISession[]>([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<{
    open: boolean;
    data: ISession | null;
  }>({
    open: false,
    data: null,
  });

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
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4">
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
                questions={questions.length || "-"}
                description={description}
                lastUpdated={
                  updatedAt ? moment(updatedAt).format("Do MMM YYYY") : ""
                }
                onSelect={() => navigate(`/interview-prep/${_id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            );
          })}
        </div>
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
          <CreateSessionForm />
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
