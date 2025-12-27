import { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function Section({ id, title, description, children }: SectionProps) {
  return (
    <div className="p-6 lg:p-8 border-t border-gray-200" id={id}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
