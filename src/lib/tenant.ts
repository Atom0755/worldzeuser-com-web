export type TenantSlug = string

const RESERVED = new Set(['www', 'app', 'api'])

// Extract tenant from hostname: <tenant>.<apex>
export function getTenantFromHost(hostname: string, apex: string): TenantSlug | null {
  const host = hostname.toLowerCase()

  if (host === apex || host === `www.${apex}`) return null
  if (!host.endsWith(`.${apex}`)) return null

  const sub = host.slice(0, -(apex.length + 1)) // remove ".apex"
  const first = sub.split('.')[0]
  if (!first || RESERVED.has(first)) return null
  return first
}

// Local dev helper: ?tenant=uscgcc
export function getTenantFromQuery(search: string): TenantSlug | null {
  const params = new URLSearchParams(search)
  const t = params.get('tenant')?.trim()
  return t ? t.toLowerCase() : null
}
