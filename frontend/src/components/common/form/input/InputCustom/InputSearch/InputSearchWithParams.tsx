import { debounce } from "lodash-es";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useCallback, useMemo, useState } from "react";

import { QUERY_PARAMS } from "@/constants/query";
import { usePathname, useRouter } from "@/i18n/navigation";

import { InputSearch } from ".";

interface InputSearchWithParamsProps {
  queryParamToClear?: string | string[];
}

export const InputSearchWithParams = (props: InputSearchWithParamsProps) => {
  const { queryParamToClear } = props;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsValue = searchParams.get(QUERY_PARAMS.KEYWORD);

  const [keyword, setKeyword] = useState<string>(searchParamsValue || "");

  const updateQuery = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(QUERY_PARAMS.KEYWORD, value);
        params.delete(QUERY_PARAMS.OFFSET);
        params.delete(QUERY_PARAMS.ROWS);
        params.delete(QUERY_PARAMS.FROM_DATE);
        params.delete(QUERY_PARAMS.TO_DATE);

        if (queryParamToClear) {
          if (Array.isArray(queryParamToClear)) {
            queryParamToClear.forEach((param) => params.delete(param));
          } else {
            params.delete(queryParamToClear);
          }
        }
      } else {
        params.delete("keyword");
      }

      router.push(pathname + "?" + params.toString(), { scroll: false });
    },
    [router, pathname, searchParams, queryParamToClear],
  );

  const debouncedUpdateQuery = useMemo(
    () => debounce(updateQuery, 500),
    [updateQuery],
  );

  return (
    <InputSearch
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
        debouncedUpdateQuery(value);
      }}
      value={keyword}
    />
  );
};
