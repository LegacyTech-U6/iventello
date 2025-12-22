export function buildInvoicePdfHTML(invoice, entreprise) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <style>
    @page {
      size: A4;
      margin: 40px 50px 80px 50px;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      color: #111;
    }

    h1 {
      font-size: 28px;
      margin-bottom: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
    }

    .company {
      font-size: 11px;
      text-align: right;
      line-height: 1.4;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      border: 1px solid #ccc;
      padding: 8px;
    }

    th {
      background: #f3f4f6;
      text-align: left;
    }

    .right {
      text-align: right;
    }

    .summary {
      margin-top: 30px;
      width: 250px;
      float: right;
      border: 1px solid #ccc;
    }

    .summary div {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      border-bottom: 1px solid #ccc;
    }

    .summary div:last-child {
      background: #f3f4f6;
      font-weight: bold;
    }
  </style>
</head>

<body>

  <div class="header">
    <div>
      <h1>INVOICE</h1>
      <strong>${entreprise.nom}</strong><br>
      ${entreprise.adresse || ''}<br>
      ${entreprise.email || ''}
    </div>

    <div class="company">
      Invoice #: <strong>${invoice.id}</strong><br>
      Date: ${new Date(invoice.createdAt).toLocaleDateString()}<br>
      Due: ${new Date(invoice.date_echeance).toLocaleDateString()}
    </div>
  </div>

  <strong>Bill To:</strong><br>
  ${invoice.client.client_name}<br>
  ${invoice.client.client_adresse || ''}<br>
  ${invoice.client.email || ''}

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th class="right">Qty</th>
        <th class="right">Unit</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${invoice.items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${item.product.Prod_name}</td>
          <td class="right">${item.quantity}</td>
          <td class="right">${item.unit_price}</td>
          <td class="right">${item.total_item}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="summary">
    <div><span>Subtotal</span><span>${invoice.total_hors_reduction}</span></div>
    <div><span>TOTAL</span><span>${invoice.total}</span></div>
  </div>

</body>
</html>
`
}
