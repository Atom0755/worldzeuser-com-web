import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import TenantHome from './pages/TenantHome'
import Admin from './pages/Admin'
import { getTenantFromHost, getTenantFromQuery } from './lib/tenant'

const APEX = 'worldzeuser.com'

export default function App() {
  const loc = useLocation()

  // Auto-detect tenant by subdomain; fallback to ?tenant= for local dev/testing.
  const hostTenant = getTenantFromHost(window.location.hostname, APEX)
  const queryTenant = getTenantFromQuery(window.location.search)
  const tenant = hostTenant ?? queryTenant

  // If visiting a tenant subdomain, we route to TenantHome by default.
  if (tenant && loc.pathname === '/') {
    return <TenantHome tenant={tenant} />
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* Local friendly route for testing tenant without DNS: /t/uscgcc */}
      <Route path="/t/:tenant" element={<TenantHome />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
