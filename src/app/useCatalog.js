import { useEffect, useMemo, useState } from 'react';
import { API, Helpers } from '@app';

let catalogCache = null;
let catalogPromise = null;

const fetchCatalog = () => {
	if (!catalogPromise) {
		catalogPromise = API.endpoints.catalog.getAll()
			.then((rs) => {
				catalogCache = rs.data;
				return catalogCache;
			})
			.catch((err) => {
				catalogPromise = null;
				throw err;
			});
	}
	return catalogPromise;
};

export const useCatalog = () => {
	const [catalog, setCatalog] = useState(catalogCache);
	const [loading, setLoading] = useState(!catalogCache);

	useEffect(() => {
		if (catalogCache) return;
		let mounted = true;
		fetchCatalog()
			.then((data) => {
				if (mounted) setCatalog(data);
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
