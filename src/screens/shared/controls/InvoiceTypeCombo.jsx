import { useCatalog } from '@app';
import { Select } from '@components';

export const InvoiceTypeCombo = (props) => {
	const { combos } = useCatalog();

	return <Select {...props} items={combos.invoiceTypes} />;
};
