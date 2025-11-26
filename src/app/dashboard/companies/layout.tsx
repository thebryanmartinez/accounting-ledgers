import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="flex-1 h-full w-full">{children}</div>;
}
