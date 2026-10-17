"use client";

export function ConfirmSubmit({ children, message }: { children: React.ReactNode; message: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="rounded-full px-3.5 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
    >
      {children}
    </button>
  );
}
