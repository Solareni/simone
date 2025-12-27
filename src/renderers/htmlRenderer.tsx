/**
 * HTML/React渲染器 - 将ResumeDocument渲染为React组件
 * 基于统一的文档模型,支持多种样式主题
 */

import type {
  ResumeDocument,
  HeaderBlock,
  SectionBlock,
  ListBlock,
  DocumentBlock,
  SectionItem,
  RenderOptions
} from '../types/document';
import { formatDateRange } from '../transformers/documentTransformer';
import { resumeStyles } from '../types/styles';
import type { ResumeStyle } from '../types/styles';

interface HTMLRendererProps {
  document: ResumeDocument;
  options?: RenderOptions;
}

/**
 * 文档渲染器组件 - 基于文档模型渲染整个简历
 */
export function DocumentRenderer({ document, options = {} }: HTMLRendererProps) {
  const style = resumeStyles[options.style || 'modern'];

  return (
    <div
      className="resume-content"
      style={{
        color: style.colors.text,
        backgroundColor: style.colors.background
      }}
    >
      {document.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} options={options} />
      ))}
    </div>
  );
}

/**
 * 块渲染器 - 根据块类型渲染不同的内容
 */
function BlockRenderer({ block, options }: { block: DocumentBlock; options: RenderOptions }) {
  switch (block.type) {
    case 'header':
      return <HeaderBlockRenderer block={block} options={options} />;
    case 'section':
      return <SectionBlockRenderer block={block} options={options} />;
    case 'list':
      return <ListBlockRenderer block={block} options={options} />;
    case 'divider':
      return <DividerRenderer />;
    default:
      return null;
  }
}

/**
 * 头部块渲染器
 */
function HeaderBlockRenderer({ block, options }: { block: HeaderBlock; options: RenderOptions }) {
  const style = resumeStyles[options.style || 'modern'];

  return (
    <div className={style.spacing.section}>
      {/* 头部：头像 + 基本信息 */}
      <div className="flex items-start gap-4 mb-6">
        {options.includeAvatar && block.avatar && (
          <img
            src={block.avatar}
            alt="头像"
            className="w-20 h-20 rounded-full object-cover border-2"
            style={{ borderColor: style.colors.accent }}
          />
        )}
        <div className="flex-1">
          <h1
            className={`text-2xl ${style.fonts.heading} mb-1`}
            style={{ color: style.colors.primary }}
          >
            {block.name || '姓名'}
          </h1>

          {/* 元数据(联系方式等) */}
          <div className="flex flex-wrap gap-3 text-sm" style={{ color: style.colors.secondary }}>
            {block.metadata.map((meta, index) => (
              <MetadataItem key={index} meta={meta} />
            ))}
          </div>
        </div>
      </div>

      {/* 自定义链接 */}
      {block.links && block.links.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {block.links.map((link, index) => (
            <div key={index}>
              {link.url ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm flex items-center gap-1 hover:opacity-75 transition-opacity"
                  style={{ color: style.colors.primary }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  {link.text}
                </a>
              ) : (
                <span className="text-sm" style={{ color: style.colors.secondary }}>
                  {link.text}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 求职意向 */}
      {block.jobIntention && (
        <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: style.colors.accent }}>
          <div className="flex gap-6">
            {block.jobIntention.position && (
              <div>
                <span className="text-sm" style={{ color: style.colors.secondary }}>
                  求职职位:
                </span>
                <span className={`ml-2 ${style.fonts.heading}`}>{block.jobIntention.position}</span>
              </div>
            )}
            {block.jobIntention.salary && (
              <div>
                <span className="text-sm" style={{ color: style.colors.secondary }}>
                  期望薪资:
                </span>
                <span className={`ml-2 ${style.fonts.heading}`}>{block.jobIntention.salary}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 分隔线 */}
      <div className="border-b" style={{ borderColor: style.colors.accent }}></div>
    </div>
  );
}

/**
 * 元数据项渲染器
 */
function MetadataItem({ meta }: { meta: { label: string; value: string; icon?: string } }) {
  const label = meta.label.toLowerCase();

  if (label === '地点') {
    return (
      <span className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {meta.value}
      </span>
    );
  }

  if (label === '电话') {
    return (
      <span className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
        {meta.value}
      </span>
    );
  }

  if (label === '邮箱') {
    return (
      <span className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        {meta.value}
      </span>
    );
  }

  if (label === '微信') {
    return (
      <span className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {meta.value}
      </span>
    );
  }

  // 默认显示
  return (
    <span className="flex items-center gap-1">
      {meta.value}
    </span>
  );
}

/**
 * 章节块渲染器
 */
function SectionBlockRenderer({ block, options }: { block: SectionBlock; options: RenderOptions }) {
  const style = resumeStyles[options.style || 'modern'];

  if (block.items.length === 0) return null;

  return (
    <div className={style.spacing.section}>
      {/* 章节标题 */}
      <h2
        className={`text-lg ${style.fonts.heading} mb-3 flex items-center gap-2`}
        style={{ color: style.colors.primary }}
      >
        <span className="w-1 h-5 rounded" style={{ backgroundColor: style.colors.primary }}></span>
        {options.showIcons && block.icon && <span>{block.icon}</span>}
        {block.title}
      </h2>

      {/* 章节内容 */}
      {block.displayMode === 'tag' ? (
        <TagModeRenderer items={block.items} options={options} />
      ) : (
        <div className="space-y-4">
          {block.items.map((item) => (
            <SectionItemRenderer key={item.id} item={item} options={options} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * 章节项渲染器
 */
function SectionItemRenderer({ item, options }: { item: SectionItem; options: RenderOptions }) {
  const style = resumeStyles[options.style || 'modern'];

  return (
    <div className="pl-4">
      {/* 标题和日期 */}
      <div className="flex items-baseline justify-between mb-1">
        <h3 className={style.fonts.heading} style={{ color: style.colors.text }}>
          {item.title}
          {item.subtitle && <span className="ml-2 font-normal">{item.subtitle}</span>}
        </h3>

        {item.dateRange && (
          <span className="text-sm whitespace-nowrap ml-4" style={{ color: style.colors.secondary }}>
            {formatDateRange(item.dateRange, options.dateFormat)}
          </span>
        )}
      </div>

      {/* 位置 */}
      {item.location && (
        <p className="text-sm mb-1" style={{ color: style.colors.secondary }}>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {item.location}
          </span>
        </p>
      )}

      {/* 内容 */}
      {item.content && (
        <div
          className="text-sm rich-text-content"
          style={{ color: style.colors.text }}
          dangerouslySetInnerHTML={{ __html: item.content.html }}
        />
      )}
    </div>
  );
}

/**
 * 标签模式渲染器
 */
function TagModeRenderer({ items, options }: { items: SectionItem[]; options: RenderOptions }) {
  const style = resumeStyles[options.style || 'modern'];

  return (
    <div className="flex flex-wrap gap-2 pl-4">
      {items.map((item) => (
        <span
          key={item.id}
          className="px-3 py-1 rounded-full text-sm"
          style={{
            backgroundColor: style.colors.accent,
            color: style.colors.text
          }}
        >
          {item.title}
          {item.content?.plainText && `: ${item.content.plainText}`}
        </span>
      ))}
    </div>
  );
}

/**
 * 列表块渲染器 (用于兴趣爱好等)
 */
function ListBlockRenderer({ block, options }: { block: ListBlock; options: RenderOptions }) {
  const style = resumeStyles[options.style || 'modern'];

  if (block.items.length === 0) return null;

  return (
    <div className={style.spacing.section}>
      {/* 列表标题 */}
      <h2
        className={`text-lg ${style.fonts.heading} mb-3 flex items-center gap-2`}
        style={{ color: style.colors.primary }}
      >
        <span className="w-1 h-5 rounded" style={{ backgroundColor: style.colors.primary }}></span>
        {block.title}
      </h2>

      {/* 列表项 */}
      <div className="flex flex-wrap gap-2 pl-4">
        {block.items.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: style.colors.accent,
              color: style.colors.text
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 分隔符渲染器
 */
function DividerRenderer() {
  return <hr className="my-6 border-gray-200" />;
}

/**
 * 使用示例:
 *
 * import { useResume } from '../context/ResumeContext';
 * import { transformResumeDataToDocument } from '../transformers/documentTransformer';
 * import { DocumentRenderer } from '../renderers/htmlRenderer';
 *
 * function PreviewPanel() {
 *   const { data } = useResume();
 *   const { currentStyle } = useStyle();
 *
 *   // 转换为文档模型
 *   const document = transformResumeDataToDocument(data);
 *
 *   // 渲染预览
 *   return (
 *     <DocumentRenderer
 *       document={document}
 *       options={{
 *         style: currentStyle,
 *         includeAvatar: true,
 *         showIcons: false,
 *         dateFormat: 'YYYY-MM'
 *       }}
 *     />
 *   );
 * }
 */
