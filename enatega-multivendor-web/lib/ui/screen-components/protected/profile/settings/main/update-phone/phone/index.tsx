import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/lib/ui/useable-components/button";
import CustomPhoneTextField from "@/lib/ui/useable-components/phone-input-field";
import { LaptopSvg } from "@/lib/utils/assets/svg";
import { IUser } from "@/lib/utils/interfaces";

export interface IPhoneEntryProps {
  handleChange: (val: string) => void;
  user: IUser | null;
  handleSubmit: () => void;
  handleUpdatePhoneModal: () => void;
}

const PhoneEntry = ({ handleChange, handleSubmit, user, handleUpdatePhoneModal }: IPhoneEntryProps) => {
  const [loading, setLoading] = useState(false);

  const handleSaveClick = async () => {
   setLoading(true);
   try {
     await handleSubmit();
   } catch (error) {
     console.error('Save failed:', error);
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="flex flex-col justify-between px-4 w-full items-center">
      <div className="flex items-center justify-center">
        <LaptopSvg width={250} height={250} />
      </div>

      <h2 className="font-extrabold text-lg md:text-xl lg:text-2xl my-2 text-start w-full leading-8">
        Enter phone number
      </h2>

      <div className="flex my-2 w-full">
        <CustomPhoneTextField
          mask="999 999 999 999"
          name="phone"
          showLabel={false}
          type="text"
          className="min-w-[22vw] w-full"
          value={user?.phone}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-row w-full justify-between mt-2 gap-2 md:gap-0">
        <CustomButton
          label="Cancel"
          className="bg-white border border-gray-300 flex items-center justify-center rounded-full p-2 sm:p-3 w-full md:w-[268px] mb-4 text-sm sm:text-lg font-medium"
          onClick={handleUpdatePhoneModal}
        />

        <button
          onClick={handleSaveClick}
          disabled={loading}
          aria-label={loading ? "Saving phone number..." : "Save phone number"}
          className={`bg-[#5AC12F] text-white flex items-center justify-center rounded-full p-2 sm:p-3 w-full md:w-[268px] mb-4 text-sm sm:text-lg font-medium ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-lg" />
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default PhoneEntry;
