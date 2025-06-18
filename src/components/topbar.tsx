"use client";

import { ReactNode } from "react";

interface TabItem<T extends string> {
  key: T;
  label: string;
}

export default function TopBar<T extends string>({
  title,
  tabs,
  activeTab,
  setActiveTab,
  rightElement,
}: {
  title: string;
  tabs: TabItem<T>[];
  activeTab: T;
  setActiveTab: (key: T) => void;
  rightElement?: ReactNode;
}) {
  return (
    <div className="relative bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
      <div className="absolute top-6 left-6 w-fit font-semibold text-[20px]">
        {title}
      </div>
      {rightElement && (
        <div className="absolute top-6 right-6 w-fit">
          {rightElement}
        </div>
      )}
      <div className="absolute mt-[55px] flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 ${
              activeTab === tab.key
                ? "bg-[#F1F3F7] font-medium rounded-t-lg"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
