import { useCatalog } from '@app';
import { Select } from '@components';

export const TaxConditionCombo = (props) => {
	const { combos } = useCatalog();

	return <Select {...props} items={combos.taxConditions} />;
};
