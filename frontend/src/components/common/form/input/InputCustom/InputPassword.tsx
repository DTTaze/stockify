"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { InputCustom, InputCustomProps } from ".";

const styleIconEye = "h-6 w-6 text-black";

interface Props extends InputCustomProps {
  classNameIcon?: string;
}

export const InputPassword = (props: Props) => {
  const { classNameWrapper, classNameIcon = styleIconEye, ...rest } = props;
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const handleActionEyes = () => {
    if (isShowPassword) {
      setIsShowPassword(false);
      return;
    }

    setIsShowPassword(true);
  };

  return (
    <InputCustom
      type={isShowPassword ? "text" : "password"}
      suffixIcon={
        <div onClick={handleActionEyes} className="cursor-pointer">
          {isShowPassword ? (
            <Eye className={classNameIcon} />
          ) : (
            <EyeOff className={classNameIcon} />
          )}
        </div>
      }
      classNameWrapper={classNameWrapper}
      {...rest}
    />
  );
};
