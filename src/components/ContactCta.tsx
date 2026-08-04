import { Mail, MessageCircle } from "lucide-react"

export default function ContactCta() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden bg-background text-foreground"
    >
      <div className="absolute inset-0">
        <img
          src="/warehouse.png"
          alt="Fondo oscuro de almacén industrial"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-28">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            ¿Necesitas asesoría técnica?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Nuestro equipo comercial y técnico está listo para ayudarte a encontrar la herramienta correcta para tu operación.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/5710000000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              <MessageCircle className="h-4 w-4" />
              Escríbenos por WhatsApp
            </a>
            <a
              href="mailto:ventas@ferreteriajrc.com"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background/70 px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              ventas@ferreteriajrc.com
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
