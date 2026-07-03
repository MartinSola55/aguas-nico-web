import { useMemo } from 'react';
import { Select } from '@components';

export const YearCombo = ({ years = [], ...props }) => {
	const items = useMemo(() => years.map((year) => ({ value: year, label: year })), [years]);

	return <Select {...props} items={items} />;
};
