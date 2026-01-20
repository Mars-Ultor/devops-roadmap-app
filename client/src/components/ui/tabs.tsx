import React from "react";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return <div className={`flex space-x-1 ${className}`}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabsTrigger({
  value,
  children,
  disabled,
  className,
}: TabsTriggerProps) {
  const context = useTabsContext();
  const isActive = context?.value === value;

  return (
    <button
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-slate-700 text-white"
          : "text-slate-400 hover:text-white hover:bg-slate-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={() => !disabled && context?.onValueChange(value)}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useTabsContext();
  const isActive = context?.value === value;

  if (!isActive) return null;

  return <div className={className}>{children}</div>;
}

// Context for tabs
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

function useTabsContext() {
  return React.useContext(TabsContext);
}
