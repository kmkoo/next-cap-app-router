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
    <div className="bg-white h-[110px] pt-4 px-4 py-2 border-b border-gray-300">
      <div className="flex justify-between items-center mx-1 p-1 text-[20px]">
        <div>{title}</div>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className="flex flex-row gap-4 mt-4">
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
