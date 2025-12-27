import { useResume } from '../../context/ResumeContext';
import { useStyle } from '../../context/StyleContext';
import { resumeStyles } from '../../types/styles';
import type { SectionItem } from '../../types/resume';

interface SectionPreviewProps {
  title: string;
  items: SectionItem[];
  sectionType: 'work' | 'education' | 'skills';
}

export default function SectionPreview({ title, items, sectionType }: SectionPreviewProps) {
  const { currentStyle } = useStyle();
  const style = resumeStyles[currentStyle];

  if (items.length === 0) return null;

  return (
    <div className={style.spacing.section}>
      <h2 className={`text-lg ${style.fonts.heading} mb-3 flex items-center gap-2`} style={{ color: style.colors.primary }}>
        <span className="w-1 h-5 rounded" style={{ backgroundColor: style.colors.primary }}></span>
        {title}
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="pl-4">
            {sectionType === 'skills' ? (
              // 技能展示
              <div>
                <h3 className={`${style.fonts.heading}`} style={{ color: style.colors.text }}>{item.title}</h3>
                {item.description && (
                  <div
                    className="text-sm mt-1 rich-text-content"
                    style={{ color: style.colors.secondary }}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            ) : (
              // 工作/教育经历展示
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className={style.fonts.heading} style={{ color: style.colors.text }}>
                    {sectionType === 'work' && item.companyName
                      ? `${item.companyName}${item.positionName ? ` - ${item.positionName}` : ''}`
                      : item.title}
                  </h3>
                  <span className="text-sm" style={{ color: style.colors.secondary }}>
                    {(sectionType === 'work' || sectionType === 'education') && item.startDate ? (
                      <>
                        {new Date(item.startDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' })} -
                        {item.isCurrent ? ' 至今' : item.endDate ? new Date(item.endDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' }) : ''}
                      </>
                    ) : item.dateRange}
                  </span>
                </div>
                {item.subtitle && (
                  <p className="text-sm mb-1" style={{ color: style.colors.secondary }}>{item.subtitle}</p>
                )}
                {item.location && (
                  <p className="text-sm mb-2" style={{ color: style.colors.secondary }}>
                    <span className="flex items-center gap-1">
                      {sectionType === 'education' ? (
                        // 教育经历使用学术帽图标（专业）
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      ) : (
                        // 工作经历使用位置图标
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {item.location}
                    </span>
                  </p>
                )}
                {item.description && (
                  <div
                    className="text-sm rich-text-content"
                    style={{ color: style.colors.text }}
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
  const { currentStyle } = useStyle();
  const style = resumeStyles[currentStyle];

  if (data.hobbies.length === 0) return null;

  return (
    <div className={style.spacing.section}>
      <h2 className={`text-lg ${style.fonts.heading} mb-3 flex items-center gap-2`} style={{ color: style.colors.primary }}>
        <span className="w-1 h-5 rounded" style={{ backgroundColor: style.colors.primary }}></span>
        爱好
      </h2>

      <div className="flex flex-wrap gap-2 pl-4">
        {data.hobbies.map((hobby, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm"
            style={{ backgroundColor: style.colors.accent, color: style.colors.text }}
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
  const { currentStyle } = useStyle();
  const style = resumeStyles[currentStyle];

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
              className="text-sm flex items-center gap-1 hover:opacity-75 transition-opacity"
              style={{ color: style.colors.primary }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {link.text}
            </a>
          ) : (
            <span className="text-sm" style={{ color: style.colors.secondary }}>{link.text}</span>
          )}
        </div>
      ))}
    </div>
  );
}
