import { useEffect, useMemo, useState } from 'react';
import { API, Helpers } from '@app';

export const useCatalog = () => {
	const [catalog, setCatalog] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		API.endpoints.catalog.getAll()
			.then((rs) => {
				if (mounted) setCatalog(rs.data);
			})
			.finally(() => {
				if (mounted) setLoading(false);
			});
		return () => { mounted = false; };
	}, []);

	const combos = useMemo(() => ({
		states: Helpers.toComboItems(catalog?.states || []),
		productTypes: Helpers.toComboItems(catalog?.productTypes || []),
		days: Helpers.toComboItems(catalog?.days || []),
		invoiceTypes: Helpers.toComboItems(catalog?.invoiceTypes || []),
		taxConditions: Helpers.toComboItems(catalog?.taxConditions || []),
		paymentMethods: Helpers.toComboItems(catalog?.paymentMethods || []),
	}), [catalog]);

	return { catalog, combos, loading };
};
