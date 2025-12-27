/**
 * 简历文档模型 - 与渲染无关的中间表示层
 * 所有渲染器(HTML/Markdown/PDF)都基于此模型工作
 */

// ==================== 内容类型 ====================

/**
 * 富文本内容 - 支持多种格式表示
 */
export interface RichContent {
  /** HTML格式(用于预览和DOM操作) */
  html: string;
  /** 纯文本(用于搜索和简单显示) */
  plainText: string;
  /** Markdown格式(用于导出) */
  markdown: string;
}

/**
 * 日期范围
 */
export interface DateRange {
  /** 开始日期 (YYYY-MM 格式) */
  start: string;
  /** 结束日期 (YYYY-MM 格式) */
  end?: string;
  /** 是否至今 */
  isCurrent?: boolean;
}

/**
 * 链接信息
 */
export interface Link {
  /** 显示文本 */
  text: string;
  /** 链接地址(可选,如果没有则显示为纯文本) */
  url?: string;
}

// ==================== 文档块类型 ====================

/**
 * 块类型枚举
 */
export type BlockType =
  | 'header'      // 头部信息块(基本信息、头像等)
  | 'section'     // 章节块(工作经历、教育经历等)
  | 'list'        // 列表块(爱好等)
  | 'divider';    // 分隔符

/**
 * 基础块接口
 */
export interface BaseBlock {
  /** 块类型 */
  type: BlockType;
  /** 唯一标识 */
  id: string;
}

/**
 * 头部块 - 用于基本信息展示
 */
export interface HeaderBlock extends BaseBlock {
  type: 'header';
  /** 姓名 */
  name: string;
  /** 头像URL */
  avatar?: string;
  /** 元数据(联系方式等) */
  metadata: Array<{
    label: string;
    value: string;
    icon?: string;
  }>;
  /** 求职意向 */
  jobIntention?: {
    position?: string;
    salary?: string;
  };
  /** 自定义链接 */
  links?: Link[];
}

/**
 * 章节项 - 工作/教育经历等的具体条目
 */
export interface SectionItem {
  /** 唯一标识 */
  id: string;
  /** 主标题 */
  title: string;
  /** 副标题(学校专业/职位等) */
  subtitle?: string;
  /** 位置(城市等) */
  location?: string;
  /** 日期范围 */
  dateRange?: DateRange;
  /** 详细描述(富文本) */
  content?: RichContent;
  /** 显示模式(用于渲染提示) */
  displayMode?: 'single' | 'double' | 'tag';
}

/**
 * 章节块 - 用于组织多个相关条目
 */
export interface SectionBlock extends BaseBlock {
  type: 'section';
  /** 章节标题 */
  title: string;
  /** 章节图标(可选) */
  icon?: string;
  /** 章节项列表 */
  items: SectionItem[];
  /** 显示模式 */
  displayMode?: 'single' | 'double' | 'tag';
}

/**
 * 列表块 - 用于简单列表展示
 */
export interface ListBlock extends BaseBlock {
  type: 'list';
  /** 列表标题 */
  title: string;
  /** 列表项 */
  items: string[];
  /** 分隔符(默认为 ' · ') */
  separator?: string;
}

/**
 * 分隔符块
 */
export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

/**
 * 文档块联合类型
 */
export type DocumentBlock =
  | HeaderBlock
  | SectionBlock
  | ListBlock
  | DividerBlock;

// ==================== 文档结构 ====================

/**
 * 简历文档 - 完整的文档模型
 */
export interface ResumeDocument {
  /** 文档元数据 */
  metadata: {
    /** 简历标题 */
    title: string;
    /** 简历ID */
    id?: string;
    /** 创建时间 */
    createdAt?: string;
    /** 更新时间 */
    updatedAt?: string;
  };
  /** 文档块列表(有序) */
  blocks: DocumentBlock[];
}

// ==================== 渲染选项 ====================

/**
 * 渲染选项 - 用于控制渲染行为
 */
export interface RenderOptions {
  /** 样式主题 */
  style?: 'modern' | 'classic' | 'minimal' | 'professional';
  /** 是否包含头像 */
  includeAvatar?: boolean;
  /** 日期格式 */
  dateFormat?: 'YYYY-MM' | 'YYYY/MM' | 'YYYY.MM';
  /** 是否显示图标 */
  showIcons?: boolean;
}
