import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import type { SectionItem } from '../../types/resume';
import SectionItemEditor from './SectionItemEditor';

interface SectionEditorProps {
  sectionType: 'work' | 'education' | 'skills';
  title: string;
  description: string;
  id: string;
}

export default function SectionEditor({ sectionType, title, description, id }: SectionEditorProps) {
  const data = useResumeStore((state) => state.data);
  const addSectionItem = useResumeStore((state) => state.addSectionItem);
  const updateSectionItem = useResumeStore((state) => state.updateSectionItem);
  const deleteSectionItem = useResumeStore((state) => state.deleteSectionItem);
  const items = data.sections[sectionType];
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    const newItem: SectionItem = {
      id: Date.now().toString(),
      title: '',
      dateRange: '',
      ...(sectionType === 'work' && {
        companyName: '',
        positionName: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
      }),
    };
    // 先添加item到列表，再设置编辑状态
    addSectionItem(sectionType, newItem);
    setEditingId(newItem.id);
  };

  const handleEdit = (item: SectionItem) => {
    setEditingId(item.id);
  };

  const handleSave = (itemData: Partial<SectionItem>) => {
    if (editingId) {
      updateSectionItem(sectionType, editingId, itemData);
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    // 如果是新添加的项（还没有填写内容），从列表中删除
    if (editingId) {
      const item = items.find(item => item.id === editingId);
      // 检查是否是空项（新添加但未保存）
      if (item && !item.title && !item.companyName && !item.description) {
        deleteSectionItem(sectionType, editingId);
      }
    }
    setEditingId(null);
  };

  const handleDelete = (itemId: string) => {
    if (confirm('确定删除此项吗？')) {
      deleteSectionItem(sectionType, itemId);
    }
  };

  const isEditing = (itemId: string) => editingId === itemId;

  return (
    <div className="p-6 lg:p-8 border-t border-gray-200" id={id}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="space-y-4">
        {items.length === 0 && !editingId && (
          <div className="text-center text-gray-400 py-8">
            暂无{title}，点击下方按钮添加
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
            {isEditing(item.id) ? (
              // 编辑模式
              <SectionItemEditor
                sectionType={sectionType}
                item={item}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              // 显示模式 - 简化为一行
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {sectionType === 'work' ? (
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.companyName || item.title || '未命名公司'}
                    </h3>
                  ) : sectionType === 'education' ? (
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.title || '未命名学校'}
                    </h3>
                  ) : (
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.title || '未命名技能'}
                    </h3>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleAdd}
          className="w-full px-4 py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          添加新的{title.replace('经历', '').replace('技能', '')}
        </button>
      </div>
    </div>
  );
}
