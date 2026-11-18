import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { sessionStorage } from "@rondevu/lib/webstorage";

const STORAGE_KEY = "showWelcomeToRondevuModal";
const ORG_MODAL_STORAGE_KEY = "showNewOrgModal";

export function useWelcomeToRondevuModal() {
  const [welcomeToRondevuModal, setWelcomeToRondevuModal] = useQueryState(
    "welcomeToRondevuModal",
    parseAsBoolean.withDefault(false)
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Don't show personal modal if org modal flag is set (org modal takes precedence)
    const hasOrgModalFlag = sessionStorage.getItem(ORG_MODAL_STORAGE_KEY) === "true";
    if (hasOrgModalFlag) {
      setIsOpen(false);
      return;
    }

    if (welcomeToRondevuModal) {
      setIsOpen(true);
      return;
    }

    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setIsOpen(true);
    }
  }, [welcomeToRondevuModal]);

  const closeModal = () => {
    setIsOpen(false);
    // Remove the query param from URL
    setWelcomeToRondevuModal(null);
    // Also clear sessionStorage
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return {
    isOpen,
    closeModal,
  };
}

export function setShowWelcomeToRondevuModalFlag() {
  sessionStorage.setItem(STORAGE_KEY, "true");
}
