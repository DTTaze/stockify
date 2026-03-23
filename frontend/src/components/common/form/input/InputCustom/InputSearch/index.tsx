import { SearchIcon } from "lucide-react";

import { InputCustom, InputCustomProps } from "..";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends InputCustomProps {}

export const InputSearch = (props: Props) => {
  const { classNameWrapper = "max-w-[640px]", ...rest } = props;

  return (
    <InputCustom
      prefixIcon={
        <div className="mr-2">
          <SearchIcon className="text-neutral-black h-6 w-6" />
        </div>
      }
      classNameWrapper={classNameWrapper}
      placeholder="Search item"
      {...rest}
    />
  );
};
