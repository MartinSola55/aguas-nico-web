import { useEffect } from 'react';

export const useClickOutside = (ref, callback, enabled = true) => {
	useEffect(() => {
		if (!enabled)
			return undefined;

		const handlePointerDown = (event) => {
			if (!ref.current || ref.current.contains(event.target))
				return;

			callback(event);
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('touchstart', handlePointerDown);

		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('touchstart', handlePointerDown);
		};
	}, [callback, enabled, ref]);
};

export default useClickOutside;
