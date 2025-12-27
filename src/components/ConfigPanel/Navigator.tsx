import { useState, useEffect } from 'react';

const navItems = [
  { id: 'basic-info', label: '基本信息' },
  { id: 'custom-links', label: '自定义链接' },
  { id: 'work-experience', label: '工作经历' },
  { id: 'education', label: '教育经历' },
  { id: 'skills', label: '专业技能' },
  { id: 'hobbies', label: '爱好' },
];

export default function Navigator() {
  const [activeId, setActiveId] = useState('basic-info');

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        if (section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
          setActiveId(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <ul className="flex overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
          <li key={item.id} className="flex-shrink-0">
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block px-5 py-3.5 text-sm font-medium transition-all whitespace-nowrap relative ${
                activeId === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
              {activeId === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
