import { useResume } from '../../context/ResumeContext';

export default function JobIntentionEditor() {
  const { data, dispatch } = useResume();
  const { jobIntention } = data;

  const handleUpdate = (field: keyof typeof jobIntention, value: string) => {
    dispatch({ type: 'UPDATE_JOB_INTENTION', payload: { [field]: value } });
  };

  return (
    <div className="p-6 lg:p-8" id="job-intention">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">求职意向</h2>
        <p className="text-sm text-gray-500">
          填写你的期望职位和薪资范围
        </p>
      </div>

      {/* 两列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">职位</label>
          <input
            type="text"
            value={jobIntention.position || ''}
            onChange={(e) => handleUpdate('position', e.target.value)}
            placeholder="例如：前端开发工程师"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">薪资</label>
          <input
            type="text"
            value={jobIntention.salary || ''}
            onChange={(e) => handleUpdate('salary', e.target.value)}
            placeholder="例如：15-20K"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
