// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomTextField from "@/lib/ui/useable-components/input-field";

// Interfaces
import { ILoginWithEmailProps } from "@/lib/utils/interfaces";

// Icons
import EmailIcon from "@/public/assets/images/svgs/email";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiMail } from "react-icons/fi";

//Import Googlr Icons from react-icons colored

import { FcGoogle } from "react-icons/fc";

export default function LoginWithEmail({
  handleChangePanel,
  formData,
  handleFormChange,
}: ILoginWithEmailProps) {
  // Hooks
  const t = useTranslations();
  const { setUser, checkEmailExists, isLoading } = useAuth();
  const { showToast } = useToast();

  // Inside component
  const [isValid, setIsValid] = useState(true);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (email: string) => {
    handleFormChange("email", email);
    setUser((prev) => ({ ...prev, email }));

    // Real-time email validation
    setIsValid(emailRegex.test(email));
  };
  // Handlers
  const handleSubmit = async () => {
    const email = formData?.email ?? "";
    const valid = emailRegex.test(email);
    setIsValid(valid);

    if (!email || !valid) {
      return showToast({
        type: "error",
        title: t("Error"),
        message: t("Please enter a valid email address"),
      });
    }

    // Proceed only if valid
    const emailExists = await checkEmailExists(email);
    //User Exists with non-default auth - go to password
    if (emailExists._id && emailExists.userType !== "default") {
      showToast({
        type: "success",
        title: t("Login"),
        message: t("Got your account, please enter your password"),
        //User exists with default auth - go to password
      });
      return handleChangePanel(7); // go to password
    } else if (emailExists.userType === "default") {
      return handleChangePanel(7); // go to password
    } else {
      handleChangePanel(2); // go to registration
    }
  };

  return (
    <div className="flex flex-col items-start justify-start w-full h-full px-4 py-6 md:px-8">
      <EmailIcon />

      <div className="flex flex-col w-full mt-4">
        <h3 className="text-xl md:text-2xl font-semibold">
          {t("What's your email?")}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {t("We'll check if you have an account")}
        </p>
      </div>

      <div className="flex flex-col gap-y-2 mt-6 w-full">
        {/* Email Input Field with Icon */}
        <div className="relative w-full">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <CustomTextField
            value={formData?.email}
            showLabel={false}
            name="email"
            type="text"
            placeholder="example@domain.com"
            onChange={(e) => handleChange(e.target.value)}
            className={`pl-10 w-full py-2 px-3 rounded-md border ${
              isValid ? "border-gray-300" : "border-red-500"
            } focus:outline-none focus:ring-2 focus:ring-[#5AC12F]`}
          />
        </div>

        {/* Validation message */}
        <div className="h-[20px]">
          {!isValid && (
            <p className="text-red-500 text-sm">
              Please enter a valid email address.
            </p>
          )}
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={() => handleChangePanel(0)}
          className="flex items-center justify-center gap-2 rounded-full py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200 w-full md:w-auto self-center"
        >
          <FcGoogle className="text-lg" />
          {t("Continue with Google instead")}
        </button>
      </div>

      {/* Submit Email */}
      <CustomButton
        label={t("Continue with Email")}
        loading={isLoading}
        onClick={handleSubmit}
        className={`bg-[#5AC12F] flex items-center justify-center gap-x-4 px-3 rounded-full border border-gray-300 p-3 mt-6 w-full md:w-72 self-center`}
      />
    </div>
  );
}
