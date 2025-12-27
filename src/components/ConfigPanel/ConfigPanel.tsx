import { useResume } from '../../context/ResumeContext';
import Navigator from './Navigator';
import BasicInfoForm from './BasicInfoForm';
import CustomLinksEditor from './CustomLinksEditor';
import SectionEditor from './SectionEditor';
import HobbiesEditor from './HobbiesEditor';

export default function ConfigPanel() {
  const { data, dispatch } = useResume();

  return (
    <div className="bg-white">
      {/* 头部：简历标题 + AI翻译按钮 */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <input
              type="text"
              value={data.title}
              onChange={(e) => dispatch({ type: 'UPDATE_TITLE', title: e.target.value })}
              className="text-2xl font-bold text-gray-900 border-none focus:outline-none focus:ring-0 flex-1 bg-transparent placeholder:text-gray-400"
              placeholder="未命名简历"
            />
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium whitespace-nowrap">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              AI 智能翻译
            </button>
          </div>
        </div>

        {/* 导航菜单 */}
        <Navigator />
      </div>

      {/* 各个配置section */}
      <div className="pb-20">
        <BasicInfoForm />
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
