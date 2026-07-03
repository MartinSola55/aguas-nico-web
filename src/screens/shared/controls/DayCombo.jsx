import { useMemo } from 'react';
import { useCatalog } from '@app';
import { Select } from '@components';

export const DayCombo = ({ includeAllLabel, items, ...props }) => {
	const { combos } = useCatalog();
	const comboItems = useMemo(() => {
		const baseItems = items || combos.days || [];
		return includeAllLabel ? [{ value: '', label: includeAllLabel }, ...baseItems] : baseItems;
	}, [combos.days, includeAllLabel, items]);

	return <Select {...props} items={comboItems} />;
};
