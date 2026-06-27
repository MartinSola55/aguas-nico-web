import { X } from 'lucide-react';
import { Button } from '@components';
import { widths } from './Modal.constants';

const Modal = ({ open, title, children, footer, size = 'md', onClose }) => {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-slate-900/40 p-4">
			<div className={`max-h-[90vh] w-full ${widths[size] || widths.md} overflow-hidden rounded-[var(--radius-md)] bg-bg-secondary shadow-lg`}>
				<header className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
					<h2 className="m-0 text-base font-semibold">{title}</h2>
					<Button variant="ghost" size="sm" onClick={onClose}><X size={18} /></Button>
				</header>
				<div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
				{footer && <footer className="flex justify-end gap-2 border-t border-border-subtle px-4 py-3">{footer}</footer>}
			</div>
		</div>
	);
};

export default Modal;
