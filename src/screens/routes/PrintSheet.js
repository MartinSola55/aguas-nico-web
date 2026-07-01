import { Formatters } from '@app';
import { ProductType } from '@constants';

// Replica exacta de la planilla legacy (Views/Dealers/PrintSheet.cshtml).
// Renderiza el mismo markup Bootstrap dentro de un iframe oculto y dispara la
// impresion del navegador (Guardar como PDF), para conservar identico tamaño,
// bordes, margenes y hojas vacias.

const BOOTSTRAP_CSS = 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css';
const BOOTSTRAP_ICONS_CSS = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';

const PRINT_STYLE = `
@page {
    margin-top: 3cm;
    @top-left { content: " "; }
    @top-center { content: " "; }
    @top-right { content: " "; }
    @bottom-right { content: counter(page) " of " counter(pages); }
}
.clientContent {
    page-break-inside: avoid !important;
    width: 100%;
}
`;

const escapeHtml = (value) =>
	String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

const now = () => {
	const date = new Date();
	const pad = (value) => String(value).padStart(2, '0');
	return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const productsTable = (products) => {
	const rows = products
		.filter((product) => product.type !== ProductType.Maquina)
		.map(
			(product) => `
				<tr>
					<td class="py-2 text-dark font-italic">${escapeHtml(product.typeName)} ${escapeHtml(Formatters.formatCurrency(product.price))}  Stk: ${escapeHtml(product.stock)} u.</td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
				</tr>`
		)
		.join('');
	return `
		<div class="col-12 px-0">
			<table class="table table-bordered border-top-0 mb-0">
				<thead>
					<tr>
						<th class="py-0 text-dark" style="width: 40%;">BAJADA</th>
						<th class="py-0 text-center" style="width: 10%;">S1</th>
						<th class="py-0 text-center" style="width: 10%;">S2</th>
						<th class="py-0 text-center" style="width: 10%;">S3</th>
						<th class="py-0 text-center" style="width: 10%;">S4</th>
						<th class="py-0 text-center" style="width: 10%;">S5</th>
						<th class="py-0 text-center" style="width: 10%;"><i class="bi bi-plus-slash-minus"></i></th>
					</tr>
				</thead>
				<tbody>${rows}</tbody>
			</table>
		</div>`;
};

const abonoTable = (abono, abonoProducts) => {
	const rows = abonoProducts
		.filter((product) => product.abonoId === abono.id)
		.map(
			(product) => `
				<tr>
					<td class="py-2 text-dark font-italic">${escapeHtml(product.typeName)} - Stk: ${escapeHtml(product.stock)} u.</td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
					<td class="py-2"></td>
				</tr>`
		)
		.join('');
	return `
		<div class="col-12 px-0 border-dark border-top">
			<table class="table table-bordered border-top-0 mb-0">
				<thead>
					<tr>
						<th class="py-0 text-dark" style="width: 40%;">${escapeHtml(abono.name)} - ${escapeHtml(Formatters.formatCurrency(abono.price))}</th>
						<th class="py-0 text-center" style="width: 10%;">S1</th>
						<th class="py-0 text-center" style="width: 10%;">S2</th>
						<th class="py-0 text-center" style="width: 10%;">S3</th>
						<th class="py-0 text-center" style="width: 10%;">S4</th>
						<th class="py-0 text-center" style="width: 10%;">S5</th>
						<th class="py-0 text-center" style="width: 10%;"><i class="bi bi-plus-slash-minus"></i></th>
					</tr>
				</thead>
				<tbody>${rows}</tbody>
			</table>
		</div>`;
};

const machineAndObservations = (item) => {
	const machine = (item.products || []).find((product) => product.type === ProductType.Maquina);
	if (!machine && !item.clientObservations) return '';
	return `
		<div class="col-12 px-0 border-dark border-top">
			<table class="table table-bordered border-top-0 mb-0">
				<tbody>
					<tr>
						<td style="width: 40%;">${machine ? `<p class="text-muted mb-0">${escapeHtml(machine.typeName)} - Stk: ${escapeHtml(machine.stock)} u.</p>` : ''}</td>
						<td style="width: 60%;">${item.clientObservations ? `<p class="text-monospace mb-0">Obs: ${escapeHtml(item.clientObservations)}</p>` : ''}</td>
					</tr>
				</tbody>
			</table>
		</div>`;
};

const clientRow = (item) => {
	const products = item.products || [];
	const abonos = item.abonos || [];
	const abonoProducts = item.abonoProducts || [];
	const productsBlock = products.length ? productsTable(products) : '';
	const abonosBlock = abonos.map((abono) => abonoTable(abono, abonoProducts)).join('');
	return `
		<div class="row clientContent pl-4">
			<div class="col-12 d-flex justify-content-between py-1 border border-dark">
				<h5 class="mb-0 d-flex align-items-center"><li class="text-dark mb-0" style="list-style: none;"><strong>${escapeHtml(item.clientName)}</strong> #${escapeHtml(item.clientId)}</li></h5>
				<div class="d-flex mr-4">
					<p class="text-monospace mx-5 mb-0 text-dark"><i class="bi bi-geo-alt pr-1"></i>${escapeHtml(item.clientAddress)}</p>
					<p class="text-monospace mb-0 text-dark"><i class="bi bi-telephone-fill pr-1"></i> ${escapeHtml(item.clientPhone)}</p>
				</div>
			</div>
			<div class="col-8 px-0 border-right border-dark">
				<div class="row px-3">
					${productsBlock}
					${abonosBlock}
					${machineAndObservations(item)}
				</div>
			</div>
			<div class="col-4 row">
				<div class="col-6">
					<p class="text-monospace mb-2 flex-grow-1 align-self-stretchs"><small>Saldo anterior: </small> ${item.clientDebt > 0 ? escapeHtml(Formatters.formatCurrency(item.clientDebt)) : ' '}</p>
				</div>
				<div class="col-6 border-left border-dark">
					<p class="text-monospace mb-2 flex-grow-1 align-self-stretch"><small>Entrega:</small></p>
				</div>
			</div>
		</div>`;
};

const daySection = (dayName, dealerName, sheets) => `
	<div class="printableArea px-1">
		<div class="row bg-white">
			<div class="row clientContent">
				<div class="col-12 my-2 d-flex justify-content-between">
					<h4 class="text-center p-2 pl-3 m-0 text-dark"><strong>Planilla ${escapeHtml(dayName)}</strong></h4>
					<h4 class="text-center p-2 pr-3 m-0 text-dark"><strong>Fecha: ${now()}</strong></h4>
				</div>
				<div class="col-12 mb-2 d-flex justify-content-between">
					<h4 class="text-center p-2 pl-3 m-0 text-dark"><strong>${escapeHtml(dealerName)}</strong></h4>
				</div>
			</div>
			${sheets.map(clientRow).join('')}
		</div>
	</div>`;

const emptySheet = () => `
	<div class="row clientContent">
		<div class="col-12 d-flex py-1 border border-dark">
			<div class="col-4 d-flex justify-content-start align-items-center">
				<h5 class="mb-0 d-flex align-items-center"><li class="text-dark mb-0" style="list-style: none;">Cliente:</li></h5>
			</div>
			<div class="col-8 d-flex justify-content-center align-items-center">
				<div class="col-6">
					<p class="text-monospace ml-5 mb-0 text-dark"><i class="bi bi-geo-alt pr-1"></i></p>
				</div>
				<div class="col-6">
					<p class="text-monospace mb-0 text-dark"><i class="bi bi-telephone-fill pr-1"></i></p>
				</div>
			</div>
		</div>
		<div class="col-8 px-0 border-right border-dark">
			<div class="row px-3">
				<div class="col-12 px-0">
					<table class="table table-bordered border-top-0 mb-0">
						<thead>
							<tr>
								<th class="py-0 text-dark" style="width: 40%;">BAJADA</th>
								<th class="py-0 text-center" style="width: 10%;">S1</th>
								<th class="py-0 text-center" style="width: 10%;">S2</th>
								<th class="py-0 text-center" style="width: 10%;">S3</th>
								<th class="py-0 text-center" style="width: 10%;">S4</th>
								<th class="py-0 text-center" style="width: 10%;">S5</th>
								<th class="py-0 text-center" style="width: 10%;"><i class="bi bi-plus-slash-minus"></i></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="py-2 text-dark font-italic">Producto:</td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
							</tr>
							<tr>
								<td class="py-2 text-dark font-italic">Producto:</td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
							</tr>
							<tr>
								<td class="py-2 text-dark font-italic">Abono:</td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
								<td class="py-2"></td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="col-12 px-0 border-dark border-top">
					<table class="table table-bordered border-top-0 mb-0">
						<tbody>
							<tr>
								<td style="width: 40%;">Envases:</td>
								<td style="width: 60%;">Observaciones:</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
		<div class="col-4 row">
			<div class="col-6">
				<p class="text-monospace mb-2 flex-grow-1 align-self-stretchs"><small>Saldo anterior: </small><br />$</p>
			</div>
			<div class="col-6 border-left border-dark">
				<p class="text-monospace mb-2 flex-grow-1 align-self-stretch"><small>Entrega:</small><br />$</p>
			</div>
		</div>
	</div>`;

const emptySheetsSection = () => `
	<div class="printableArea pl-4">
		<div class="row bg-white">
			${Array.from({ length: 10 }, emptySheet).join('')}
		</div>
	</div>`;

const buildDocument = (title, dayName, dealerName, sheets) => `<!DOCTYPE html>
<html lang="es">
<head>
	<meta charset="utf-8" />
	<title>${escapeHtml(title)}</title>
	<link href="${BOOTSTRAP_CSS}" rel="stylesheet" />
	<link href="${BOOTSTRAP_ICONS_CSS}" rel="stylesheet" />
	<style>${PRINT_STYLE}</style>
</head>
<body>
	<div class="container-fluid">
		${sheets.length ? daySection(dayName, dealerName, sheets) : ''}
		${emptySheetsSection()}
	</div>
</body>
</html>`;

export const printRouteSheet = ({ dealerName, day, sheets }) => {
	const dayName = Formatters.dayName(day);
	const title = `Planilla ${dealerName} ${dayName}`.trim();
	const html = buildDocument(title, dayName, dealerName, sheets);

	const iframe = document.createElement('iframe');
	iframe.setAttribute('aria-hidden', 'true');
	iframe.style.position = 'fixed';
	iframe.style.right = '0';
	iframe.style.bottom = '0';
	iframe.style.width = '0';
	iframe.style.height = '0';
	iframe.style.border = '0';
	document.body.appendChild(iframe);

	let cleaned = false;
	const cleanup = () => {
		if (cleaned) return;
		cleaned = true;
		setTimeout(() => iframe.remove(), 0);
	};

	iframe.onload = () => {
		const frameWindow = iframe.contentWindow;
		if (!frameWindow) return cleanup();
		frameWindow.onafterprint = cleanup;
		// Damos un margen para que las hojas de estilo (CDN) esten aplicadas
		setTimeout(() => {
			frameWindow.focus();
			frameWindow.print();
		}, 400);
		// Respaldo por si onafterprint no dispara
		setTimeout(cleanup, 60000);
	};

	iframe.srcdoc = html;
};
