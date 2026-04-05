/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type FC, type FormEvent } from "react";
import { toast } from "../../utils/errorHandler";
import Input from "../../components/Inputs";
import ProfilePicSelector from "../../components/ProfilePicSelector";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axios";
import { registerSchema } from "../../schemas/authSchemas";
import uploadImage from "../../utils/uploadImage";
import { getErrorMessage } from "../../utils/errorHandler";

interface SignUpProps {
  setCurrentPage: (page: string) => void;
}

const SignUp: FC<SignUpProps> = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const validation = registerSchema.safeParse({ name: fullName, email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    let profileImageUrl = "";
    try {
      setIsLoading(true);
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

      if (response.data) {
        toast.success("User registered successfully", {
          description: "Please login using your new credentials to continue.",
        });
        setCurrentPage("login");
        setError("");
        setFullName("");
        setEmail("");
        setPassword("");
        setProfilePic(null);
      }
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
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
        <div className="mt-2 flex flex-col gap-4">
          <button 
            disabled={isLoading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50" 
            type="submit"
          >
            {isLoading ? "Creating account..." : "SIGN UP"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
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
