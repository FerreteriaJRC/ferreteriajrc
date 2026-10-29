const API_URL =
  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000/api`

export interface MessagingUser {
  id: number
  name: string
}

export interface MessagingRequestInput {
  branch: string
  date: string
  client: string
  sellerUserId: number
  diligenceUserId: number
  neighborhood: string
  observations: string
}

export interface TransferUser {
  id: number
  name: string
}

export interface TransferProductInput {
  productCode: string
  description: string
  reference: string
  brand: string
  quantity: number
}

export interface TransferRequestInput {
  originBranch: string
  destinationBranch: string
  sellerUserId: number
  clients: string[]
  products: TransferProductInput[]
  observations: string
}

export interface Seller {
  id: number
  name: string
}

export interface SellerMonthMetrics {
  month: number
  facturas: number
  remisiones: number
  cotizaciones: number
  facturaRemision: number
  facturaRecibo: number
  totalRecaudo: number
}

export interface SellerMetricsResponse {
  year: number
  sellerId: number | null
  sellers: Seller[]
  months: SellerMonthMetrics[]
}

export class ApiClient {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem("token")
  }

  setToken(token: string): void {
    this.token = token
    localStorage.setItem("token", token)
  }

  getToken(): string | null {
    return this.token
  }

  clearToken(): void {
    this.token = null
    localStorage.removeItem("token")
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null) as { error?: string } | null
      throw new Error(error?.error || "Error en la solicitud")
    }

    return response.json()
  }

  // Auth endpoints
  async register(
    email: string,
    password: string,
    name: string,
    phone?: string,
    company?: string
  ): Promise<{
    message: string
    token: string
    user: { id: number; email: string; name: string; role: string }
  }> {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, phone, company }),
    })
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    message: string
    token: string
    user: {
      id: number
      email: string
      name: string
      role: string
      company?: string
      permissions: string[]
    }
  }> {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    })
  }

  async getProfile(): Promise<{
    user: {
      id: number
      email: string
      name: string
      role: string
      company?: string
      phone?: string
      permissions: string[]
    }
  }> {
    return this.request("/auth/me")
  }

  async updateProfile(
    name: string,
    phone?: string,
    company?: string
  ): Promise<{
    message: string
    user: {
      id: number
      email: string
      name: string
      role: string
      company?: string
      phone?: string
    }
  }> {
    return this.request("/auth/me", {
      method: "PUT",
      body: JSON.stringify({ name, phone, company }),
    })
  }

  async getMessagingUsers(): Promise<{ users: MessagingUser[] }> {
    return this.request("/messaging/users")
  }

  async createMessagingRequest(
    request: MessagingRequestInput
  ): Promise<{ message: string }> {
    return this.request("/messaging/requests", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getTransferUsers(): Promise<{ users: TransferUser[] }> {
    return this.request("/transfers/users")
  }

  async createTransferRequest(
    request: TransferRequestInput
  ): Promise<{ message: string }> {
    return this.request("/transfers/requests", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getSellerMetrics(
    year: number,
    sellerId?: string
  ): Promise<SellerMetricsResponse> {
    const params = new URLSearchParams({ year: String(year) })
    if (sellerId) params.set("sellerId", sellerId)
    return this.request(`/sellers/metrics?${params.toString()}`)
  }
}

export const apiClient = new ApiClient()
