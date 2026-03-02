import React, { ReactNode } from "react";

export interface TimelineItem {
  id: string;
  expandido?: boolean;
}

interface TimelineProps<T extends TimelineItem> {
  items: T[];
  renderExpandedContent: (item: T) => ReactNode;
  renderCollapsedContent: (item: T) => ReactNode;
  onExpandir?: (id: string) => void;
}

function Timeline<T extends TimelineItem>({
  items,
  renderExpandedContent,
  renderCollapsedContent,
  onExpandir,
}: TimelineProps<T>) {
  return (
    <div className="relative">
      {/* Línea vertical del timeline */}
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-vetween-teal" />

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="relative flex gap-4">
            {/* Dot del timeline */}
            <div className="relative z-10 mt-1.5 flex-shrink-0">
              <div
                className={`h-4 w-4 rounded-full border-2 border-vetween-teal ${
                  item.expandido ? "bg-vetween-teal" : "bg-white"
                }`}
              />
            </div>

            {/* Contenido del item */}
            {item.expandido ? (
              <div className="flex-1 rounded-lg border border-border bg-white p-4 shadow-sm">
                {renderExpandedContent(item)}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-between rounded-lg border border-border bg-white px-4 py-3 shadow-sm">
                {renderCollapsedContent(item)}
                <button
                  onClick={() => onExpandir?.(item.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-lg font-medium text-foreground hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timeline;
