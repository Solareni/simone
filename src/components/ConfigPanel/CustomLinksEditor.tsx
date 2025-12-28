import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import type { CustomLink } from '../../types/resume';
import { validateAndSanitizeUrl } from '../../utils/urlUtils';

export default function CustomLinksEditor() {
  const data = useResumeStore((state) => state.data);
  const addCustomLink = useResumeStore((state) => state.addCustomLink);
  const updateCustomLink = useResumeStore((state) => state.updateCustomLink);
  const deleteCustomLink = useResumeStore((state) => state.deleteCustomLink);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CustomLink>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newLinkForm, setNewLinkForm] = useState({
    text: '',
    description: '',
  });
  const [urlError, setUrlError] = useState<string>('');

  const handleAddClick = () => {
    setIsCreating(true);
    setNewLinkForm({ text: '', description: '' });
  };

  const handleCreate = () => {
    if (!newLinkForm.text.trim()) {
      return;
    }

    // 如果有URL输入，验证URL格式
    if (newLinkForm.description.trim()) {
      const sanitizedUrl = validateAndSanitizeUrl(newLinkForm.description);
      if (!sanitizedUrl) {
        setUrlError('请输入有效的HTTP或HTTPS链接地址');
        return;
      }
      setUrlError('');
    }

    const linkToAdd: Omit<CustomLink, 'id'> = {
      text: newLinkForm.text,
      url: newLinkForm.description.trim() || undefined,
      type: 'link',
    };
    addCustomLink(linkToAdd);
    setIsCreating(false);
    setNewLinkForm({ text: '', description: '' });
    setUrlError('');
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
    setNewLinkForm({ text: '', description: '' });
  };

  const handleEdit = (link: CustomLink) => {
    setEditingId(link.id);
    setEditForm(link);
  };

  const handleSave = () => {
    if (!editingId || !editForm.text?.trim()) {
      return;
    }

    // 如果是链接类型且有URL输入，验证URL格式
    if (editForm.type === 'link' && editForm.url?.trim()) {
      const sanitizedUrl = validateAndSanitizeUrl(editForm.url);
      if (!sanitizedUrl) {
        setUrlError('请输入有效的HTTP或HTTPS链接地址');
        return;
      }
      setUrlError('');
      // 使用清理后的URL
      editForm.url = sanitizedUrl;
    }

    updateCustomLink(editingId, editForm);
    setEditingId(null);
    setEditForm({});
    setUrlError('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (linkId: string) => {
    if (confirm('确定删除此项吗？')) {
      deleteCustomLink(linkId);
    }
  };

  return (
    <div className="p-6 lg:p-8 border-t border-gray-200" id="custom-links">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">自定义内容</h2>
        <p className="text-sm text-gray-500">
          添加个人网站、GitHub链接或其他自定义内容
        </p>
      </div>

      <div className="space-y-4">
        {data.customLinks.map((link) => (
          <div key={link.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
            {editingId === link.id ? (
              // 编辑模式
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.text || ''}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  placeholder="显示文本"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                />
                {editForm.type === 'link' && (
                  <div>
                    <input
                      type="url"
                      value={editForm.url || ''}
                      onChange={(e) => {
                        setEditForm({ ...editForm, url: e.target.value });
                        setUrlError(''); // 清除错误
                      }}
                      placeholder="链接地址 (https://...)"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-blue-500 transition-all bg-white shadow-sm ${
                        urlError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {urlError && (
                      <p className="text-red-600 text-sm mt-1">{urlError}</p>
                    )}
                  </div>
                )}
                <select
                  value={editForm.type || 'link'}
                  onChange={(e) => setEditForm({ ...editForm, type: e.target.value as 'link' | 'text' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                >
                  <option value="link">链接</option>
                  <option value="text">文本</option>
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              // 显示模式
              <div>
                <p className="font-medium text-gray-800 mb-1">
                  {link.text || '(未填写)'}
                </p>
                {link.type === 'link' && link.url && (
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  类型: {link.type === 'link' ? '链接' : '文本'}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(link)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* 创建新链接的表单 */}
        {isCreating ? (
          <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 bg-blue-50/50">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">名称</label>
                <input
                  type="text"
                  value={newLinkForm.text}
                  onChange={(e) => setNewLinkForm({ ...newLinkForm, text: e.target.value })}
                  placeholder="名称"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                  autoFocus
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">链接地址</label>
                <input
                  type="url"
                  value={newLinkForm.description}
                  onChange={(e) => {
                    setNewLinkForm({ ...newLinkForm, description: e.target.value });
                    setUrlError(''); // 清除错误
                  }}
                  placeholder="https://..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-blue-500 transition-all bg-white shadow-sm ${
                    urlError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {urlError && (
                  <p className="text-red-600 text-sm mt-1">{urlError}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  disabled={!newLinkForm.text.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  创建
                </button>
                <button
                  onClick={handleCreateCancel}
                  className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all text-sm font-medium whitespace-nowrap"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            className="w-full px-4 py-4 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            添加新的内容
          </button>
        )}
      </div>
    </div>
  );
}
