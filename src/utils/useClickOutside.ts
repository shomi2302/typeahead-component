import { RefObject, useCallback, useEffect } from "react";

export const useClickOutside = (
  ref: RefObject<HTMLDivElement>,
  isExpanded: boolean,
  closingCallback: () => void
): void => {
  const handleClickOutside = useCallback(
    (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (isExpanded) {
          // setTimeout needed to prevent UI flicker
          setTimeout(closingCallback, 100);
        }
      }
    },
    [isExpanded, ref, closingCallback]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
};
