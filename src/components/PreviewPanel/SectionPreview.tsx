import { useResume } from '../../context/ResumeContext';
import type { SectionItem } from '../../types/resume';

interface SectionPreviewProps {
  title: string;
  items: SectionItem[];
  sectionType: 'work' | 'education' | 'skills';
}

export default function SectionPreview({ title, items, sectionType }: SectionPreviewProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-blue-600 rounded"></span>
        {title}
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="pl-4">
            {sectionType === 'skills' ? (
              // 技能展示
              <div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                {item.description && (
                  <div
                    className="text-sm text-gray-600 mt-1 rich-text-content"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            ) : (
              // 工作/教育经历展示
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">
                    {sectionType === 'work' && item.companyName 
                      ? `${item.companyName}${item.positionName ? ` - ${item.positionName}` : ''}`
                      : item.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {sectionType === 'work' && item.startDate ? (
                      <>
                        {new Date(item.startDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' })} - 
                        {item.isCurrent ? ' 至今' : item.endDate ? new Date(item.endDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' }) : ''}
                      </>
                    ) : item.dateRange}
                  </span>
                </div>
                {item.subtitle && (
                  <p className="text-sm text-gray-600 mb-1">{item.subtitle}</p>
                )}
                {item.location && (
                  <p className="text-sm text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </span>
                  </p>
                )}
                {item.description && (
                  <div 
                    className="text-sm text-gray-700 rich-text-content"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HobbiesPreview() {
  const { data } = useResume();

  if (data.hobbies.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-blue-600 rounded"></span>
        爱好
      </h2>

      <div className="flex flex-wrap gap-2 pl-4">
        {data.hobbies.map((hobby, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {hobby}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CustomLinksPreview() {
  const { data } = useResume();

  if (data.customLinks.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {data.customLinks.map((link) => (
        <div key={link.id}>
          {link.type === 'link' ? (
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {link.text}
            </a>
          ) : (
            <span className="text-sm text-gray-600">{link.text}</span>
          )}
        </div>
      ))}
    </div>
  );
}
