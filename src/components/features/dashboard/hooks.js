import { usePermission } from 'store/store';

export const useFeaturePermission = () => usePermission('dashboard');
