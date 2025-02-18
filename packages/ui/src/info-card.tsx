import type { ReactNode } from "react";

interface InfoCardProps {
  title: string | ReactNode;
  content?: string | ReactNode;
  items: Item[] | undefined;
}

interface Item {
  label: string;
  content: string | null | undefined;
}

export default function InfoCard({ title, content, items }: InfoCardProps) {
  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          {content}
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {items?.map((item, index) => {
            return (
              <div
                key={`_${index}`}
                className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
              >
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  {item.label}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {item.content}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
