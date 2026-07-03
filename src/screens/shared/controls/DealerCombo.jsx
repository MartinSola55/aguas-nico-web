import { useMemo } from 'react';
import { Helpers } from '@app';
import { Select } from '@components';

export const DealerCombo = ({ dealers = [], items, includeAllLabel, ...props }) => {
	const comboItems = useMemo(() => {
		const baseItems = items || Helpers.dealerComboItems(dealers);
		return includeAllLabel ? [{ value: '', label: includeAllLabel }, ...baseItems] : baseItems;
	}, [dealers, includeAllLabel, items]);

	return <Select {...props} items={comboItems} />;
};
