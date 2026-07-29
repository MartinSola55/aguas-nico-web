import { useMemo } from 'react';
import { Helpers } from '@app';
import { Select } from '@components';

// La API devuelve el rol como código ("ADMIN" / "DEALER"); se muestra traducido y se conserva el id como value.
export const RoleCombo = ({ roles = [], items, ...props }) => {
	const comboItems = useMemo(
		() => items || roles.map((role) => ({ value: role.id, label: Helpers.getRoleName(role.description), raw: role })),
		[items, roles]
	);

	return <Select {...props} items={comboItems} />;
};
