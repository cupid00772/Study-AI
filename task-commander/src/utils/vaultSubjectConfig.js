import {
  BookOpen,
  Cpu,
  Binary,
  TrendingUp,
  BarChart3,
  Globe,
  Award,
  Code,
  Calculator,
  Languages,
  FlaskConical,
  Layers,
} from 'lucide-react';

export const VAULT_SUBJECT_ICONS = [
  { id: 'book', label: '書籍', icon: BookOpen },
  { id: 'cpu', label: '系統/硬體', icon: Cpu },
  { id: 'binary', label: '資料結構', icon: Binary },
  { id: 'code', label: '程式設計', icon: Code },
  { id: 'calc', label: '數學計算', icon: Calculator },
  { id: 'chart', label: '統計分析', icon: BarChart3 },
  { id: 'trend', label: '經濟管理', icon: TrendingUp },
  { id: 'award', label: '考證衝刺', icon: Award },
  { id: 'lang', label: '語言英文', icon: Languages },
  { id: 'flask', label: '自然科學', icon: FlaskConical },
  { id: 'globe', label: '通識人文', icon: Globe },
  { id: 'layers', label: '專題綜合', icon: Layers },
];

export const VAULT_SUBJECT_COLORS = [
  '#4285F4',
  '#7C3AED',
  '#059669',
  '#E11D48',
  '#D97706',
  '#0284C7',
  '#EC4899',
  '#6366F1',
];

export function resolveVaultSubjectIcon(iconId) {
  return VAULT_SUBJECT_ICONS.find((item) => item.id === iconId)?.icon || BookOpen;
}
