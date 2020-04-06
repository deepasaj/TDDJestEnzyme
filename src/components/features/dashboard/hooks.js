import { usePermission } from 'store/store'

export const useFeaturePermission = () => {
  return usePermission('dashboard')
}
