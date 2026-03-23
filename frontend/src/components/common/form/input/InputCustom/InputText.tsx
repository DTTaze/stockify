import { InputCustom, InputCustomProps } from ".";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends InputCustomProps {}

export const InputText = (props: Props) => {
  const { classNameWrapper, ...rest } = props;

  return <InputCustom classNameWrapper={classNameWrapper} {...rest} />;
};
