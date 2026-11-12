export type PaymentMethod = 'pix' | 'cash' | 'debit' | 'credit' | 'voucher'

export interface CatalogConfig {
  schema_version: 2
  app_name: string
  city: string
  timezone: string
  payment_methods: PaymentMethod[]
  geo: {
    default_center: { lat: number; lng: number }
    nearby_radius_km: number
    far_radius_km: number
  }
  ranking: {
    repeat_order_weight: number
    same_city_weight: number
    nearby_city_weight: number
    far_city_weight: number
    popularity_weight: number
    open_now_bonus: number
    distance_decay_km: number
  }
  whatsapp: { message_template: string }
}

export interface Category {
  id: string
  name: string
  icon: string
  order: number
}

export interface HoursInterval {
  open: string
  close: string
}

export interface Store {
  id: string
  name: string
  description: string
  business_type: 'food' | 'service' | 'retail' | 'vehicle' | 'mixed'
  category_ids: string[]
  status: 'active' | 'paused' | 'draft'
  order: number
  base_popularity: number
  whatsapp: string
  logo: string
  cover: string
  location_image?: string
  geo: { lat: number; lng: number; city: string; state: string }
  address: { street: string; number: string; neighborhood: string; reference?: string }
  hours: Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', HoursInterval[]>
  hours_exceptions: Array<{
    date: string
    closed: boolean
    intervals?: HoursInterval[]
    note?: string
  }>
  payment_methods: PaymentMethod[]
  delivery: {
    enabled: boolean
    fee_cents: number
    min_order_cents: number
    eta_min: number
    radius_km: number
  }
  pickup: { enabled: boolean; eta_min: number }
  tags: string[]
}

export interface ProductOption {
  id: string
  name: string
  price_delta_cents: number
}

export interface ProductOptionGroup {
  id: string
  name: string
  required: boolean
  min: number
  max: number
  options: ProductOption[]
}

export interface Product {
  id: string
  store_id: string
  name: string
  description: string
  category: string
  price_cents: number
  promo_price_cents: number | null
  image: string
  available: boolean
  order: number
  base_popularity: number
  tags: string[]
  option_groups: ProductOptionGroup[]
}

export interface Service {
  id: string
  store_id: string
  name: string
  description: string
  category_id: string
  price_type: 'fixed' | 'from' | 'quote'
  price_cents: number | null
  duration_min: number | null
  service_mode: 'in_store' | 'on_site' | 'remote'
  booking_required: boolean
  image: string
  available: boolean
  order: number
  tags: string[]
}

export interface Vehicle {
  id: string
  store_id: string
  name: string
  description: string
  category_id: string
  make: string
  model: string
  year: number
  mileage_km: number
  condition: 'new' | 'used'
  fuel: string
  transmission: string
  price_cents: number
  negotiable: boolean
  image: string
  available: boolean
  order: number
  tags: string[]
}

export interface Promo {
  id: string
  store_id: string
  product_id: string | null
  title: string
  description: string
  image: string
  starts_at: string
  ends_at: string
  active: boolean
}

export interface Catalog {
  config: CatalogConfig
  categories: Category[]
  stores: Store[]
  products: Product[]
  services: Service[]
  vehicles: Vehicle[]
  promos: Promo[]
}
