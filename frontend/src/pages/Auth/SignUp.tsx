/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs";
import ProfilePicSelector from "../../components/ProfilePicSelector";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axios";
import uploadImage from "../../utils/uploadImage";

interface SignUpProps {
  setCurrentPage: (page: string) => void;
}

const SignUp: FC<SignUpProps> = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your full name");
    }

    if (!validateEmail(email)) {
      setError("Enter valid email address");
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");
    try {
      if (profilePic) {
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
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
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="mt-[5px] mb-6 text-xs text-slate-700">
        Join us today by entering your details below
      </p>

      <form onSubmit={handleSignup}>
        <ProfilePicSelector image={profilePic} setImage={setProfilePic} />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-1">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Jhon"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="jhon@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Minimum 8 Characters"
            type="password"
          />
        </div>
        {error && <p className="pb-2.5 text-xs text-red-500">{error}</p>}
        <button className="btn-primary" type="submit">
          SIGN UP
        </button>
        <p className="mt-3 text-[13px] text-slate-800">
          Already have an account{" "}
          <button
            className="text-primary cursor-pointer font-medium underline"
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
