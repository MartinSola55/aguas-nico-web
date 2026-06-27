import { BreakpointCode } from '@constants';
import { useMediaQuery } from './useMediaQuery.jsx';

const getBreakpointValue = (breakpoint) => {
	if (typeof breakpoint === 'number')
		return breakpoint;

	return BreakpointCode[String(breakpoint).toUpperCase()];
};

const getBreakpointQuery = (breakpoint, direction) => {
	const breakpointValue = getBreakpointValue(breakpoint);

	if (!breakpointValue)
		return '(min-width: 0px)';

	if (direction === 'up')
		return `(min-width: ${breakpointValue}px)`;

	return `(max-width: ${breakpointValue - 0.02}px)`;
};

export const useBreakpoint = (breakpoint, direction = 'down') =>
	useMediaQuery(getBreakpointQuery(breakpoint, direction));

export default useBreakpoint;
