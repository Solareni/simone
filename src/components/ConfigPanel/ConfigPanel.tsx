import { useResumeStore } from '../../stores/resumeStore';
import Navigator from './Navigator';
import BasicInfoForm from './BasicInfoForm';
import JobIntentionEditor from './JobIntentionEditor';
import CustomLinksEditor from './CustomLinksEditor';
import SectionEditor from './SectionEditor';
import HobbiesEditor from './HobbiesEditor';

export default function ConfigPanel() {
  const data = useResumeStore((state) => state.data);
  const updateTitle = useResumeStore((state) => state.updateTitle);

  return (
    <div className="bg-white">
      {/* 头部：简历标题 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-6 lg:pl-40 lg:pr-8 py-5">
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="text-2xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0 w-full bg-transparent placeholder:text-gray-400"
            placeholder="未命名简历"
          />
        </div>

        {/* 导航菜单 */}
        <Navigator />
      </div>

      {/* 各个配置section */}
      <div className="pb-20">
        <BasicInfoForm />
        <JobIntentionEditor />
        <CustomLinksEditor />
        <SectionEditor
          sectionType="work"
          title="工作经历"
          description="列出你认为最重要最近十年的工作经历，最新放在最前面"
          id="work-experience"
        />
        <SectionEditor
          sectionType="education"
          title="教育经历"
          description="列出最近你的教育经历，选取该过程中的亮点"
          id="education"
        />
        <SectionEditor
          sectionType="skills"
          title="专业技能"
          description="列出你的专业技能，通过主次分明的方式详细介绍技能的应用"
          id="skills"
        />
        <HobbiesEditor />
      </div>
    </div>
  );
}
