import { useMemo } from 'react';
import { Select } from '@components';

export const PaymentMethodCombo = ({ paymentMethods = [], ...props }) => {
	const items = useMemo(() => paymentMethods.map((item) => ({
		value: item.id ?? item.paymentMethodId,
		label: item.name ?? item.paymentMethodName ?? item.description,
	})), [paymentMethods]);

	return <Select {...props} items={items} />;
};
