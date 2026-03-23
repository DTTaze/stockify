import { ComponentProps, ReactNode } from "react";
import {
  Control,
  ControllerRenderProps,
  FieldPath,
  FieldPathValue,
  FieldValues,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { cn } from "@/utils";
import { InputPassword } from "../InputCustom/InputPassword";
import { InputSearch } from "../InputCustom/InputSearch";
import { InputText } from "../InputCustom/InputText";

export interface PropsFormInput<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  labelClassName?: string;
  messageClassName?: string;
  defaultValue?: FieldPathValue<T, FieldPath<T>>;
  // eslint-disable-next-line no-unused-vars
  children?: (field: ControllerRenderProps<T, FieldPath<T>>) => ReactNode;
}

export const FormInput = <T extends FieldValues>(props: PropsFormInput<T>) => {
  const {
    control,
    name,
    label,
    labelClassName,
    messageClassName,
    defaultValue,
    children,
  } = props;
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              className={cn(
                "mb-1 text-sm font-medium text-[#1a365d] lg:text-base",
                labelClassName,
              )}
            >
              {label}
            </FormLabel>
          )}
          <FormControl>{children && children(field)}</FormControl>
          <FormMessage className={cn(messageClassName)} />
        </FormItem>
      )}
    />
  );
};

export interface Props<T extends FieldValues> extends PropsFormInput<T> {
  inputProps?: ComponentProps<typeof InputText>;
  classNameIcon?: string;
}

//text
export const FormInputText = <T extends FieldValues>(props: Props<T>) => {
  const { inputProps, ...rest } = props;
  return (
    <FormInput {...rest}>
      {(field) => <InputText {...field} {...inputProps} />}
    </FormInput>
  );
};

//password
export const FormInputPassword = <T extends FieldValues>(props: Props<T>) => {
  const { inputProps, classNameIcon, ...rest } = props;
  return (
    <FormInput {...rest}>
      {(field) => (
        <InputPassword
          {...field}
          classNameIcon={classNameIcon}
          {...inputProps}
        />
      )}
    </FormInput>
  );
};

//search
export const FormInputSearch = <T extends FieldValues>(props: Props<T>) => {
  const { inputProps, ...rest } = props;
  return (
    <FormInput {...rest}>
      {(field) => <InputSearch {...field} {...inputProps} />}
    </FormInput>
  );
};
