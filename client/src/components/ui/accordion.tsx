import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  className?: string;
}

export function Accordion({
  children,
  type = "single",
  collapsible = true,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (type === "single") {
        // Close all others
        newSet.clear();
      }
      if (newSet.has(value)) {
        if (collapsible) {
          newSet.delete(value);
        }
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
}

export function AccordionItem({ value, children }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className="border-b border-slate-700">{children}</div>
    </AccordionItemContext.Provider>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionTrigger({
  children,
  className,
}: AccordionTriggerProps) {
  const context = useAccordionContext();
  const itemValue = React.useContext(AccordionItemContext);
  const isOpen = context?.openItems.has(itemValue || "");

  return (
    <button
      className={`flex items-center justify-between w-full p-4 text-left hover:bg-slate-800 transition-colors ${className}`}
      onClick={() => context?.toggleItem(itemValue || "")}
    >
      {children}
      <ChevronDown
        className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  const context = useAccordionContext();
  const itemValue = React.useContext(AccordionItemContext);
  const isOpen = context?.openItems.has(itemValue || "");

  if (!isOpen) return null;

  return <div className={`px-4 pb-4 ${className}`}>{children}</div>;
}

// Context for accordion
interface AccordionContextType {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

function useAccordionContext() {
  return React.useContext(AccordionContext);
}

// Context for accordion item
const AccordionItemContext = React.createContext<string>("");
