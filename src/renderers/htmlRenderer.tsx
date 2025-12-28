/**
 * HTML/React渲染器 - 将ResumeDocument渲染为React组件
 * 基于统一的文档模型,支持多种样式主题
 * 使用共享的HTML生成逻辑,确保与PDF导出完全一致
 */

import type {
  ResumeDocument,
  RenderOptions
} from '../types/document';
import { resumeStyles } from '../types/styles';
import { generateDocumentHTML } from './shared/htmlGenerator';
import DOMPurify from 'dompurify';

interface HTMLRendererProps {
  document: ResumeDocument;
  options?: RenderOptions;
}

/**
 * 文档渲染器组件 - 基于文档模型渲染整个简历
 * 使用共享的HTML生成逻辑,确保预览和PDF导出完全一致
 */
export function DocumentRenderer({ document, options = {} }: HTMLRendererProps) {
  const style = resumeStyles[options.style || 'modern'];

  // 使用共享的HTML生成函数
  const html = generateDocumentHTML(document, options);

  // 使用DOMPurify清理HTML，防止XSS攻击
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <div
      className="resume-content"
      style={{
        color: style.colors.text,
        backgroundColor: style.colors.background
      }}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
