export function formatMoney(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

export function paymentLabel(method: string) {
  const labels: Record<string, string> = {
    pix: 'Pix',
    cash: 'Dinheiro',
    debit: 'Cartão de débito',
    credit: 'Cartão de crédito',
    voucher: 'Vale-refeição',
  }
  return labels[method] ?? method
}
