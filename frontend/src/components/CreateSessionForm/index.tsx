import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs";
import SpinnerLoader from "../SpinnerLoader";
import { getErrorMessage } from "../../utils/errorHandler";
import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/apiPaths";

interface FormData {
  role: string;
  experience: string;
  topicsToFocus: string;
  description: string;
}

const CreateSessionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = useCallback((key: keyof FormData, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  }, []);

  const isFormValid = useMemo(() => {
    return formData.role && formData.experience && formData.topicsToFocus;
  }, [formData]);

  const handleCreateSession = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isFormValid) {
        setError("Please fill all the inputs");
        return;
      }

      setError("");
      setIsLoading(true);

      try {
        const aiResponse = await axiosInstance.post(
          API_PATHS.AI.GENERATE_QUESTIONS,
          {
            role: formData.role,
            experience: formData.experience,
            topicsToFocus: formData.topicsToFocus,
            numberOfQuestions: 10,
          },
        );

        const generatedQuestions = aiResponse.data;

        const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
          ...formData,
          questions: generatedQuestions,
        });

        const sessionId = response.data?.session?._id;
        if (sessionId) {
          navigate(`/interview-prep/${sessionId}`);
        }
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, isFormValid, navigate],
  );

  return (
    <div className="flex w-[90vw] flex-col justify-center p-7 md:w-[35vw]">
      <h3 className="text-lg font-semibold text-black">
        Start a New Interview Preparation
      </h3>
      <p className="mt-[5px] mb-3 text-xs text-slate-700">
        Fill out a few details and unlock your personalized set of interview
        questions!
      </p>
      <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="(eg. Frontend Developer, UI/UX Designer etc.)"
          type="text"
        />
        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange("experience", target.value)}
          label="Years of experience"
          placeholder="(eg. 1 Year, 3 Year)"
          type="number"
        />
        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange("topicsToFocus", target.value)}
          label="Topics To Focus"
          placeholder="(Comma separated, eg., React, Node js, Mongo DB)"
          type="text"
        />
        <Input
          value={formData.description}
          onChange={({ target }) => handleChange("description", target.value)}
          label="Description"
          placeholder="Any specific goals or notes for this session"
          type="text"
        />
        {error && <p className="pb-2.5 text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading && <SpinnerLoader />} Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;
