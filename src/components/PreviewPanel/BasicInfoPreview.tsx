import { useResume } from '../../context/ResumeContext';
import { useStyle } from '../../context/StyleContext';
import { resumeStyles } from '../../types/styles';

export default function BasicInfoPreview() {
  const { data } = useResume();
  const { basicInfo } = data;
  const { currentStyle } = useStyle();
  const style = resumeStyles[currentStyle];

  return (
    <div className={style.spacing.section}>
      {/* 头部：头像 + 基本信息 */}
      <div className="flex items-start gap-4 mb-6">
        {basicInfo.avatar && (
          <img
            src={basicInfo.avatar}
            alt="头像"
            className="w-20 h-20 rounded-full object-cover border-2"
            style={{ borderColor: style.colors.accent }}
          />
        )}
        <div className="flex-1">
          <h1 className={`text-2xl ${style.fonts.heading} mb-1`} style={{ color: style.colors.primary }}>
            {basicInfo.name || '姓名'}
          </h1>
          <div className="flex flex-wrap gap-3 text-sm" style={{ color: style.colors.secondary }}>
            {basicInfo.location && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {basicInfo.location}
              </span>
            )}
            {basicInfo.phone && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {basicInfo.phone}
              </span>
            )}
            {basicInfo.email && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {basicInfo.email}
              </span>
            )}
            {basicInfo.wechat && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {basicInfo.wechat}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="border-b" style={{ borderColor: style.colors.accent }}></div>
    </div>
  );
}
