import { X } from "lucide-react";
import React, { FC } from "react";
import { toast } from "react-hot-toast";
interface Props {
  title: string;
  description: string;
}
const notify = ({ description, title }: Props) =>
  toast.custom((t) => (
    <div
      className={`${
        t.visible
          ? "animate-in slide-in-from-bottom-full"
          : "animate-out fade-out-80 slide-out-to-right-full"
      } max-w-sm bg-background "data-[swipe=move]:transition-none group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all"`}
      style={{
        opacity: t.visible ? 1 : 0,
        transition: "opacity 100ms ease-in-out",
      }}
    >
      <div className="flex-1 w-0">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-sm opacity-90">{description}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ));

export default notify;
