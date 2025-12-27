/**
 * Markdown渲染器 - 将ResumeDocument渲染为Markdown格式
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

/**
 * Markdown渲染器类
 */
export class MarkdownRenderer {
  private options: RenderOptions;

  constructor(options: RenderOptions = {}) {
    this.options = {
      dateFormat: 'YYYY-MM',
      includeAvatar: false,
      showIcons: false,
      ...options
    };
  }

  /**
   * 渲染完整文档
   */
  render(document: ResumeDocument): string {
    let markdown = '';

    // 文档标题
    markdown += `# ${document.metadata.title}\n\n`;

    // 渲染所有块
    document.blocks.forEach(block => {
      const blockMarkdown = this.renderBlock(block);
      if (blockMarkdown) {
        markdown += blockMarkdown + '\n';
      }
    });

    return markdown;
  }

  /**
   * 渲染单个块
   */
  private renderBlock(block: DocumentBlock): string {
    switch (block.type) {
      case 'header':
        return this.renderHeaderBlock(block);
      case 'section':
        return this.renderSectionBlock(block);
      case 'list':
        return this.renderListBlock(block);
      case 'divider':
        return '---\n\n';
      default:
        return '';
    }
  }

  /**
   * 渲染头部块
   */
  private renderHeaderBlock(block: HeaderBlock): string {
    let markdown = '';

    // 基本信息
    markdown += '## 基本信息\n\n';

    if (block.name) {
      markdown += `**姓名**: ${block.name}\n\n`;
    }

    // 元数据(联系方式等)
    block.metadata.forEach(meta => {
      const icon = this.options.showIcons && meta.icon ? `${meta.icon} ` : '';
      markdown += `**${icon}${meta.label}**: ${meta.value}\n\n`;
    });

    // 自定义链接
    if (block.links && block.links.length > 0) {
      markdown += '## 链接\n\n';
      block.links.forEach(link => {
        if (link.url) {
          markdown += `- [${link.text}](${link.url})\n`;
        } else {
          markdown += `- ${link.text}\n`;
        }
      });
      markdown += '\n';
    }

    // 求职意向
    if (block.jobIntention) {
      markdown += '## 求职意向\n\n';
      if (block.jobIntention.position) {
        markdown += `**职位**: ${block.jobIntention.position}\n\n`;
      }
      if (block.jobIntention.salary) {
        markdown += `**薪资**: ${block.jobIntention.salary}\n\n`;
      }
    }

    return markdown;
  }

  /**
   * 渲染章节块
   */
  private renderSectionBlock(block: SectionBlock): string {
    let markdown = '';

    // 章节标题
    const icon = this.options.showIcons && block.icon ? `${block.icon} ` : '';
    markdown += `## ${icon}${block.title}\n\n`;

    // 根据显示模式渲染
    if (block.displayMode === 'tag') {
      // 标签模式 - 横向排列
      markdown += this.renderItemsAsInline(block.items);
    } else {
      // 标准模式 - 列表展示
      block.items.forEach(item => {
        markdown += this.renderSectionItem(item);
      });
    }

    return markdown;
  }

  /**
   * 渲染章节项
   */
  private renderSectionItem(item: SectionItem): string {
    let markdown = '';

    // 标题
    markdown += `### ${item.title}`;
    if (item.subtitle) {
      markdown += ` - ${item.subtitle}`;
    }
    markdown += '\n\n';

    // 位置和日期
    const locationParts: string[] = [];
    if (item.location) {
      locationParts.push(item.location);
    }
    if (item.dateRange) {
      locationParts.push(formatDateRange(item.dateRange, this.options.dateFormat));
    }

    if (locationParts.length > 0) {
      markdown += `**${locationParts.join(' · ')}**\n\n`;
    }

    // 内容
    if (item.content) {
      markdown += `${item.content.markdown}\n\n`;
    }

    return markdown;
  }

  /**
   * 以内联方式渲染项目(用于标签模式)
   */
  private renderItemsAsInline(items: SectionItem[]): string {
    const tags = items.map(item => {
      if (item.content?.plainText) {
        return `${item.title}: ${item.content.plainText}`;
      }
      return item.title;
    });

    return tags.join(' · ') + '\n\n';
  }

  /**
   * 渲染列表块
   */
  private renderListBlock(block: ListBlock): string {
    let markdown = '';

    // 列表标题
    markdown += `## ${block.title}\n\n`;

    // 列表项
    const separator = block.separator || ' · ';
    markdown += block.items.join(separator) + '\n\n';

    return markdown;
  }
}

/**
 * 便捷函数: 将文档渲染为Markdown
 */
export function renderToMarkdown(document: ResumeDocument, options?: RenderOptions): string {
  const renderer = new MarkdownRenderer(options);
  return renderer.render(document);
}
