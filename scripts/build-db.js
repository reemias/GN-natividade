import {
  existsSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "data", "db.md");
const publicPath = resolve(root, "public");
const outputPath = resolve(publicPath, "db.json");
const slug = z
  .string()
  .regex(/^[a-z0-9-]+$/, "use apenas letras minúsculas, números e hífens");
const cents = z.number().int().nonnegative();
const interval = z
  .object({
    open: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
    close: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.close <= value.open) {
      context.addIssue({
        code: "custom",
        message: "close deve ser posterior a open",
      });
    }
  });
const dayHours = z.array(interval);
const hours = z
  .object({
    mon: dayHours,
    tue: dayHours,
    wed: dayHours,
    thu: dayHours,
    fri: dayHours,
    sat: dayHours,
    sun: dayHours,
  })
  .strict();
const paymentMethod = z.enum(["pix", "cash", "debit", "credit", "voucher"]);
const geoPoint = z
  .object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  })
  .strict();
const configSchema = z
  .object({
    schema_version: z.literal(2),
    app_name: z.string().min(1).max(60),
    city: z.string().min(1).max(60),
    timezone: z.string().refine((value) => {
      try {
        new Intl.DateTimeFormat("en", { timeZone: value });
        return true;
      } catch {
        return false;
      }
    }, "deve ser um fuso IANA válido"),
    payment_methods: z
      .array(paymentMethod)
      .refine(
        (methods) => new Set(methods).size === methods.length,
        "não pode repetir formas de pagamento",
      ),
    geo: z
      .object({
        default_center: geoPoint,
        nearby_radius_km: z.number().int().positive(),
        far_radius_km: z.number().int().positive(),
      })
      .strict(),
    ranking: z
      .object({
        repeat_order_weight: z.number().positive(),
        same_city_weight: z.number().positive(),
        nearby_city_weight: z.number().positive(),
        far_city_weight: z.number().positive(),
        popularity_weight: z.number().positive(),
        open_now_bonus: z.number().positive(),
        distance_decay_km: z.number().positive(),
      })
      .strict(),
    whatsapp: z
      .object({
        message_template: z.string().min(1),
      })
      .strict(),
  })
  .strict();
const categorySchema = z
  .object({
    id: slug,
    name: z.string().min(1).max(40),
    icon: z.string().regex(/^[a-z-]+$/),
    order: z.number().int().positive(),
  })
  .strict();
const exceptionSchema = z
  .object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .refine((value) => {
        const parsedDate = new Date(`${value}T00:00:00Z`);
        return (
          !Number.isNaN(parsedDate.getTime()) &&
          parsedDate.toISOString().slice(0, 10) === value
        );
      }, "deve ser uma data válida no formato YYYY-MM-DD"),
    closed: z.boolean(),
    intervals: z.array(interval).optional(),
    note: z.string().max(80).optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.closed && value.intervals !== undefined) {
      context.addIssue({
        code: "custom",
        message: "não informe intervals quando closed for true",
      });
    }
    if (!value.closed && value.intervals === undefined) {
      context.addIssue({
        code: "custom",
        message: "informe intervals quando closed for false",
      });
    }
  });
const storeSchema = z
  .object({
    id: slug,
    name: z.string().min(1).max(60),
    description: z.string().min(1).max(200),
    business_type: z
      .enum(["food", "service", "retail", "vehicle", "mixed"])
      .default("food"),
    category_ids: z.array(slug).min(1),
    status: z.enum(["active", "paused", "draft"]),
    order: z.number().int().positive(),
    base_popularity: z.number().int().nonnegative(),
    whatsapp: z.string().regex(/^\d{12,13}$/),
    logo: z.string(),
    cover: z.string(),
    share_image: z
      .string()
      .regex(
        /^\/images\/[A-Za-z0-9/-]+\.(?:jpe?g|png)$/i,
        "use uma imagem PNG ou JPEG para compartilhamento",
      )
      .optional(),
    location_image: z.string().optional(),
    geo: geoPoint
      .extend({
        city: z.string().min(1).max(60),
        state: z.string().regex(/^[A-Z]{2}$/),
      })
      .strict(),
    address: z
      .object({
        street: z.string().min(1).max(80),
        number: z.string().min(1).max(10),
        neighborhood: z.string().min(1).max(60),
        reference: z.string().max(100).optional(),
      })
      .strict(),
    hours: hours,
    hours_exceptions: z.array(exceptionSchema),
    payment_methods: z.array(paymentMethod),
    delivery: z
      .object({
        enabled: z.boolean(),
        fee_cents: cents,
        min_order_cents: cents,
        eta_min: z.number().int().nonnegative(),
        radius_km: z.number().nonnegative(),
      })
      .strict()
      .superRefine((delivery, context) => {
        if (delivery.enabled && delivery.eta_min <= 0) {
          context.addIssue({
            code: "custom",
            path: ["eta_min"],
            message: "deve ser maior que zero quando entrega está ativa",
          });
        }
        if (delivery.enabled && delivery.radius_km <= 0) {
          context.addIssue({
            code: "custom",
            path: ["radius_km"],
            message: "deve ser maior que zero quando entrega está ativa",
          });
        }
      }),
    pickup: z
      .object({
        enabled: z.boolean(),
        eta_min: z.number().int().positive(),
      })
      .strict(),
    tags: z.array(slug),
  })
  .strict();
const optionSchema = z
  .object({
    id: slug,
    name: z.string().min(1).max(40),
    price_delta_cents: cents,
  })
  .strict();
const optionGroupSchema = z
  .object({
    id: slug,
    name: z.string().min(1).max(40),
    required: z.boolean(),
    min: z.number().int().nonnegative(),
    max: z.number().int().nonnegative(),
    options: z.array(optionSchema).min(1),
  })
  .strict()
  .superRefine((group, context) => {
    if (group.min > group.max || group.max > group.options.length) {
      context.addIssue({
        code: "custom",
        message: "min/max devem respeitar a quantidade de opções",
      });
    }
    if (group.required && group.min < 1) {
      context.addIssue({
        code: "custom",
        message: "grupo obrigatório deve ter min >= 1",
      });
    }
    addDuplicateIssue(group.options, "id", context, "id de opção duplicado");
  });
const productSchema = z
  .object({
    id: slug,
    store_id: slug,
    name: z.string().min(1).max(60),
    description: z.string().min(1).max(200),
    category: z.string().min(1).max(40),
    price_cents: z.number().int().positive(),
    promo_price_cents: cents.nullable(),
    image: z.string(),
    available: z.boolean(),
    order: z.number().int().positive(),
    base_popularity: z.number().int().nonnegative(),
    tags: z.array(slug),
    option_groups: z.array(optionGroupSchema),
  })
  .strict()
  .superRefine((product, context) => {
    if (
      product.promo_price_cents !== null &&
      product.promo_price_cents >= product.price_cents
    ) {
      context.addIssue({
        code: "custom",
        path: ["promo_price_cents"],
        message: "deve ser menor que price_cents",
      });
    }
    addDuplicateIssue(
      product.option_groups,
      "id",
      context,
      "id de grupo duplicado",
    );
  });
const serviceSchema = z
  .object({
    id: slug,
    store_id: slug,
    name: z.string().min(1).max(60),
    description: z.string().min(1).max(200),
    category_id: slug,
    price_type: z.enum(["fixed", "from", "quote"]),
    price_cents: cents.nullable(),
    duration_min: z.number().int().positive().nullable(),
    service_mode: z.enum(["in_store", "on_site", "remote"]),
    booking_required: z.boolean(),
    image: z.string(),
    available: z.boolean(),
    order: z.number().int().positive(),
    tags: z.array(slug),
  })
  .strict()
  .superRefine((service, context) => {
    if (service.price_type === "quote" && service.price_cents !== null) {
      context.addIssue({
        code: "custom",
        path: ["price_cents"],
        message: "deve ser null quando price_type for quote",
      });
    }
    if (
      service.price_type !== "quote" &&
      (service.price_cents === null || service.price_cents <= 0)
    ) {
      context.addIssue({
        code: "custom",
        path: ["price_cents"],
        message: "deve ser maior que zero quando o preço for fixo ou inicial",
      });
    }
  });
const vehicleSchema = z
  .object({
    id: slug,
    store_id: slug,
    name: z.string().min(1).max(60),
    description: z.string().min(1).max(200),
    category_id: slug,
    make: z.string().min(1).max(40),
    model: z.string().min(1).max(60),
    year: z.number().int(),
    mileage_km: z.number().int().nonnegative(),
    condition: z.enum(["new", "used"]),
    fuel: z.string().min(1).max(30),
    transmission: z.string().min(1).max(30),
    price_cents: z.number().int().positive(),
    negotiable: z.boolean(),
    image: z.string(),
    available: z.boolean(),
    order: z.number().int().positive(),
    tags: z.array(slug),
  })
  .strict()
  .superRefine((vehicle, context) => {
    if (vehicle.year < 1900 || vehicle.year > new Date().getFullYear() + 1) {
      context.addIssue({
        code: "custom",
        path: ["year"],
        message: "deve ser um ano válido de veículo",
      });
    }
  });
const promoSchema = z
  .object({
    id: slug,
    store_id: slug,
    product_id: slug.nullable(),
    title: z.string().min(1).max(60),
    description: z.string().min(1).max(120),
    image: z.string().min(1),
    starts_at: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/)
      .refine(
        (value) => Number.isFinite(Date.parse(value)),
        "deve ser uma data ISO válida com fuso",
      ),
    ends_at: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/)
      .refine(
        (value) => Number.isFinite(Date.parse(value)),
        "deve ser uma data ISO válida com fuso",
      ),
    active: z.boolean(),
  })
  .strict()
  .superRefine((promo, context) => {
    if (Date.parse(promo.ends_at) <= Date.parse(promo.starts_at)) {
      context.addIssue({
        code: "custom",
        path: ["ends_at"],
        message: "deve ser posterior a starts_at",
      });
    }
  });

function addDuplicateIssue(items, field, context, message) {
  const seen = new Set();
  items.forEach((item, index) => {
    if (seen.has(item[field])) {
      context.addIssue({ code: "custom", path: [index, field], message });
    }
    seen.add(item[field]);
  });
}

function parseSections(markdown) {
  const headings = [...markdown.matchAll(/^##\s+([a-z]+)\s*$/gm)];
  const required = ["config", "categories", "stores", "products", "promos"];
  const supported = [...required, "services", "vehicles"];
  const sections = new Map();

  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const name = heading[1];
    if (!supported.includes(name)) continue;
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    const section = markdown.slice(start, end);
    const block = /^```yaml\s*\r?\n([\s\S]*?)^```\s*$/m.exec(section);
    if (!block) throw new Error(`## ${name}: bloco yaml ausente`);

    try {
      sections.set(name, parseYaml(block[1], { uniqueKeys: true }));
    } catch (error) {
      const lineInBlock = error.linePos?.[0]?.line ?? 1;
      const sourceLine =
        markdown.slice(0, start + block.index).split(/\r?\n/).length +
        lineInBlock;
      throw new Error(
        `db.md:${sourceLine}: YAML inválido em ## ${name}: ${error.message}`,
      );
    }
  }

  for (const name of required) {
    if (!sections.has(name))
      throw new Error(`db.md: seção obrigatória ## ${name} ausente`);
  }
  return Object.fromEntries(sections);
}

function validateImagePath(label, imagePath, required = true) {
  if (!required && imagePath === undefined) return null;
  if (imagePath === "") return null;
  if (
    typeof imagePath !== "string" ||
    !/^\/images\/[A-Za-z0-9/-]+\.(?:jpe?g|png|webp|avif|svg)$/i.test(imagePath)
  ) {
    throw new Error(
      `${label}: use um caminho /images/... com extensão jpg, jpeg, png, webp, avif ou svg`,
    );
  }
  const absolutePath = resolve(publicPath, `.${imagePath}`);
  if (
    !absolutePath.startsWith(`${resolve(publicPath)}\\`) &&
    !absolutePath.startsWith(`${resolve(publicPath)}/`)
  ) {
    throw new Error(`${label}: caminho de imagem fora de public/`);
  }
  if (!existsSync(absolutePath))
    throw new Error(`${label}: arquivo não encontrado em public${imagePath}`);
  return absolutePath;
}

function validateCatalog(catalog) {
  const parsed = {};
  const schemas = {
    config: configSchema,
    categories: z.array(categorySchema).min(1).max(8),
    stores: z.array(storeSchema),
    products: z.array(productSchema),
    services: z.array(serviceSchema),
    vehicles: z.array(vehicleSchema),
    promos: z.array(promoSchema),
  };

  for (const [name, schema] of Object.entries(schemas)) {
    const result = schema.safeParse(catalog[name] ?? []);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => {
        const path = issue.path.length ? `${issue.path.join(".")}: ` : "";
        return `  ${name}.${path}${issue.message}`;
      });
      throw new Error(`Dados inválidos em ## ${name}:\n${issues.join("\n")}`);
    }
    parsed[name] = result.data;
  }

  if (parsed.config.geo.nearby_radius_km >= parsed.config.geo.far_radius_km) {
    console.warn(
      "Aviso: geo.nearby_radius_km deve ser menor que far_radius_km.",
    );
  }
  if (
    !(
      parsed.config.ranking.same_city_weight >
        parsed.config.ranking.nearby_city_weight &&
      parsed.config.ranking.nearby_city_weight >
        parsed.config.ranking.far_city_weight
    )
  ) {
    console.warn(
      "Aviso: pesos de ranking esperados: same_city > nearby_city > far_city.",
    );
  }
  const allowedPlaceholders = new Set([
    "store_name",
    "mode",
    "items",
    "subtotal",
    "delivery_fee",
    "total",
    "payment",
    "customer",
    "address",
    "notes",
  ]);
  for (const [
    ,
    placeholder,
  ] of parsed.config.whatsapp.message_template.matchAll(
    /{{\s*([a-z_]+)\s*}}/g,
  )) {
    if (!allowedPlaceholders.has(placeholder))
      console.warn(
        `Aviso: placeholder desconhecido no template de WhatsApp: {{${placeholder}}}`,
      );
  }

  addDuplicateIssue(
    parsed.categories,
    "id",
    {
      addIssue: ({ path, message }) => {
        throw new Error(`categories.${path.join(".")}: ${message}`);
      },
    },
    "id de categoria duplicado",
  );
  addDuplicateIssue(
    parsed.categories,
    "order",
    {
      addIssue: ({ path, message }) => {
        throw new Error(`categories.${path.join(".")}: ${message}`);
      },
    },
    "order de categoria duplicado",
  );
  addDuplicateIssue(
    parsed.stores,
    "id",
    {
      addIssue: ({ path, message }) => {
        throw new Error(`stores.${path.join(".")}: ${message}`);
      },
    },
    "id de loja duplicado",
  );
  addDuplicateIssue(
    parsed.stores,
    "order",
    {
      addIssue: ({ path, message }) => {
        throw new Error(`stores.${path.join(".")}: ${message}`);
      },
    },
    "order de loja duplicado",
  );
  addDuplicateIssue(
    [...parsed.products, ...parsed.services, ...parsed.vehicles],
    "id",
    {
      addIssue: ({ path, message }) => {
        throw new Error(`itens.${path.join(".")}: ${message}`);
      },
    },
    "id de item duplicado",
  );
  addDuplicateIssue(
    parsed.promos,
    "id",
    {
      addIssue: ({ path, message }) => {
        throw new Error(`promos.${path.join(".")}: ${message}`);
      },
    },
    "id de promoção duplicado",
  );

  const categoriesById = new Set(parsed.categories.map(({ id }) => id));
  const storesById = new Map(parsed.stores.map((store) => [store.id, store]));
  const productsById = new Map(
    parsed.products.map((product) => [product.id, product]),
  );
  const listings = [
    ["products", parsed.products],
    ["services", parsed.services],
    ["vehicles", parsed.vehicles],
  ];
  const paymentMethods = new Set(parsed.config.payment_methods);
  const usedImagePaths = new Set();

  for (const store of parsed.stores) {
    if (new Set(store.category_ids).size !== store.category_ids.length) {
      throw new Error(
        `stores.${store.id}: category_ids não pode conter duplicatas`,
      );
    }
    for (const categoryId of store.category_ids) {
      if (!categoriesById.has(categoryId))
        throw new Error(
          `stores.${store.id}: categoria "${categoryId}" não existe`,
        );
    }
    for (const method of store.payment_methods) {
      if (!paymentMethods.has(method))
        throw new Error(
          `stores.${store.id}: pagamento "${method}" não está em config.payment_methods`,
        );
    }
    const storeListings = listings.flatMap(([, items]) =>
      items.filter((item) => item.store_id === store.id),
    );
    for (const [type, items] of listings) {
      addDuplicateIssue(
        items.filter((item) => item.store_id === store.id),
        "order",
        {
          addIssue: ({ message }) => {
            throw new Error(`${type} da loja ${store.id}: ${message}`);
          },
        },
        "ordem duplicada na loja",
      );
    }
    if (store.status === "active" && storeListings.length === 0) {
      console.warn(`Aviso: loja ativa "${store.id}" ainda não tem itens.`);
    }
    if (store.delivery.enabled && store.delivery.fee_cents === 0) {
      console.warn(
        `Aviso: entrega grátis configurada para "${store.id}"; confirme se é intencional.`,
      );
    }
    for (const [key, required] of [
      ["logo", true],
      ["cover", true],
      ["share_image", false],
      ["location_image", false],
    ]) {
      const imagePath = store[key];
      const absolutePath = validateImagePath(
        `stores.${store.id}.${key}`,
        imagePath,
        required,
      );
      if (absolutePath) {
        usedImagePaths.add(imagePath);
        if (statSync(absolutePath).size > 500 * 1024)
          console.warn(`Aviso: imagem acima de 500 KB: ${imagePath}`);
      }
    }
    for (const date of store.hours_exceptions.map(({ date }) => date)) {
      if (
        store.hours_exceptions.filter((item) => item.date === date).length > 1
      ) {
        throw new Error(
          `stores.${store.id}: exceção de horário duplicada em ${date}`,
        );
      }
    }
  }

  for (const [type, items] of listings) {
    const categoriesRequired = type !== "products";
    for (const item of items) {
      const store = storesById.get(item.store_id);
      if (!store || store.status !== "active") {
        throw new Error(
          `${type}.${item.id}: loja "${item.store_id}" não existe ou não está ativa`,
        );
      }
      if (
        categoriesRequired &&
        !categoriesById.has(item.category_id)
      ) {
        throw new Error(
          `${type}.${item.id}: categoria "${item.category_id}" não existe`,
        );
      }
      const absolutePath = validateImagePath(
        `${type}.${item.id}.image`,
        item.image,
      );
      if (absolutePath) {
        usedImagePaths.add(item.image);
        if (statSync(absolutePath).size > 500 * 1024)
          console.warn(`Aviso: imagem acima de 500 KB: ${item.image}`);
      }
    }
    if (items.length > 0 && items.every((item) => !item.available)) {
      console.warn(`Aviso: todos os itens de ${type} estão indisponíveis.`);
    }
  }

  for (const promo of parsed.promos) {
    if (!storesById.has(promo.store_id))
      throw new Error(
        `promos.${promo.id}: loja "${promo.store_id}" não existe`,
      );
    if (promo.product_id !== null) {
      const product = productsById.get(promo.product_id);
      if (!product || product.store_id !== promo.store_id) {
        throw new Error(
          `promos.${promo.id}: produto não existe ou pertence a outra loja`,
        );
      }
    }
    const absolutePath = validateImagePath(
      `promos.${promo.id}.image`,
      promo.image,
    );
    usedImagePaths.add(promo.image);
    if (statSync(absolutePath).size > 500 * 1024)
      console.warn(`Aviso: imagem acima de 500 KB: ${promo.image}`);
  }

  const repeatedImages = new Set();
  const allImagePaths = [
    ...parsed.stores.flatMap((store) =>
      [store.logo, store.cover, store.share_image, store.location_image].filter(Boolean),
    ),
    ...parsed.products.map(({ image }) => image).filter(Boolean),
    ...parsed.services.map(({ image }) => image).filter(Boolean),
    ...parsed.vehicles.map(({ image }) => image).filter(Boolean),
    ...parsed.promos.map(({ image }) => image),
  ];
  for (const imagePath of allImagePaths) {
    if (repeatedImages.has(imagePath))
      console.warn(
        `Aviso: imagem reutilizada em mais de um campo: ${imagePath}`,
      );
    repeatedImages.add(imagePath);
  }
  if (usedImagePaths.size === 0)
    console.info(
      "Catálogo ainda sem imagens; adicione os arquivos em public/images/ e informe os caminhos em data/db.md.",
    );

  return parsed;
}

try {
  const markdown = readFileSync(sourcePath, "utf8");
  const catalog = validateCatalog(parseSections(markdown));
  const temporaryPath = `${outputPath}.tmp`;
  writeFileSync(temporaryPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, outputPath);
  console.info(
    `Catálogo validado: ${catalog.stores.length} loja(s), ${catalog.products.length} produto(s), ${catalog.services.length} serviço(s), ${catalog.vehicles.length} veículo(s).`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
