import { useResumeStore } from '../../stores/resumeStore';
import Navigator from './Navigator';
import BasicInfoForm from './BasicInfoForm';
import JobIntentionEditor from './JobIntentionEditor';
import CustomLinksEditor from './CustomLinksEditor';
import SectionEditor from './SectionEditor';
import HobbiesEditor from './HobbiesEditor';
import { useTranslation } from 'react-i18next';

export default function ConfigPanel() {
  const { t } = useTranslation();
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
            placeholder={t('homePage.untitledResume')}
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
          title={t('sections.work')}
          description={t('sections.workDescription')}
          id="work-experience"
        />
        <SectionEditor
          sectionType="education"
          title={t('sections.education')}
          description={t('sections.educationDescription')}
          id="education"
        />
        <SectionEditor
          sectionType="skills"
          title={t('sections.skills')}
          description={t('sections.skillsDescription')}
          id="skills"
        />
        <HobbiesEditor />
      </div>
    </div>
  );
}
