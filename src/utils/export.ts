import type { ResumeData } from '../types/resume';
import html2pdf from 'html2pdf.js';

// 将HTML转换为纯文本Markdown
function htmlToMarkdown(html: string): string {
  if (!html) return '';

  let text = html;

  // 转换标题
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n## $1\n');
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n### $1\n');
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n#### $1\n');

  // 转换粗体和斜体
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // 转换链接
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // 转换列表
  text = text.replace(/<ul[^>]*>/gi, '\n');
  text = text.replace(/<\/ul>/gi, '\n');
  text = text.replace(/<ol[^>]*>/gi, '\n');
  text = text.replace(/<\/ol>/gi, '\n');
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

  // 转换段落和换行
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  text = text.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');

  // 移除所有其他HTML标签
  text = text.replace(/<[^>]*>/g, '');

  // 转换HTML实体
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');

  // 清理多余的空行
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

export function exportToMarkdown(data: ResumeData): string {
  const { basicInfo, jobIntention, customLinks, sections, hobbies } = data;

  let markdown = `# ${data.title || '简历'}\n\n`;

  // 基本信息
  markdown += `## 基本信息\n\n`;
  if (basicInfo.name) markdown += `**姓名**: ${basicInfo.name}\n\n`;
  if (basicInfo.location) markdown += `**地点**: ${basicInfo.location}\n\n`;
  if (basicInfo.phone) markdown += `**电话**: ${basicInfo.phone}\n\n`;
  if (basicInfo.email) markdown += `**邮箱**: ${basicInfo.email}\n\n`;
  if (basicInfo.wechat) markdown += `**微信**: ${basicInfo.wechat}\n\n`;
  if (basicInfo.birthDate) markdown += `**出生日期**: ${basicInfo.birthDate}\n\n`;

  // 自定义链接
  if (customLinks.length > 0) {
    markdown += `## 链接\n\n`;
    customLinks.forEach(link => {
      if (link.type === 'link') {
        markdown += `- [${link.text}](${link.url})\n`;
      } else {
        markdown += `- ${link.text}\n`;
      }
    });
    markdown += '\n';
  }

  // 求职意向
  if (jobIntention.position || jobIntention.salary) {
    markdown += `## 求职意向\n\n`;
    if (jobIntention.position) markdown += `**职位**: ${jobIntention.position}\n\n`;
    if (jobIntention.salary) markdown += `**薪资**: ${jobIntention.salary}\n\n`;
  }

  // 工作经历
  if (sections.work.length > 0) {
    markdown += `## 工作经历\n\n`;
    sections.work.forEach(item => {
      markdown += `### ${item.companyName || item.title}`;
      if (item.positionName) markdown += ` - ${item.positionName}`;
      markdown += '\n\n';

      if (item.location || item.startDate) {
        markdown += '**';
        if (item.location) markdown += item.location;
        if (item.location && item.startDate) markdown += ' · ';
        if (item.startDate) {
          markdown += `${item.startDate} - ${item.isCurrent ? '至今' : item.endDate || ''}`;
        }
        markdown += '**\n\n';
      }

      if (item.description) {
        const plainText = htmlToMarkdown(item.description);
        markdown += `${plainText}\n\n`;
      }
    });
  }

  // 教育经历
  if (sections.education.length > 0) {
    markdown += `## 教育经历\n\n`;
    sections.education.forEach(item => {
      markdown += `### ${item.title}\n\n`;
      if (item.subtitle) markdown += `**${item.subtitle}**\n\n`;
      if (item.location || item.startDate) {
        markdown += '**';
        if (item.location) markdown += item.location;
        if (item.location && item.startDate) markdown += ' · ';
        if (item.startDate) {
          markdown += `${item.startDate} - ${item.isCurrent ? '至今' : item.endDate || ''}`;
        }
        markdown += '**\n\n';
      }
      if (item.description) {
        const plainText = htmlToMarkdown(item.description);
        markdown += `${plainText}\n\n`;
      }
    });
  }

  // 专业技能
  if (sections.skills.length > 0) {
    markdown += `## 专业技能\n\n`;
    sections.skills.forEach(item => {
      markdown += `### ${item.title}\n\n`;
      if (item.description) {
        const plainText = htmlToMarkdown(item.description);
        markdown += `${plainText}\n\n`;
      }
    });
  }

  // 爱好
  if (hobbies.length > 0) {
    markdown += `## 兴趣爱好\n\n`;
    markdown += hobbies.join(' · ') + '\n\n';
  }

  return markdown;
}

export function downloadMarkdown(markdown: string, filename: string = 'resume.md') {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(filename: string = 'resume.pdf') {
  // 获取简历预览的DOM元素 - 使用data属性选择器更可靠
  const element = document.querySelector('[data-resume-content]') as HTMLElement;

  if (!element) {
    console.error('未找到简历预览内容');
    alert('未找到简历预览内容，请稍后重试');
    return;
  }

  // 保存原始样式
  const originalBoxShadow = element.style.boxShadow;
  const originalBorderRadius = element.style.borderRadius;

  // 临时移除装饰性样式，使PDF更简洁
  element.style.boxShadow = 'none';
  element.style.borderRadius = '0';

  // 配置PDF选项
  const opt = {
    margin: [12, 12, 12, 12], // 上右下左边距（毫米），与预览padding匹配
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 3, // 提高清晰度
      useCORS: true, // 支持跨域图片
      letterRendering: true,
      logging: false,
      backgroundColor: null, // 保留透明背景，使用元素自身的背景色
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait', // 纵向
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    // 生成并下载PDF
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF导出失败:', error);
    alert('PDF导出失败，请重试');
  } finally {
    // 恢复原始样式
    element.style.boxShadow = originalBoxShadow;
    element.style.borderRadius = originalBorderRadius;
  }
}
