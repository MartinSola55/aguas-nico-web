import { useEffect, useState } from 'react';

const getMatches = (query, defaultMatches) => {
	if (typeof window === 'undefined' || !window.matchMedia)
		return defaultMatches;

	return window.matchMedia(query).matches;
};

export const useMediaQuery = (query, defaultMatches = false) => {
	const [matches, setMatches] = useState(() => getMatches(query, defaultMatches));

	useEffect(() => {
		if (typeof window === 'undefined' || !window.matchMedia)
			return undefined;

		const mediaQueryList = window.matchMedia(query);
		const handleChange = (event) => setMatches(event.matches);

		setMatches(mediaQueryList.matches);
		mediaQueryList.addEventListener('change', handleChange);
		return () => mediaQueryList.removeEventListener('change', handleChange);
	}, [query]);

	return matches;
};

export default useMediaQuery;
