const CUSTOMER_DETAILS_KEY = 'galeria:checkout-details:v1'

export interface CustomerDetails {
  customerName: string
  address: string
}

function isCustomerDetails(value: unknown): value is CustomerDetails {
  if (!value || typeof value !== 'object') return false
  const details = value as Partial<CustomerDetails>
  return typeof details.customerName === 'string'
    && typeof details.address === 'string'
}

export function readCustomerDetails(): CustomerDetails | null {
  if (typeof window === 'undefined') return null

  let serialized: string | null
  try {
    serialized = window.localStorage.getItem(CUSTOMER_DETAILS_KEY)
  } catch (error) {
    console.error('Não foi possível acessar os dados salvos do checkout.', error)
    throw new Error('Não foi possível acessar os dados salvos neste dispositivo.')
  }
  if (serialized === null) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(serialized)
  } catch (error) {
    console.error('Não foi possível interpretar os dados salvos do checkout.', error)
    throw new Error('Os dados salvos neste dispositivo estão inválidos.')
  }
  if (!isCustomerDetails(parsed)) {
    console.error('Os dados salvos do checkout têm um formato inválido.')
    throw new Error('Os dados salvos neste dispositivo estão inválidos.')
  }
  return parsed
}

export function saveCustomerDetails(details: CustomerDetails) {
  if (typeof window === 'undefined') {
    throw new Error('Os dados só podem ser salvos no navegador.')
  }

  try {
    window.localStorage.setItem(CUSTOMER_DETAILS_KEY, JSON.stringify(details))
  } catch (error) {
    console.error('Não foi possível salvar os dados do checkout.', error)
    throw new Error('Não foi possível salvar os dados neste dispositivo.')
  }
}

export function removeCustomerDetails() {
  if (typeof window === 'undefined') {
    throw new Error('Os dados só podem ser removidos no navegador.')
  }

  try {
    window.localStorage.removeItem(CUSTOMER_DETAILS_KEY)
  } catch (error) {
    console.error('Não foi possível remover os dados salvos do checkout.', error)
    throw new Error('Não foi possível remover os dados salvos neste dispositivo.')
  }
}
