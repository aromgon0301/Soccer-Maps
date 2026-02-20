export function logApiSuccess(route: string, action: string, context?: Record<string, unknown>) {
  console.info(`[API][SUCCESS] ${route} ${action}`, context || {})
}

export function logApiError(route: string, action: string, error: unknown, context?: Record<string, unknown>) {
  console.error(`[API][ERROR] ${route} ${action}`, {
    error,
    ...(context || {}),
  })
}
