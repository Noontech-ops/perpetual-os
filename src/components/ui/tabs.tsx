"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext<{ active: string; setActive: (v: string) => void }>({
  active: "",
  setActive: () => {},
});

export function Tabs({
  defaultValue,
  className,
  children,
}: {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex border-b border-slate-200", className)}
      role="tablist"
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { active, setActive } = useContext(TabsContext);
  const isActive = active === value;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      className={cn(
        "px-4 py-2.5 text-sm font-medium transition-colors -mb-px border-b-2",
        isActive
          ? "border-indigo-600 text-indigo-600"
          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300",
        className
      )}
      onClick={() => setActive(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={cn("pt-4", className)}>{children}</div>;
}
