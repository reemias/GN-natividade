import { useState, type FormEvent } from "react"
import { MessageCircle } from "lucide-react"
import type { Service } from "../lib/catalog"
import { buildServiceRequestWhatsAppUrl } from "../lib/whatsapp"
import styles from "./ServiceRequestForm.module.css"

export default function ServiceRequestForm({
  storeName,
  storeWhatsapp,
  services,
}: {
  storeName: string
  storeWhatsapp: string
  services: Service[]
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deviceModel, setDeviceModel] = useState("")
  const [issueDescription, setIssueDescription] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")

  const selectedServices = services.filter((service) =>
    selectedIds.includes(service.id),
  )

  function toggleService(serviceId: string) {
    setSelectedIds((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    )
    setError("")
    setWhatsappUrl("")
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setWhatsappUrl("")

    if (selectedServices.length === 0) {
      setError("Selecione pelo menos um serviço para pedir o orçamento.")
      return
    }
    if (
      !deviceModel.trim() ||
      !issueDescription.trim() ||
      !customerName.trim() ||
      !address.trim()
    ) {
      setError("Preencha o modelo, defeito, nome e endereço.")
      return
    }

    try {
      const url = buildServiceRequestWhatsAppUrl({
        storeName,
        storeWhatsapp,
        services: selectedServices,
        deviceModel,
        issueDescription,
        customerName,
        address,
      })

      setWhatsappUrl(url)
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível preparar a mensagem do orçamento.",
      )
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <fieldset className={styles.services}>
        <legend>Quais reparos você precisa?</legend>
        <div className={styles.serviceGrid}>
          {services.map((service) => (
            <label className={styles.serviceChoice} key={service.id}>
              <input
                type="checkbox"
                checked={selectedIds.includes(service.id)}
                onChange={() => toggleService(service.id)}
              />
              <span>
                <strong>{service.name}</strong>
                <small>{service.description}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.fields}>
        <label>
          Modelo do celular
          <input
            autoComplete="off"
            maxLength={100}
            placeholder="Ex.: Samsung Galaxy A54"
            required
            value={deviceModel}
            onChange={(event) => setDeviceModel(event.target.value)}
          />
        </label>
        <label>
          Descreva o defeito ou o que aconteceu
          <textarea
            maxLength={1000}
            placeholder="Conte os detalhes que ajudam a avaliar o aparelho."
            required
            rows={4}
            value={issueDescription}
            onChange={(event) => setIssueDescription(event.target.value)}
          />
        </label>
        <label>
          Seu nome
          <input
            autoComplete="name"
            maxLength={100}
            required
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />
        </label>
        <label>
          Endereço
          <textarea
            autoComplete="street-address"
            maxLength={300}
            placeholder="Rua, número e bairro"
            required
            rows={2}
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </label>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <button className={styles.submit} type="submit">
        <MessageCircle size={18} aria-hidden="true" />
        Enviar pedido de orçamento pelo WhatsApp
      </button>

      {whatsappUrl && (
        <p className={styles.confirmation} role="status">
          Se o WhatsApp não abriu automaticamente,{" "}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            toque aqui para continuar.
          </a>
        </p>
      )}
    </form>
  )
}
