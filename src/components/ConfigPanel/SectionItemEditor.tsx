import { useState, useEffect } from 'react';
import type { SectionItem } from '../../types/resume';
import RichTextEditor from './RichTextEditor';

interface SectionItemEditorProps {
  sectionType: 'work' | 'education' | 'skills';
  item: SectionItem | null;
  onSave: (item: Partial<SectionItem>) => void;
  onCancel: () => void;
}

export default function SectionItemEditor({ sectionType, item, onSave, onCancel }: SectionItemEditorProps) {
  const [formData, setFormData] = useState<Partial<SectionItem>>({});

  // 初始化表单数据
  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // 新建项目时的默认值
      const defaultItem: Partial<SectionItem> = {
        title: '',
        subtitle: '',
        location: '',
        dateRange: '',
        description: '',
      };

      if (sectionType === 'work') {
        Object.assign(defaultItem, {
          companyName: '',
          positionName: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
        });
      }

      if (sectionType === 'education') {
        Object.assign(defaultItem, {
          startDate: '',
          endDate: '',
          isCurrent: false,
        });
      }

      setFormData(defaultItem);
    }
  }, [item, sectionType]);

  const handleSave = () => {
    const dataToSave = { ...formData };

    // 根据不同类型设置兼容性字段
    if (sectionType === 'work' && formData.companyName) {
      dataToSave.title = formData.companyName;
      // 设置 dateRange 用于兼容性
      if (formData.startDate) {
        const startDate = new Date(formData.startDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' });
        const endDate = formData.isCurrent
          ? '至今'
          : formData.endDate
            ? new Date(formData.endDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' })
            : '';
        dataToSave.dateRange = `${startDate} - ${endDate}`;
      }
    } else if (sectionType === 'education') {
      // 教育经历的 title 是学校名称，subtitle 是专业
      dataToSave.title = formData.title || '';
      dataToSave.subtitle = formData.subtitle || '';
      // 设置 dateRange 用于兼容性
      if (formData.startDate) {
        const startDate = new Date(formData.startDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' });
        const endDate = formData.isCurrent
          ? '至今'
          : formData.endDate
            ? new Date(formData.endDate + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'numeric' })
            : '';
        dataToSave.dateRange = `${startDate} - ${endDate}`;
      }
    }

    onSave(dataToSave);
  };

  const renderWorkFields = () => (
    <>
      {/* 第一行：公司名称和职位名称 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">公司名称</label>
          <input
            type="text"
            value={formData.companyName || ''}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="公司名称"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">职位名称</label>
          <input
            type="text"
            value={formData.positionName || ''}
            onChange={(e) => setFormData({ ...formData, positionName: e.target.value })}
            placeholder="职位名称"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
          />
        </div>
      </div>

      {/* 第二行：所在城市和工作日期 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">所在城市</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="所在城市"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">工作日期</label>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <input
                type="month"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="开始日期"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
              />
            </div>
            <span className="px-2 text-gray-500 mb-3">至</span>
            <div className="flex-1">
              <input
                type="month"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value, isCurrent: false })}
                placeholder="结束日期"
                disabled={formData.isCurrent}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isCurrent || false}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? undefined : formData.endDate })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">在职</span>
            </label>
          </div>
        </div>
      </div>

      {/* 第三行：富文本编辑器 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">职责和成就</label>
        {typeof window !== 'undefined' ? (
          <RichTextEditor
            key={item?.id || 'new-work'}
            value={formData.description || ''}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="描述职责和成就..."
          />
        ) : (
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述职责和成就..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm resize-none text-gray-900"
          />
        )}
      </div>
    </>
  );

  const renderEducationFields = () => (
    <>
      {/* 第一行：学校名称和最高学历 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">学校名称</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="学校名称"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">最高学历</label>
          <select
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
          >
            <option value="">请选择学历</option>
            <option value="博士">博士</option>
            <option value="硕士">硕士</option>
            <option value="本科">本科</option>
            <option value="大专">大专</option>
            <option value="高中">高中</option>
            <option value="初中">初中</option>
          </select>
        </div>
      </div>

      {/* 第二行：专业和时间范围 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">专业</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="专业名称"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">入学与毕业时间</label>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <input
                type="month"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="入学时间"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
              />
            </div>
            <span className="px-2 text-gray-500 mb-3">至</span>
            <div className="flex-1">
              <input
                type="month"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value, isCurrent: false })}
                placeholder="毕业时间"
                disabled={formData.isCurrent}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isCurrent || false}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked, endDate: e.target.checked ? undefined : formData.endDate })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">在读</span>
            </label>
          </div>
        </div>
      </div>

      {/* 第三行：富文本编辑器 */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">详细描述</label>
        {typeof window !== 'undefined' ? (
          <RichTextEditor
            key={item?.id || 'new-education'}
            value={formData.description || ''}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="描述学习经历、成绩、活动等..."
          />
        ) : (
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述学习经历、成绩、活动等..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm resize-none text-gray-900"
          />
        )}
      </div>
    </>
  );

  const renderSkillsFields = () => (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">技能名称</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="技能名称"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm text-gray-900"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">详细描述</label>
        {typeof window !== 'undefined' ? (
          <RichTextEditor
            key={item?.id || 'new-skills'}
            value={formData.description || ''}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="描述技能使用经验、项目经验等..."
          />
        ) : (
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="描述技能使用经验、项目经验等..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm resize-none text-gray-900"
          />
        )}
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      {sectionType === 'work' && renderWorkFields()}
      {sectionType === 'education' && renderEducationFields()}
      {sectionType === 'skills' && renderSkillsFields()}

      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
        >
          保存
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
        >
          取消
        </button>
      </div>
    </div>
  );
}
