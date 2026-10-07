"use client";

import { useEffect, useRef } from "react";

// A thin wrapper around the browser's built-in <dialog>.
// It gives us focus trapping, the Escape key, and a dimmed backdrop for free.
type Props = { open: boolean; onClose: () => void; children: React.ReactNode };

export default function Modal({ open, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.body.style.overflow = open ? "hidden" : ""; // stop the page scrolling behind
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()} // click on the dim area closes
      className="m-auto mb-0 max-h-[92vh] w-full max-w-lg animate-modal overflow-y-auto rounded-t-3xl bg-card p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm sm:mb-auto sm:rounded-3xl"
    >
      {open && children}
    </dialog>
  );
}
