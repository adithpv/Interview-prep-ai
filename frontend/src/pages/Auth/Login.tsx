/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

interface LoginProps {
  setCurrentPage: (page: string) => void;
}

const Login: FC<LoginProps> = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        "data" in (error as any).response &&
        "message" in (error as any).response.data
      ) {
        setError((error as any).response.data.message);
      } else {
        setError("Something went wrong, please try again.");
      }
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
        <button className="btn-primary" type="submit">
          LOGIN
        </button>
        <p className="mt-2 text-[13px] text-slate-800">
          Dont have an account?{" "}
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
