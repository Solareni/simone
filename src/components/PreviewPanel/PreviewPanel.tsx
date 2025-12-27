import { useResume } from '../../context/ResumeContext';
import BasicInfoPreview from './BasicInfoPreview';
import SectionPreview, { HobbiesPreview, CustomLinksPreview } from './SectionPreview';

export default function PreviewPanel() {
  const { data } = useResume();

  return (
    <div className="flex items-start justify-center min-h-full">
      {/* A4 纸张效果 */}
      <div className="bg-white shadow-xl rounded-lg w-full max-w-[210mm] min-h-[297mm] p-8 lg:p-12">
        {/* 基本信息 */}
        <BasicInfoPreview />

        {/* 自定义链接 */}
        <CustomLinksPreview />

        {/* 工作经历 */}
        <SectionPreview
          title="工作经历"
          items={data.sections.work}
          sectionType="work"
        />

        {/* 教育经历 */}
        <SectionPreview
          title="教育经历"
          items={data.sections.education}
          sectionType="education"
        />

        {/* 专业技能 */}
        <SectionPreview
          title="专业技能"
          items={data.sections.skills}
          sectionType="skills"
        />

        {/* 爱好 */}
        <HobbiesPreview />

        {/* 如果没有任何内容，显示提示 */}
        {data.basicInfo.name === '' &&
          data.sections.work.length === 0 &&
          data.sections.education.length === 0 &&
          data.sections.skills.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>在左侧填写信息，此处将实时预览简历效果</p>
            </div>
          )}
      </div>
    </div>
  );
}
