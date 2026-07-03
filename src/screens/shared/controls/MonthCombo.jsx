import { Select } from '@components';
import { MONTH_ITEMS } from './MonthCombo.constants';

export const MonthCombo = (props) => <Select {...props} items={MONTH_ITEMS} />;
