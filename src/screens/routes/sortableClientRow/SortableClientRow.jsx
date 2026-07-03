import { X } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Button } from '@components';

export const SortableClientRow = ({ client, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: client.id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<tr
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`select-none touch-none cursor-grab hover:bg-bg-tertiary/60 active:cursor-grabbing ${isDragging ? 'relative z-10' : ''}`}
		>
			<td className="border border-border-subtle px-3 py-2 align-top">{client.name}</td>
			<td className="border border-border-subtle px-3 py-2 align-top">{client.address}</td>
			<td className="border border-border-subtle px-3 py-2 text-center align-top">
				<Button size="sm" variant="danger" onClick={() => onRemove(client.id)}><X size={14} /></Button>
			</td>
		</tr>
	);
};
