export interface MenuItem {
  id: string;
  description: string;
  icon?: string;
  translation?: string;
  navigation?: string;
  active?: boolean;
  checked?: boolean;
}
