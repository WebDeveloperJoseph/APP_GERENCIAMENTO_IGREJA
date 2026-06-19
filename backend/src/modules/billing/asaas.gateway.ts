import { AppError } from "../../errors/AppError";

type CheckoutInput = {
  externalReference: string;
  planName: string;
  description?: string | null;
  priceCents: number;
  cycle: "MONTHLY" | "YEARLY";
  nextDueDate: string;
  customer?: { name?: string; email?: string; phone?: string; cpfCnpj?: string };
};

type CheckoutResponse = { id: string; link: string; status: string };

const TRANSPARENT_PIXEL =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export class AsaasGateway {
  private readonly apiKey = process.env.ASAAS_API_KEY?.trim();
  private readonly baseUrl =
    process.env.ASAAS_ENV === "production"
      ? "https://api.asaas.com/v3"
      : "https://api-sandbox.asaas.com/v3";

  async createRecurringCheckout(input: CheckoutInput): Promise<CheckoutResponse> {
    if (!this.apiKey) {
      throw new AppError("Integração Asaas ainda não configurada.", 503);
    }

    const webUrl = (process.env.ASAAS_CALLBACK_URL ?? process.env.APP_WEB_URL ?? "").replace(/\/$/, "");
    let callbackUrl: URL;
    try {
      callbackUrl = new URL(webUrl);
    } catch {
      throw new AppError("Configure ASAAS_CALLBACK_URL com a URL HTTPS pública do frontend.", 503);
    }
    if (callbackUrl.protocol !== "https:" || ["localhost", "127.0.0.1"].includes(callbackUrl.hostname)) {
      throw new AppError("O Asaas exige uma ASAAS_CALLBACK_URL pública usando HTTPS.", 503);
    }
    const response = await fetch(`${this.baseUrl}/checkouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: this.apiKey,
        "User-Agent": "IgrejaConnect/1.0",
      },
      body: JSON.stringify({
        billingTypes: ["CREDIT_CARD"],
        chargeTypes: ["RECURRENT"],
        minutesToExpire: 60,
        externalReference: input.externalReference,
        callback: {
          successUrl: `${webUrl}/admin/configuracoes?billing=success`,
          cancelUrl: `${webUrl}/admin/configuracoes?billing=cancel`,
          expiredUrl: `${webUrl}/admin/configuracoes?billing=expired`,
        },
        items: [{
          externalReference: input.externalReference,
          name: input.planName.slice(0, 30),
          description: input.description?.slice(0, 150),
          imageBase64: TRANSPARENT_PIXEL,
          quantity: 1,
          value: input.priceCents / 100,
        }],
        ...(input.customer?.cpfCnpj ? { customerData: input.customer } : {}),
        subscription: { cycle: input.cycle, nextDueDate: input.nextDueDate },
      }),
      signal: AbortSignal.timeout(15_000),
    });

    const data = (await response.json()) as CheckoutResponse & {
      errors?: Array<{ description?: string }>;
    };
    if (!response.ok || !data.link) {
      throw new AppError(data.errors?.[0]?.description ?? "Não foi possível criar o checkout no Asaas.", 502);
    }
    return { id: data.id, link: data.link, status: data.status };
  }
}
