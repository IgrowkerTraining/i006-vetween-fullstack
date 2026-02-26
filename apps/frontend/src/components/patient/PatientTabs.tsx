import React, { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface PatientTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

const PatientTabs: React.FC<PatientTabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="flex flex-col">
      {/* Tab headers */}
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-t-lg px-6 py-2.5 text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-vetween-ice text-vetween-teal font-semibold border-t border-x border-border -mb-px z-10"
                : "bg-vetween-teal text-foreground font-medium hover:bg-vetween-teal/85"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-vetween-ice rounded-b-lg rounded-tr-lg border border-border bg-card p-6">
        {activeContent}
      </div>
    </div>
  );
};

export default PatientTabs;
