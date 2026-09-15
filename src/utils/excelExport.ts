import { Order, LoyaltyProfile, PointLog } from '../types';

/**
 * Escapes values for standard RFC 4180 CSV / Excel format.
 */
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Downloads a CSV file encoded with UTF-8 BOM so Microsoft Excel
 * directly opens special characters (accents, ñ, etc.) in clean columns.
 */
function downloadCsv(filename: string, csvContent: string) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads an XML/Excel (.xls) file formatted with SpreadsheetML,
 * creating genuine multi-sheet Excel workbooks with Orders, Clients, Magma Logs and Point Audits.
 */
function downloadXmlExcel(filename: string, sheets: { name: string; headers: string[]; rows: (string | number)[][] }[]) {
  const sanitize = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#2A1B0E" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Default">
   <Alignment ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Currency">
   <NumberFormat ss:Format="$#,##0"/>
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
  </Style>
 </Styles>
`;

  sheets.forEach((sheet) => {
    xml += ` <Worksheet ss:Name="${sanitize(sheet.name)}">\n  <Table>\n`;
    // Header Row
    xml += `   <Row>\n`;
    sheet.headers.forEach((h) => {
      xml += `    <Cell ss:StyleID="Header"><Data ss:Type="String">${sanitize(h)}</Data></Cell>\n`;
    });
    xml += `   </Row>\n`;

    // Data Rows
    sheet.rows.forEach((row) => {
      xml += `   <Row>\n`;
      row.forEach((cell) => {
        const isNum = typeof cell === 'number';
        const type = isNum ? 'Number' : 'String';
        xml += `    <Cell><Data ss:Type="${type}">${sanitize(cell)}</Data></Cell>\n`;
      });
      xml += `   </Row>\n`;
    });

    xml += `  </Table>\n </Worksheet>\n`;
  });

  xml += `</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all Club Magma logs & tasting history
 */
export function exportMagmaLogToExcel(clients: LoyaltyProfile[]) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `LAVA_Bitacora_Club_Magma_${timestamp}.xls`;

  // Sheet 1: Historial de Catas & Registros Magma
  const tastingRows: (string | number)[][] = [];
  clients.forEach((c) => {
    if (c.tastingLog && c.tastingLog.length > 0) {
      c.tastingLog.forEach((log) => {
        tastingRows.push([
          c.id,
          c.customerName,
          c.phone,
          c.email,
          c.tier,
          log.orderId,
          log.date,
          log.beanName,
          log.size,
          log.grind,
        ]);
      });
    } else {
      tastingRows.push([
        c.id,
        c.customerName,
        c.phone,
        c.email,
        c.tier,
        'Sin compras registradas',
        c.memberSince,
        c.favoriteBeanId,
        '-',
        '-',
      ]);
    }
  });

  // Sheet 2: Padrón de Socios y Balance de Puntos
  const memberRows: (string | number)[][] = clients.map((c) => [
    c.id,
    c.customerName,
    c.phone,
    c.email,
    c.tier,
    c.points,
    c.lifetimePoints,
    c.ordersCount,
    c.favoriteBeanId,
    c.memberSince,
    c.tastingLog?.length || 0,
  ]);

  downloadXmlExcel(filename, [
    {
      name: 'Bitacora Magma',
      headers: [
        'ID Cliente',
        'Nombre Socio',
        'WhatsApp',
        'Email',
        'Nivel Socio',
        'Orden / Origen',
        'Fecha de Registro',
        'Varietal de Café',
        'Gramaje',
        'Molienda Preferida',
      ],
      rows: tastingRows,
    },
    {
      name: 'Padron Socios Magma',
      headers: [
        'ID Socio',
        'Nombre Completo',
        'WhatsApp',
        'Email',
        'Nivel',
        'Puntos Actuales',
        'Puntos Historicos',
        'Total Pedidos',
        'Cafe Favorito',
        'Miembro Desde',
        'Catas Registradas',
      ],
      rows: memberRows,
    },
  ]);
}

/**
 * Export all Orders to Excel
 */
export function exportOrdersToExcel(orders: Order[]) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `LAVA_Pedidos_CRM_${timestamp}.xls`;

  const rows: (string | number)[][] = orders.map((ord) => {
    const itemsSummary = ord.items
      .map((i) => `${i.quantity}x ${i.beanName} (${i.size}, ${i.grind})`)
      .join(' | ');

    return [
      ord.id,
      ord.date,
      ord.customerName,
      ord.phone,
      ord.email || '-',
      ord.address,
      ord.city,
      ord.province,
      ord.paymentMethod,
      ord.status.toUpperCase().replace('_', ' '),
      ord.trackingCode,
      ord.subtotal,
      ord.shipping,
      ord.total,
      ord.earnedPoints,
      itemsSummary,
    ];
  });

  downloadXmlExcel(filename, [
    {
      name: 'Pedidos CRM LAVA',
      headers: [
        'Nro Pedido',
        'Fecha',
        'Cliente',
        'WhatsApp',
        'Email',
        'Direccion',
        'Ciudad',
        'Provincia',
        'Metodo de Pago',
        'Estado',
        'Codigo Rastreo',
        'Subtotal ($)',
        'Envio ($)',
        'Total ($)',
        'Puntos Generados',
        'Detalle de Items',
      ],
      rows,
    },
  ]);
}

/**
 * Export Points Audit Log to Excel
 */
export function exportPointsAuditToExcel(pointLogs: PointLog[]) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `LAVA_Auditoria_Puntos_${timestamp}.xls`;

  const rows: (string | number)[][] = pointLogs.map((log) => [
    log.id,
    log.date,
    log.clientId,
    log.clientName,
    log.pointsDelta,
    log.pointsDelta > 0 ? 'INGRESO' : 'CANJE / DESCUENTO',
    log.reason,
    log.performedBy,
  ]);

  downloadXmlExcel(filename, [
    {
      name: 'Movimientos de Puntos',
      headers: [
        'ID Log',
        'Fecha y Hora',
        'ID Cliente',
        'Nombre Cliente',
        'Puntos Delta',
        'Tipo Operacion',
        'Motivo / Concepto',
        'Operador',
      ],
      rows,
    },
  ]);
}

/**
 * Export Master CRM (Complete Workbook with Orders, Clients, Magma Logs and Points)
 */
export function exportMasterCrmToExcel(
  orders: Order[],
  clients: LoyaltyProfile[],
  pointLogs: PointLog[]
) {
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `LAVA_CRM_Maestro_Completo_${timestamp}.xls`;

  // 1. Orders
  const orderRows: (string | number)[][] = orders.map((ord) => [
    ord.id,
    ord.date,
    ord.customerName,
    ord.phone,
    ord.address,
    ord.city,
    ord.status.toUpperCase().replace('_', ' '),
    ord.trackingCode,
    ord.total,
    ord.earnedPoints,
    ord.items.map((i) => `${i.quantity}x ${i.beanName} (${i.size}, ${i.grind})`).join(' | '),
  ]);

  // 2. Clients
  const clientRows: (string | number)[][] = clients.map((c) => [
    c.id,
    c.customerName,
    c.phone,
    c.email,
    c.tier,
    c.points,
    c.lifetimePoints,
    c.ordersCount,
    c.favoriteBeanId,
    c.memberSince,
  ]);

  // 3. Magma Tasting Log
  const magmaRows: (string | number)[][] = [];
  clients.forEach((c) => {
    (c.tastingLog || []).forEach((t) => {
      magmaRows.push([
        c.customerName,
        c.phone,
        t.orderId,
        t.date,
        t.beanName,
        t.size,
        t.grind,
      ]);
    });
  });

  // 4. Points Movements
  const pointRows: (string | number)[][] = pointLogs.map((p) => [
    p.date,
    p.clientName,
    p.pointsDelta,
    p.reason,
    p.performedBy,
  ]);

  downloadXmlExcel(filename, [
    {
      name: 'Pedidos',
      headers: ['ID Orden', 'Fecha', 'Cliente', 'Telefono', 'Direccion', 'Ciudad', 'Estado', 'Tracking', 'Total ($)', 'Puntos Sumados', 'Productos'],
      rows: orderRows,
    },
    {
      name: 'Socios Magma',
      headers: ['ID Socio', 'Nombre', 'Telefono', 'Email', 'Categoria', 'Puntos Saldo', 'Puntos Historicos', 'Total Pedidos', 'Cafe Favorito', 'Fecha Alta'],
      rows: clientRows,
    },
    {
      name: 'Bitacora Magma',
      headers: ['Socio', 'WhatsApp', 'Orden Ref', 'Fecha', 'Varietal', 'Gramaje', 'Molienda'],
      rows: magmaRows,
    },
    {
      name: 'Auditoria Puntos',
      headers: ['Fecha', 'Cliente', 'Movimiento (+/-)', 'Concepto', 'Operador'],
      rows: pointRows,
    },
  ]);
}
