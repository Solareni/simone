/**
 * 文档转换器 - 将 ResumeData 转换为 ResumeDocument
 */

import type { ResumeData, SectionItem as ResumeSectionItem } from '../types/resume';
import type {
  ResumeDocument,
  HeaderBlock,
  SectionBlock,
  ListBlock,
  SectionItem,
  RichContent,
  DateRange,
  Link,
  DocumentBlock
} from '../types/document';
import DOMPurify from 'dompurify';
import { validateAndSanitizeUrl } from '../utils/urlUtils';

/**
 * 将HTML转换为纯文本
 */
function htmlToPlainText(html: string): string {
  if (!html) return '';

  let text = html;

  // 移除HTML标签
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<li[^>]*>/gi, '- ');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<[^>]+>/g, '');

  // 解码HTML实体
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');

  // 清理多余空白
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.trim();

  return text;
}

/**
 * 创建富文本内容
 */
function createRichContent(html: string): RichContent {
  // 清理HTML以防止XSS攻击
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'strike',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'span'
    ],
    ALLOWED_ATTR: ['href'], // 移除style属性以提高安全性
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onload', 'onclick', 'onerror', 'onmouseover']
  });

  return {
    html: sanitizedHtml,
    plainText: htmlToPlainText(html),
    markdown: '' // 暂不支持Markdown格式
  };
}

/**
 * 转换日期范围
 */
function transformDateRange(item: ResumeSectionItem): DateRange | undefined {
  if (!item.startDate) return undefined;

  return {
    start: item.startDate,
    end: item.endDate,
    isCurrent: item.isCurrent
  };
}

/**
 * 转换章节项
 */
function transformSectionItem(item: ResumeSectionItem, sectionType: 'work' | 'education' | 'skills'): SectionItem {
  let title = item.title;
  let subtitle = item.subtitle;

  // 工作经历特殊处理
  if (sectionType === 'work' && item.companyName) {
    title = item.companyName;
    subtitle = item.positionName || subtitle;
  }

  return {
    id: item.id,
    title,
    subtitle,
    location: item.location,
    dateRange: transformDateRange(item),
    content: item.description ? createRichContent(item.description) : undefined
  };
}

/**
 * 创建头部块
 */
function createHeaderBlock(data: ResumeData): HeaderBlock {
  const { basicInfo, jobIntention, customLinks } = data;

  // 构建元数据
  const metadata: HeaderBlock['metadata'] = [];

  if (basicInfo.location) {
    metadata.push({ label: '地点', value: basicInfo.location, icon: '📍' });
  }
  if (basicInfo.phone) {
    metadata.push({ label: '电话', value: basicInfo.phone, icon: '📱' });
  }
  if (basicInfo.email) {
    metadata.push({ label: '邮箱', value: basicInfo.email, icon: '📧' });
  }
  if (basicInfo.wechat) {
    metadata.push({ label: '微信', value: basicInfo.wechat, icon: '💬' });
  }
  if (basicInfo.birthDate) {
    metadata.push({ label: '出生日期', value: basicInfo.birthDate, icon: '🎂' });
  }

  // 转换自定义链接
  const links: Link[] = customLinks.map(link => ({
    text: link.text,
    url: link.type === 'link' && link.url ? validateAndSanitizeUrl(link.url) || undefined : undefined
  }));

  return {
    type: 'header',
    id: 'header',
    name: basicInfo.name,
    avatar: basicInfo.avatar,
    metadata,
    jobIntention: (jobIntention.position || jobIntention.salary) ? {
      position: jobIntention.position,
      salary: jobIntention.salary
    } : undefined,
    links: links.length > 0 ? links : undefined
  };
}

/**
 * 创建章节块
 */
function createSectionBlock(
  id: string,
  title: string,
  items: ResumeSectionItem[],
  sectionType: 'work' | 'education' | 'skills',
  icon?: string
): SectionBlock | null {
  if (items.length === 0) return null;

  return {
    type: 'section',
    id,
    title,
    icon,
    items: items.map(item => transformSectionItem(item, sectionType))
  };
}

/**
 * 创建列表块
 */
function createListBlock(
  id: string,
  title: string,
  items: string[]
): ListBlock | null {
  if (items.length === 0) return null;

  return {
    type: 'list',
    id,
    title,
    items,
    separator: ' · '
  };
}

/**
 * 将 ResumeData 转换为 ResumeDocument
 */
export function transformResumeDataToDocument(data: ResumeData): ResumeDocument {
  const blocks: DocumentBlock[] = [];

  // 1. 头部信息块
  blocks.push(createHeaderBlock(data));

  // 2. 工作经历
  const workSection = createSectionBlock('work', '工作经历', data.sections.work, 'work', '💼');
  if (workSection) blocks.push(workSection);

  // 3. 教育经历
  const educationSection = createSectionBlock('education', '教育经历', data.sections.education, 'education', '🎓');
  if (educationSection) blocks.push(educationSection);

  // 4. 专业技能
  const skillsSection = createSectionBlock('skills', '专业技能', data.sections.skills, 'skills', '⚡');
  if (skillsSection) blocks.push(skillsSection);

  // 5. 自定义章节
  data.customSections.forEach(customSection => {
    const section: SectionBlock = {
      type: 'section',
      id: customSection.id,
      title: customSection.name,
      items: customSection.items.map(item => transformSectionItem(item, 'skills')),
      displayMode: customSection.displayMode
    };
    blocks.push(section);
  });

  // 6. 兴趣爱好
  const hobbiesBlock = createListBlock('hobbies', '兴趣爱好', data.hobbies);
  if (hobbiesBlock) blocks.push(hobbiesBlock);

  return {
    metadata: {
      title: data.title,
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    },
    blocks
  };
}

