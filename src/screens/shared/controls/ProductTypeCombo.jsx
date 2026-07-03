import { useCatalog } from '@app';
import { Select } from '@components';

export const ProductTypeCombo = (props) => {
	const { combos } = useCatalog();

	return <Select {...props} items={combos.productTypes} />;
};
