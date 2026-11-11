# Galeria — Banco de dados (MVP)

> Fonte da verdade do catálogo. Editado à mão em Markdown.
> O app não lê este arquivo diretamente: o build gera `db.json`.

## config
```yaml
schema_version: 2
app_name: "Galeria de Natividade"
city: "Natividade"
timezone: "America/Sao_Paulo"
payment_methods: ["pix", "cash", "debit", "credit"]

geo:
  default_center: { lat: -21.123456, lng: -41.654321 } # Substitua pela lat/lng real de Natividade
  nearby_radius_km: 30
  far_radius_km: 100

ranking:
  repeat_order_weight: 100
  same_city_weight: 50
  nearby_city_weight: 20
  far_city_weight: 5
  popularity_weight: 1
  open_now_bonus: 15
  distance_decay_km: 5

whatsapp:
  message_template: |
    *Pedido — {{store_name}}*
    {{mode}}
    {{items}}
    *Subtotal:* {{subtotal}}
    *Entrega:* {{delivery_fee}}
    *Total:* {{total}}
    *Pagamento:* {{payment}}
    *Cliente:* {{customer}}
    {{address}}
    {{notes}}
```

## categories
```yaml
- { id: "lanches",  name: "Lanches",       icon: "burger",   order: 1 }
- { id: "porcoes",  name: "Porções",       icon: "fries",    order: 2 }
- { id: "doces",    name: "Açaí & Doces",  icon: "icecream", order: 3 }
- { id: "bebidas",  name: "Bebidas",       icon: "cup",      order: 4 }
```

## stores
```yaml
- id: "rock-burger"
  name: "Rock Burger"
  description: "Hambúrgueres artesanais, porções e açaí. Comece com atitude!"
  category_ids: ["lanches", "porcoes", "doces", "bebidas"]
  status: "active"
  order: 1
  base_popularity: 150
  whatsapp: "5522992383985"
  logo: "/images/logo-rock-burger.png"
  cover: "/images/local-rock-burger.jpg"
  location_image: ""
  
  geo:
    lat: -21.123456
    lng: -41.654321
    city: "Natividade"
    state: "RJ"
    
  address:
    street: "Delivery via WhatsApp"
    number: "S/N"
    neighborhood: "Centro"
    reference: "Natividade-RJ"
    
  hours:
    mon: [{ open: "18:00", close: "23:59" }]
    tue: [{ open: "18:00", close: "23:59" }]
    wed: [{ open: "18:00", close: "23:59" }]
    thu: [{ open: "18:00", close: "23:59" }]
    fri: [{ open: "18:00", close: "23:59" }]
    sat: [{ open: "18:00", close: "23:59" }]
    sun: [{ open: "18:00", close: "23:59" }]
    
  hours_exceptions: []
  payment_methods: ["pix", "cash", "debit", "credit"]
  
  delivery:
    enabled: true
    fee_cents: 200
    min_order_cents: 0
    eta_min: 40
    radius_km: 5
  pickup:
    enabled: true
    eta_min: 20
    
  tags: ["hamburguer", "acai", "porcao", "salgadinho", "combo", "rock"]
```

## products
```yaml
# ==========================================
# MINI SALGADINHOS
# ==========================================
- id: "rock-burger-mini-salgadinhos-25"
  store_id: "rock-burger"
  name: "Mini Salgadinhos (25 un)"
  description: "Sabores: coxinha, bolinha de queijo, presunto/queijo, medalhão, balão ou mini churros."
  category: "Salgadinhos"
  price_cents: 2500
  promo_price_cents: null
  image: ""
  available: true
  order: 1
  base_popularity: 10
  tags: ["frito", "congelado"]
  option_groups:
    - id: "preparo"
      name: "Como prefere?"
      required: true
      min: 1
      max: 1
      options:
        - { id: "congelado", name: "Congelado (R$ 25,00)", price_delta_cents: 0 }
        - { id: "frito",     name: "Frito (R$ 30,00)",     price_delta_cents: 500 }
    - id: "sabores"
      name: "Sabores (escolha até 6)"
      required: true
      min: 1
      max: 6
      options:
        - { id: "coxinha", name: "Coxinha de frango", price_delta_cents: 0 }
        - { id: "presunto-queijo", name: "Presunto e queijo", price_delta_cents: 0 }
        - { id: "balao", name: "Balão de calabresa", price_delta_cents: 0 }
        - { id: "bolinha", name: "Bolinha de queijo", price_delta_cents: 0 }
        - { id: "medalhao", name: "Medalhão de salsicha", price_delta_cents: 0 }
        - { id: "churros", name: "Mini churros (doce de leite)", price_delta_cents: 0 }

- id: "rock-burger-mini-salgadinhos-50"
  store_id: "rock-burger"
  name: "Mini Salgadinhos (50 un)"
  description: "Sabores variados."
  category: "Salgadinhos"
  price_cents: 4500
  promo_price_cents: null
  image: ""
  available: true
  order: 2
  base_popularity: 5
  tags: ["frito", "congelado"]
  option_groups:
    - id: "preparo"
      name: "Como prefere?"
      required: true
      min: 1
      max: 1
      options:
        - { id: "congelado", name: "Congelado (R$ 45,00)", price_delta_cents: 0 }
        - { id: "frito",     name: "Frito (R$ 50,00)",     price_delta_cents: 500 }
    - id: "sabores"
      name: "Sabores (escolha até 6)"
      required: true
      min: 1
      max: 6
      options:
        - { id: "coxinha", name: "Coxinha de frango", price_delta_cents: 0 }
        - { id: "presunto-queijo", name: "Presunto e queijo", price_delta_cents: 0 }
        - { id: "balao", name: "Balão de calabresa", price_delta_cents: 0 }
        - { id: "bolinha", name: "Bolinha de queijo", price_delta_cents: 0 }
        - { id: "medalhao", name: "Medalhão de salsicha", price_delta_cents: 0 }
        - { id: "churros", name: "Mini churros (doce de leite)", price_delta_cents: 0 }

# ==========================================
# TRADICIONAIS DE BOI
# ==========================================
- id: "rock-burger-hamburguer"
  store_id: "rock-burger"
  name: "Hambúrguer"
  description: "Pão, bife 150g, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 1390
  promo_price_cents: null
  image: ""
  available: true
  order: 10
  base_popularity: 20
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-x-burguer"
  store_id: "rock-burger"
  name: "X-Burguer"
  description: "Pão, bife 150g, queijo, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 1690
  promo_price_cents: null
  image: ""
  available: true
  order: 11
  base_popularity: 25
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-bacon-burguer"
  store_id: "rock-burger"
  name: "Bacon Burguer"
  description: "Pão, bife 150g, bacon, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 1690
  promo_price_cents: null
  image: ""
  available: true
  order: 12
  base_popularity: 15
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-x-salada"
  store_id: "rock-burger"
  name: "X-Salada"
  description: "Pão, bife 150g, queijo, presunto, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 1990
  promo_price_cents: null
  image: ""
  available: true
  order: 13
  base_popularity: 30
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-x-bacon"
  store_id: "rock-burger"
  name: "X-Bacon"
  description: "Pão, bife 150g, bacon, queijo, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 1990
  promo_price_cents: null
  image: ""
  available: true
  order: 14
  base_popularity: 40
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-x-salada-bacon"
  store_id: "rock-burger"
  name: "X-Salada Bacon"
  description: "Pão, bife 150g, bacon, queijo, presunto, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 2090
  promo_price_cents: null
  image: ""
  available: true
  order: 15
  base_popularity: 18
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-eggs-x-salada"
  store_id: "rock-burger"
  name: "Eggs X Salada"
  description: "Pão, bife 150g, ovo, queijo, presunto, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 2090
  promo_price_cents: null
  image: ""
  available: true
  order: 16
  base_popularity: 12
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-eggs-x-bacon"
  store_id: "rock-burger"
  name: "Eggs X Bacon"
  description: "Pão, bife 150g, ovo, queijo, bacon, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 2090
  promo_price_cents: null
  image: ""
  available: true
  order: 17
  base_popularity: 15
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-x-tudo"
  store_id: "rock-burger"
  name: "X-Tudo"
  description: "Pão, bife 150g, ovo, queijo, presunto, bacon, tomate, alface, batata palha e cheddar."
  category: "Tradicionais de Boi"
  price_cents: 2390
  promo_price_cents: null
  image: ""
  available: true
  order: 18
  base_popularity: 50
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-americano"
  store_id: "rock-burger"
  name: "Americano"
  description: "Pão, ovo, mussarela, presunto, tomate, alface e batata palha."
  category: "Tradicionais de Boi"
  price_cents: 1890
  promo_price_cents: null
  image: ""
  available: true
  order: 19
  base_popularity: 8
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-misto-quente"
  store_id: "rock-burger"
  name: "Misto Quente"
  description: "Pão, queijo e presunto."
  category: "Tradicionais de Boi"
  price_cents: 1190
  promo_price_cents: null
  image: ""
  available: true
  order: 20
  base_popularity: 5
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

# ==========================================
# TRADICIONAIS DE FRANGO
# ==========================================
- id: "rock-burger-galis-burger"
  store_id: "rock-burger"
  name: "Galis Burguer"
  description: "Pão, frango, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 1590
  promo_price_cents: null
  image: ""
  available: true
  order: 30
  base_popularity: 10
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-bacon-burger"
  store_id: "rock-burger"
  name: "Galis Bacon Burguer"
  description: "Pão, frango, bacon, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 1890
  promo_price_cents: null
  image: ""
  available: true
  order: 31
  base_popularity: 12
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-eggs-burger"
  store_id: "rock-burger"
  name: "Galis Eggs Burguer"
  description: "Pão, frango, ovo, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 1890
  promo_price_cents: null
  image: ""
  available: true
  order: 32
  base_popularity: 5
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-x-burguer"
  store_id: "rock-burger"
  name: "Galis X Burguer"
  description: "Pão, frango, queijo, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 1890
  promo_price_cents: null
  image: ""
  available: true
  order: 33
  base_popularity: 22
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-x-bacon"
  store_id: "rock-burger"
  name: "Galis X Bacon"
  description: "Pão, frango, bacon, queijo, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 2190
  promo_price_cents: null
  image: ""
  available: true
  order: 34
  base_popularity: 14
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-x-salada"
  store_id: "rock-burger"
  name: "Galis X Salada"
  description: "Pão, frango, queijo, presunto, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 2190
  promo_price_cents: null
  image: ""
  available: true
  order: 35
  base_popularity: 9
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-x-salada-bacon"
  store_id: "rock-burger"
  name: "Galis X Salada Bacon"
  description: "Pão, frango, queijo, presunto, bacon, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 2290
  promo_price_cents: null
  image: ""
  available: true
  order: 36
  base_popularity: 11
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-eggs-x-salada"
  store_id: "rock-burger"
  name: "Galis Eggs X Salada"
  description: "Pão, frango, ovo, queijo, presunto, tomate, alface, batata palha e cheddar."
  category: "Tradicionais de Frango"
  price_cents: 2290
  promo_price_cents: null
  image: ""
  available: true
  order: 37
  base_popularity: 7
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-eggs-x-bacon"
  store_id: "rock-burger"
  name: "Galis Eggs X Bacon"
  description: "Pão, frango, ovo, queijo, bacon, tomate, alface e batata palha."
  category: "Tradicionais de Frango"
  price_cents: 2290
  promo_price_cents: null
  image: ""
  available: true
  order: 38
  base_popularity: 9
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-galis-x-tudo"
  store_id: "rock-burger"
  name: "Galis X Tudo"
  description: "Pão, frango, ovo, queijo, presunto, bacon, tomate, alface, batata palha e cheddar."
  category: "Tradicionais de Frango"
  price_cents: 2590
  promo_price_cents: null
  image: ""
  available: true
  order: 39
  base_popularity: 15
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

# ==========================================
# ESPECIAIS DA CASA
# ==========================================
- id: "rock-burger-nirvana"
  store_id: "rock-burger"
  name: "Nirvana"
  description: "Pão, 2x bifes 150g, 2x bacon, cheddar, tomate e alface."
  category: "Especiais da Casa"
  price_cents: 2690
  promo_price_cents: null
  image: ""
  available: true
  order: 50
  base_popularity: 25
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-pearl-jam"
  store_id: "rock-burger"
  name: "Pearl Jam"
  description: "Pão, 2x bife 150g, cheddar, molho barbecue, tomate e alface."
  category: "Especiais da Casa"
  price_cents: 2690
  promo_price_cents: null
  image: ""
  available: true
  order: 51
  base_popularity: 20
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-pink-floyd"
  store_id: "rock-burger"
  name: "Pink Floyd"
  description: "Pão, 2x bife 150g, bacon, cebola caramelizada e molho especial."
  category: "Especiais da Casa"
  price_cents: 2690
  promo_price_cents: null
  image: ""
  available: true
  order: 52
  base_popularity: 22
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-rock-burger"
  store_id: "rock-burger"
  name: "Rock Burger"
  description: "Pão, 3x bifes 150g, 3x bacon, 2x queijo, 2x cheddar e molho especial."
  category: "Especiais da Casa"
  price_cents: 3290
  promo_price_cents: null
  image: ""
  available: true
  order: 53
  base_popularity: 35
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-red-hot"
  store_id: "rock-burger"
  name: "Red Hot"
  description: "Pão, 2x bife 150g, ovo, bacon, queijo, banana, tomate e alface."
  category: "Especiais da Casa"
  price_cents: 2690
  promo_price_cents: null
  image: ""
  available: true
  order: 54
  base_popularity: 18
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-duplo-carne"
  store_id: "rock-burger"
  name: "Duplo Carne"
  description: "Pão, 2x bife 150g, ovo, bacon, queijo, presunto, tomate, alface, batata palha e cheddar."
  category: "Especiais da Casa"
  price_cents: 2790
  promo_price_cents: null
  image: ""
  available: true
  order: 55
  base_popularity: 28
  tags: []
  option_groups:
    - id: "turbine"
      name: "Turbine seu lanche"
      required: false
      min: 0
      max: 7
      options:
        - { id: "bife-frango", name: "Bife de frango (R$ 7,00)", price_delta_cents: 700 }
        - { id: "bife-boi", name: "Bife de boi (R$ 6,00)", price_delta_cents: 600 }
        - { id: "bacon", name: "Bacon (R$ 5,00)", price_delta_cents: 500 }
        - { id: "banana", name: "Banana (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cheddar", name: "Cheddar (R$ 4,00)", price_delta_cents: 400 }
        - { id: "cebola", name: "Cebola roxa (R$ 4,00)", price_delta_cents: 400 }
        - { id: "queijo", name: "Queijo (R$ 4,00)", price_delta_cents: 400 }

# ==========================================
# PORÇÕES DE BATATA
# ==========================================
- id: "rock-burger-batata-250g"
  store_id: "rock-burger"
  name: "Porção de Batata 250g"
  description: "Escolha o sabor da sua batata."
  category: "Porções de Batata"
  price_cents: 1500
  promo_price_cents: null
  image: ""
  available: true
  order: 60
  base_popularity: 30
  tags: []
  option_groups:
    - id: "sabor-batata"
      name: "Sabor"
      required: true
      min: 1
      max: 1
      options:
        - { id: "simples", name: "Simples (R$ 15,00)", price_delta_cents: 0 }
        - { id: "bacon-cheddar", name: "Bacon c/ cheddar (R$ 22,00)", price_delta_cents: 700 }
        - { id: "bacon-mussarela", name: "Bacon c/ mussarela (R$ 22,00)", price_delta_cents: 700 }
    - id: "extra-queijo"
      name: "Muito mais queijo!"
      required: false
      min: 0
      max: 1
      options:
        - { id: "sim", name: "Adicionar queijo extra (+ R$ 4,00)", price_delta_cents: 400 }

- id: "rock-burger-batata-500g"
  store_id: "rock-burger"
  name: "Porção de Batata 500g"
  description: "Escolha o sabor da sua batata."
  category: "Porções de Batata"
  price_cents: 2800
  promo_price_cents: null
  image: ""
  available: true
  order: 61
  base_popularity: 15
  tags: []
  option_groups:
    - id: "sabor-batata"
      name: "Sabor"
      required: true
      min: 1
      max: 1
      options:
        - { id: "simples", name: "Simples (R$ 28,00)", price_delta_cents: 0 }
        - { id: "bacon-cheddar", name: "Bacon c/ cheddar (R$ 35,00)", price_delta_cents: 700 }
        - { id: "bacon-mussarela", name: "Bacon c/ mussarela (R$ 35,00)", price_delta_cents: 700 }
    - id: "extra-queijo"
      name: "Muito mais queijo!"
      required: false
      min: 0
      max: 1
      options:
        - { id: "sim", name: "Adicionar queijo extra (+ R$ 4,00)", price_delta_cents: 400 }

# ==========================================
# AÇAÍ
# ==========================================
- id: "rock-burger-acai-200ml"
  store_id: "rock-burger"
  name: "Açaí 200ml"
  description: "Açaí cremoso com até 2 acompanhamentos e 1 cobertura."
  category: "Açaí"
  price_cents: 800
  promo_price_cents: null
  image: ""
  available: true
  order: 70
  base_popularity: 20
  tags: []
  option_groups:
    - id: "acompanhamentos"
      name: "Acompanhamentos (escolha 2)"
      required: true
      min: 2
      max: 2
      options:
        - { id: "leite-po", name: "Leite em pó", price_delta_cents: 0 }
        - { id: "pacoca", name: "Paçoca", price_delta_cents: 0 }
        - { id: "chocoboll", name: "Choco Boll", price_delta_cents: 0 }
        - { id: "sucrilhos", name: "Sucrilhos", price_delta_cents: 0 }
        - { id: "cereal", name: "Cereal Ball", price_delta_cents: 0 }
        - { id: "confete", name: "Confete", price_delta_cents: 0 }
    - id: "cobertura"
      name: "Cobertura (escolha 1)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "chocolate", name: "Chocolate", price_delta_cents: 0 }
        - { id: "morango", name: "Morango", price_delta_cents: 0 }
        - { id: "caramelo", name: "Caramelo", price_delta_cents: 0 }

- id: "rock-burger-acai-300ml"
  store_id: "rock-burger"
  name: "Açaí 300ml"
  description: "Açaí cremoso com até 3 acompanhamentos e 1 cobertura."
  category: "Açaí"
  price_cents: 1300
  promo_price_cents: null
  image: ""
  available: true
  order: 71
  base_popularity: 25
  tags: []
  option_groups:
    - id: "acompanhamentos"
      name: "Acompanhamentos (escolha 3)"
      required: true
      min: 3
      max: 3
      options:
        - { id: "leite-po", name: "Leite em pó", price_delta_cents: 0 }
        - { id: "pacoca", name: "Paçoca", price_delta_cents: 0 }
        - { id: "chocoboll", name: "Choco Boll", price_delta_cents: 0 }
        - { id: "sucrilhos", name: "Sucrilhos", price_delta_cents: 0 }
        - { id: "cereal", name: "Cereal Ball", price_delta_cents: 0 }
        - { id: "confete", name: "Confete", price_delta_cents: 0 }
    - id: "cobertura"
      name: "Cobertura (escolha 1)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "chocolate", name: "Chocolate", price_delta_cents: 0 }
        - { id: "morango", name: "Morango", price_delta_cents: 0 }
        - { id: "caramelo", name: "Caramelo", price_delta_cents: 0 }

- id: "rock-burger-acai-500ml"
  store_id: "rock-burger"
  name: "Açaí 500ml"
  description: "Açaí cremoso com até 4 acompanhamentos e 1 cobertura."
  category: "Açaí"
  price_cents: 1800
  promo_price_cents: null
  image: ""
  available: true
  order: 72
  base_popularity: 40
  tags: []
  option_groups:
    - id: "acompanhamentos"
      name: "Acompanhamentos (escolha 4)"
      required: true
      min: 4
      max: 4
      options:
        - { id: "leite-po", name: "Leite em pó", price_delta_cents: 0 }
        - { id: "pacoca", name: "Paçoca", price_delta_cents: 0 }
        - { id: "chocoboll", name: "Choco Boll", price_delta_cents: 0 }
        - { id: "sucrilhos", name: "Sucrilhos", price_delta_cents: 0 }
        - { id: "cereal", name: "Cereal Ball", price_delta_cents: 0 }
        - { id: "confete", name: "Confete", price_delta_cents: 0 }
    - id: "cobertura"
      name: "Cobertura (escolha 1)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "chocolate", name: "Chocolate", price_delta_cents: 0 }
        - { id: "morango", name: "Morango", price_delta_cents: 0 }
        - { id: "caramelo", name: "Caramelo", price_delta_cents: 0 }

- id: "rock-burger-acai-700ml"
  store_id: "rock-burger"
  name: "Açaí 700ml"
  description: "Açaí cremoso com até 5 acompanhamentos e 1 cobertura."
  category: "Açaí"
  price_cents: 2200
  promo_price_cents: null
  image: ""
  available: true
  order: 73
  base_popularity: 18
  tags: []
  option_groups:
    - id: "acompanhamentos"
      name: "Acompanhamentos (escolha 5)"
      required: true
      min: 5
      max: 5
      options:
        - { id: "leite-po", name: "Leite em pó", price_delta_cents: 0 }
        - { id: "pacoca", name: "Paçoca", price_delta_cents: 0 }
        - { id: "chocoboll", name: "Choco Boll", price_delta_cents: 0 }
        - { id: "sucrilhos", name: "Sucrilhos", price_delta_cents: 0 }
        - { id: "cereal", name: "Cereal Ball", price_delta_cents: 0 }
        - { id: "confete", name: "Confete", price_delta_cents: 0 }
    - id: "cobertura"
      name: "Cobertura (escolha 1)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "chocolate", name: "Chocolate", price_delta_cents: 0 }
        - { id: "morango", name: "Morango", price_delta_cents: 0 }
        - { id: "caramelo", name: "Caramelo", price_delta_cents: 0 }

- id: "rock-burger-acai-1l"
  store_id: "rock-burger"
  name: "Açaí 1L"
  description: "Açaí cremoso com até 6 acompanhamentos e 1 cobertura."
  category: "Açaí"
  price_cents: 3000
  promo_price_cents: null
  image: ""
  available: true
  order: 74
  base_popularity: 12
  tags: []
  option_groups:
    - id: "acompanhamentos"
      name: "Acompanhamentos (escolha 6)"
      required: true
      min: 6
      max: 6
      options:
        - { id: "leite-po", name: "Leite em pó", price_delta_cents: 0 }
        - { id: "pacoca", name: "Paçoca", price_delta_cents: 0 }
        - { id: "chocoboll", name: "Choco Boll", price_delta_cents: 0 }
        - { id: "sucrilhos", name: "Sucrilhos", price_delta_cents: 0 }
        - { id: "cereal", name: "Cereal Ball", price_delta_cents: 0 }
        - { id: "confete", name: "Confete", price_delta_cents: 0 }
    - id: "cobertura"
      name: "Cobertura (escolha 1)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "chocolate", name: "Chocolate", price_delta_cents: 0 }
        - { id: "morango", name: "Morango", price_delta_cents: 0 }
        - { id: "caramelo", name: "Caramelo", price_delta_cents: 0 }

# ==========================================
# COMBOS
# ==========================================
- id: "rock-burger-combo-kids"
  store_id: "rock-burger"
  name: "Combo Kids"
  description: "1 Hamburger + Batata 150g + Guaravita."
  category: "Combos"
  price_cents: 2590
  promo_price_cents: null
  image: ""
  available: true
  order: 80
  base_popularity: 10
  tags: ["combo"]
  option_groups: []

- id: "rock-burger-combo-casal"
  store_id: "rock-burger"
  name: "Combo Casal"
  description: "2 Bacon burger + Batata 250g + Guaraná 1L."
  category: "Combos"
  price_cents: 5290
  promo_price_cents: null
  image: ""
  available: true
  order: 81
  base_popularity: 15
  tags: ["combo"]
  option_groups: []

- id: "rock-burger-combo-familia"
  store_id: "rock-burger"
  name: "Combo Família"
  description: "4 X-salada + Batata 300g + Refri 2L."
  category: "Combos"
  price_cents: 10590
  promo_price_cents: null
  image: ""
  available: true
  order: 82
  base_popularity: 5
  tags: ["combo"]
  option_groups:
    - id: "sabor-refri"
      name: "Sabor do Refri (2L)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "coca", name: "Coca-Cola", price_delta_cents: 0 }
        - { id: "guarana", name: "Guaraná", price_delta_cents: 0 }
        - { id: "fanta-uva", name: "Fanta Uva", price_delta_cents: 0 }
        - { id: "fanta-laranja", name: "Fanta Laranja", price_delta_cents: 0 }

- id: "rock-burger-combo-insano-1"
  store_id: "rock-burger"
  name: "Combo Insano 1"
  description: "2 Burguers + 1 Batata 100g + 25 salgadinhos + 1 coca 600ml."
  category: "Combos Insanos"
  price_cents: 7590
  promo_price_cents: null
  image: ""
  available: true
  order: 83
  base_popularity: 8
  tags: ["combo"]
  option_groups:
    - id: "sabor-refri"
      name: "Sabor do Refri (600ml)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "coca", name: "Coca-Cola", price_delta_cents: 0 }
        - { id: "guarana", name: "Guaraná", price_delta_cents: 0 }
        - { id: "fanta-uva", name: "Fanta Uva", price_delta_cents: 0 }
        - { id: "fanta-laranja", name: "Fanta Laranja", price_delta_cents: 0 }

- id: "rock-burger-combo-insano-2"
  store_id: "rock-burger"
  name: "Combo Insano 2"
  description: "4 X-Burguers + 1 Batata 250g + 25 Salgadinhos + 1 Refri 2L."
  category: "Combos Insanos"
  price_cents: 12590
  promo_price_cents: null
  image: ""
  available: true
  order: 84
  base_popularity: 3
  tags: ["combo"]
  option_groups:
    - id: "sabor-refri"
      name: "Sabor do Refri (2L)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "coca", name: "Coca-Cola", price_delta_cents: 0 }
        - { id: "guarana", name: "Guaraná", price_delta_cents: 0 }
        - { id: "fanta-uva", name: "Fanta Uva", price_delta_cents: 0 }
        - { id: "fanta-laranja", name: "Fanta Laranja", price_delta_cents: 0 }

- id: "rock-burger-combo-insano-3"
  store_id: "rock-burger"
  name: "Combo Insano 3"
  description: "1 Batata 250g c/ cheddar e bacon + 25 Salgadinhos + 1 Coca 600ml."
  category: "Combos Insanos"
  price_cents: 5390
  promo_price_cents: null
  image: ""
  available: true
  order: 85
  base_popularity: 12
  tags: ["combo"]
  option_groups:
    - id: "sabor-refri"
      name: "Sabor do Refri (600ml)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "coca", name: "Coca-Cola", price_delta_cents: 0 }
        - { id: "guarana", name: "Guaraná", price_delta_cents: 0 }
        - { id: "fanta-uva", name: "Fanta Uva", price_delta_cents: 0 }
        - { id: "fanta-laranja", name: "Fanta Laranja", price_delta_cents: 0 }

- id: "rock-burger-combo-insano-4"
  store_id: "rock-burger"
  name: "Combo Insano 4"
  description: "1 Batata 500g c/ cheddar e bacon + 50 Salgadinhos + 1 Refri 2L."
  category: "Combos Insanos"
  price_cents: 9990
  promo_price_cents: null
  image: ""
  available: true
  order: 86
  base_popularity: 4
  tags: ["combo"]
  option_groups:
    - id: "sabor-refri"
      name: "Sabor do Refri (2L)"
      required: true
      min: 1
      max: 1
      options:
        - { id: "coca", name: "Coca-Cola", price_delta_cents: 0 }
        - { id: "guarana", name: "Guaraná", price_delta_cents: 0 }
        - { id: "fanta-uva", name: "Fanta Uva", price_delta_cents: 0 }
        - { id: "fanta-laranja", name: "Fanta Laranja", price_delta_cents: 0 }

# ==========================================
# BEBIDAS
# ==========================================
- id: "rock-burger-agua-com-gas"
  store_id: "rock-burger"
  name: "Água com Gás"
  description: "Garrafa 500ml."
  category: "Bebidas"
  price_cents: 400
  promo_price_cents: null
  image: ""
  available: true
  order: 90
  base_popularity: 0
  tags: []
  option_groups: []

- id: "rock-burger-agua-sem-gas"
  store_id: "rock-burger"
  name: "Água sem Gás"
  description: "Garrafa 500ml."
  category: "Bebidas"
  price_cents: 300
  promo_price_cents: null
  image: ""
  available: true
  order: 91
  base_popularity: 0
  tags: []
  option_groups: []

- id: "rock-burger-refri-lata"
  store_id: "rock-burger"
  name: "Refrigerante Lata"
  description: "Lata 350ml."
  category: "Bebidas"
  price_cents: 800
  promo_price_cents: null
  image: ""
  available: true
  order: 92
  base_popularity: 30
  tags: []
  option_groups:
    - id: "sabor"
      name: "Sabor"
      required: true
      min: 1
      max: 1
      options:
        - { id: "coca", name: "Coca-Cola", price_delta_cents: 0 }
        - { id: "guarana", name: "Guaraná", price_delta_cents: 0 }
        - { id: "fanta-uva", name: "Fanta Uva", price_delta_cents: 0 }
        - { id: "fanta-laranja", name: "Fanta Laranja", price_delta_cents: 0 }

- id: "rock-burger-refri-2l"
  store_id: "rock-burger"
  name: "Refrigerante 2L"
  description: "Garrafa 2 litros."
  category: "Bebidas"
  price_cents: 1600
  promo_price_cents: null
  image: ""
  available: true
  order: 93
  base_popularity: 15
  tags: []
  option_groups:
    - id: "sabor"
      name: "Sabor"
      required: true
      min: 1
      max: 1
      options:
        - { id: "coca", name: "Coca-Cola", price_delta_cents: 0 }
        - { id: "guarana", name: "Guaraná", price_delta_cents: 0 }
        - { id: "fanta-uva", name: "Fanta Uva", price_delta_cents: 0 }
        - { id: "fanta-laranja", name: "Fanta Laranja", price_delta_cents: 0 }

- id: "rock-burger-refri-600ml"
  store_id: "rock-burger"
  name: "Coca-Cola 600ml"
  description: "Garrafa 600ml."
  category: "Bebidas"
  price_cents: 1000
  promo_price_cents: null
  image: ""
  available: true
  order: 94
  base_popularity: 20
  tags: []
  option_groups: []

- id: "rock-burger-guaravita"
  store_id: "rock-burger"
  name: "Guaravita"
  description: "Garrafinha 200ml."
  category: "Bebidas"
  price_cents: 300
  promo_price_cents: null
  image: ""
  available: true
  order: 95
  base_popularity: 5
  tags: []
  option_groups: []

- id: "rock-burger-guarana-1l"
  store_id: "rock-burger"
  name: "Guaraná 1L"
  description: "Garrafa 1 litro."
  category: "Bebidas"
  price_cents: 1000
  promo_price_cents: null
  image: ""
  available: true
  order: 96
  base_popularity: 10
  tags: []
  option_groups: []

- id: "rock-burger-suco-del-valle-1l"
  store_id: "rock-burger"
  name: "Suco Del Valle 1L"
  description: "Diversos sabores."
  category: "Bebidas"
  price_cents: 1000
  promo_price_cents: null
  image: ""
  available: true
  order: 97
  base_popularity: 5
  tags: []
  option_groups: []

- id: "rock-burger-suco-del-valle-15l"
  store_id: "rock-burger"
  name: "Suco Del Valle 1,5L"
  description: "Diversos sabores."
  category: "Bebidas"
  price_cents: 1300
  promo_price_cents: null
  image: ""
  available: true
  order: 98
  base_popularity: 5
  tags: []
  option_groups: []

- id: "rock-burger-cerveja-latao"
  store_id: "rock-burger"
  name: "Cerveja Latão"
  description: "Latão 473ml."
  category: "Bebidas"
  price_cents: 800
  promo_price_cents: null
  image: ""
  available: true
  order: 99
  base_popularity: 40
  tags: []
  option_groups:
    - id: "marca"
      name: "Marca"
      required: true
      min: 1
      max: 1
      options:
        - { id: "brahma", name: "Brahma (R$ 8,00)", price_delta_cents: 0 }
        - { id: "antarctica", name: "Antarctica (R$ 8,00)", price_delta_cents: 0 }
        - { id: "heineken", name: "Heineken (R$ 10,00)", price_delta_cents: 200 }

- id: "rock-burger-cerveja-600ml"
  store_id: "rock-burger"
  name: "Cerveja 600ml"
  description: "Garrafa 600ml."
  category: "Bebidas"
  price_cents: 1200
  promo_price_cents: null
  image: ""
  available: true
  order: 100
  base_popularity: 25
  tags: []
  option_groups:
    - id: "marca"
      name: "Marca"
      required: true
      min: 1
      max: 1
      options:
        - { id: "brahma", name: "Brahma", price_delta_cents: 0 }
        - { id: "antarctica", name: "Antarctica", price_delta_cents: 0 }
        - { id: "heineken", name: "Heineken", price_delta_cents: 0 }
```

## promos
```yaml
[]
```
