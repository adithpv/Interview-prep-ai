import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import SpinnerLoader from "../../components/SpinnerLoader";
import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/QuestionCard";
import AiResponsePreview from "../../components/AiResponsePreview";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/SkeletonLoader";
import type { ISession, IAIExplanation, IApiError } from "../../types";

const InterviewPrep = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionData, setSessionData] = useState<ISession | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState<IAIExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId || ""),
      );
      console.log("🚀 ~ fetchSessionDetailsById ~ response:", response);

      if (response.data && response.data.session) {
        setSessionData(response.data?.session);
      }
    } catch (error) {
      console.error("Errors", error);
    }
  };

  const generateConceptExplanation = async (question: string) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATIONS,
        {
          question,
        },
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error: unknown) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanations");
      console.error("Errors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId: string) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId),
      );
      if (response.data && response.data.question) {
        toast.success("Question Pinned successfully");
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        },
      );
      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        },
      );
      if (response.data) {
        toast.success("Added More Q&A");
        fetchSessionDetailsById();
      }
    } catch (error: unknown) {
      const apiError = error as IApiError;
      if (apiError.message) {
        setErrorMsg(apiError.message);
      } else {
        setErrorMsg("Something went wrong, Please try again later");
      }
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
    return () => {};
  }, [sessionId]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || ""}
        questions={sessionData?.questions?.length || 0}
        descriptions={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData?.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />
      <div className="container mx-auto px-4 pt-4 pb-4 md:px-0">
        <h2 className="color-black text-lg font-semibold">Interview Q & A</h2>
        <div className="mt-5 mb-10 grid grid-cols-12 gap-4">
          <div
            className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, idx) => {
                const key = data?._id || `fallback-${idx}`;
                const layoutId = `question-${data?._id || idx}`;

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: idx * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={layoutId}
                  >
                    <>
                      <QuestionCard
                        question={data?.question || ""}
                        answer={data?.answer || ""}
                        isPinned={data?.isPinned || false}
                        onLearnMore={() =>
                          data?.question &&
                          generateConceptExplanation(data.question)
                        }
                        onTogglePin={() =>
                          data?._id && toggleQuestionPinStatus(data._id)
                        }
                      />

                      {!isLoading &&
                        sessionData?.questions?.length === idx + 1 && (
                          <div className="mt-5 flex items-center justify-center">
                            <button
                              className="mr-2 flex cursor-pointer items-center gap-3 rounded bg-black px-5 py-2 text-sm font-medium text-nowrap text-white"
                              disabled={isLoading || isUpdateLoader}
                              onClick={uploadMoreQuestions}
                            >
                              {isUpdateLoader ? (
                                <SpinnerLoader />
                              ) : (
                                <LuListCollapse className="text-lg" />
                              )}{" "}
                              Load More
                            </button>
                          </div>
                        )}
                    </>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <Drawer
            isOpen={openLearnMoreDrawer}
            onClose={() => setOpenLearnMoreDrawer(false)}
            title={!isLoading ? explanation?.title : undefined}
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm font-medium text-amber-600">
                <LuCircleAlert className="mt-1" />
                {errorMsg}
              </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <AiResponsePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
