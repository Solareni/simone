# Simone

一个现代化的简历编辑器，支持实时预览、多主题切换和PDF导出。

## 功能特性

- **多简历管理**: 创建、编辑、删除多个简历项目
- **实时预览**: 左侧编辑，右侧实时预览简历效果
- **多种样式**: 内置多种简历模板风格
- **主题定制**: 支持自定义主题颜色
- **富文本编辑**: 基于 Quill 的所见即所得编辑器
- **PDF导出**: 支持导出为 PDF 和 PNG 格式
- **国际化**: 支持中文和英文界面切换
- **本地存储**: 数据保存在浏览器 localStorage 中
- **响应式设计**: 适配桌面和移动设备

## 技术栈

- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS 4.x
- **状态管理**: Zustand
- **国际化**: i18next
- **富文本编辑**: Quill
- **导出功能**: html2canvas, html2pdf.js
- **安全防护**: DOMPurify (XSS 防护)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
simone/
├── src/
│   ├── components/      # React 组件
│   │   ├── ConfigPanel/    # 配置面板（编辑区）
│   │   └── PreviewPanel/   # 预览面板（预览区）
│   ├── pages/          # 页面组件
│   │   ├── HomePage.tsx       # 首页（简历列表）
│   │   └── ResumeEditor.tsx   # 简历编辑器
│   ├── stores/         # Zustand 状态管理
│   │   ├── resumeStore.ts      # 简历数据状态
│   │   ├── resumeListStore.ts  # 简历列表状态
│   │   ├── styleStore.ts       # 样式状态
│   │   └── themeStore.ts       # 主题状态
│   ├── types/          # TypeScript 类型定义
│   ├── renderers/      # 文档渲染器
│   ├── transformers/   # 数据转换器
│   ├── utils/          # 工具函数
│   ├── i18n/           # 国际化配置
│   └── data/           # 初始数据
└── public/             # 静态资源
```

## 数据模型

简历数据包含以下主要部分：

- **基本信息** (BasicInfo): 头像、姓名、联系方式、地址等
- **求职意向** (JobIntention): 期望职位、薪资要求
- **工作经历** (Work): 工作经验列表
- **教育经历** (Education): 教育背景列表
- **技能特长** (Skills): 技能列表
- **自定义模块** (CustomSections): 用户自定义的简历板块
- **兴趣爱好** (Hobbies): 兴趣爱好列表
- **自定义链接** (CustomLinks): 社交链接、个人网站等

## 主要功能说明

### 创建简历

在首页点击"新建简历"按钮创建新的简历项目。

### 编辑简历

1. 在首页选择要编辑的简历
2. 左侧配置面板可以编辑简历的各个部分
3. 右侧预览面板实时显示简历效果
4. 可以切换不同的简历样式和主题

### 导出简历

在预览面板中：
- 点击"导出PDF"按钮导出为 PDF 文件
- 点击"导出PNG"按钮导出为 PNG 图片

### 切换语言

点击右上角的语言切换按钮，在中文和英文之间切换。

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发说明

### 添加新的简历样式

1. 在 `src/types/styles.ts` 中定义新样式
2. 在 `src/renderers/htmlRenderer.tsx` 中添加渲染逻辑
3. 在 `src/components/PreviewPanel/StyleSwitcher.tsx` 中添加样式选项

### 添加新的主题

1. 在 `src/types/theme.ts` 中定义新主题
2. 主题会自动应用到所有样式

### 添加新的语言

1. 在 `src/i18n/locales/` 下创建新的语言文件
2. 在 `src/i18n/config.ts` 中注册新语言

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
