export type TenantItem = {
  slug: string
  displayName: string
  subtitle?: string
}

export const TENANTS: TenantItem[] = [
  { slug: 'uscgcc', displayName: 'USCGCC 美国粤商会 / 美中广东总商会', subtitle: 'Guangdong Chamber of Commerce (US)' },
  { slug: 'usclgcc', displayName: 'USCLGCC 美中物流总商会', subtitle: 'US-China Logistics Chamber' },
  { slug: 'ilausa', displayName: 'ILAUSA 美国国际物流协会', subtitle: 'International Logistics Association (US)' },
  { slug: 'uzlea', displayName: 'UZLEA 美国浙江物流电商协会', subtitle: 'Zhejiang Logistics & E-commerce (US)' },
  { slug: 'gbi', displayName: 'GBI 环球创新建材中心', subtitle: 'Global Building Innovation' },
]
