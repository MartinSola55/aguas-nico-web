const Loader = ({ label = 'Cargando' }) => (
	<span className="inline-flex items-center gap-2 text-sm text-text-muted">
		<span
			className="inline-block h-5 w-5 rounded-full border-2 border-bg-tertiary border-b-accent-primary"
			style={{ animation: 'rotation 1s linear infinite' }}
		/>
		{label}
	</span>
);

export default Loader;
