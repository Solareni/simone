import { useResume } from '../../context/ResumeContext';
import { useStyle } from '../../context/StyleContext';
import { resumeStyles } from '../../types/styles';

export default function JobIntentionPreview() {
  const { data } = useResume();
  const { jobIntention } = data;
  const { currentStyle } = useStyle();
  const style = resumeStyles[currentStyle];

  // 如果所有字段都为空，不显示这个板块
  if (!jobIntention.position && !jobIntention.salary) {
    return null;
  }

  return (
    <div className={style.spacing.section}>
      <h2 className={`text-lg ${style.fonts.heading} mb-3 flex items-center gap-2`} style={{ color: style.colors.primary }}>
        <span className="w-1 h-5 rounded" style={{ backgroundColor: style.colors.primary }}></span>
        求职意向
      </h2>

      <div className="pl-4">
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: style.colors.text }}>
          {jobIntention.position && (
            <span>
              <span style={{ color: style.colors.secondary }}>职位：</span>
              {jobIntention.position}
            </span>
          )}
          {jobIntention.salary && (
            <span>
              <span style={{ color: style.colors.secondary }}>薪资：</span>
              {jobIntention.salary}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
