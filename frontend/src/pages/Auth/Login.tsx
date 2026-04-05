/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, type FC, type FormEvent } from "react";
import { toast } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs";
import { getErrorMessage } from "../../utils/errorHandler";

import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/apiPaths";
import { loginSchema } from "../../schemas/authSchemas";
import { UserContext } from "../../context/userContext";

interface LoginProps {
  setCurrentPage: (page: string) => void;
}

const Login: FC<LoginProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      if (response.data) {
        updateUser(response.data);
        navigate("/dashboard");
        toast.success("Login successful", {
          description: "Welcome back! Let's get you prepared for your next interview.",
        });
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-[90vw] flex-col justify-center p-7 md:w-[33vw]">
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="mt-[5px] mb-6 text-xs text-slate-700">
        Please enter your details to login
      </p>
      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email address"
          placeholder="jhon@example.com"
          type="text"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
        />
        {error && <p className="pb-2.5 text-xs text-red-500">{error}</p>}
        <div className="mt-2 flex flex-col gap-4">
          <button 
            disabled={isLoading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50" 
            type="submit"
          >
            {isLoading ? "Logging in..." : "LOG IN"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <button
            className="text-primary cursor-pointer font-medium underline"
            onClick={() => {
              setCurrentPage("signup");
            }}
          >
            SignUp
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
