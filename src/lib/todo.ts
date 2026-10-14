/**
 * Placeholders for facts that don't exist yet: a metric nobody has measured, or
 * a detail only Abhay can supply.
 *
 * Hard rule (docs/PORTFOLIO_BRIEF.md): never invent the missing fact. Put a
 * Todo in the data instead. It renders as a visible dashed chip in
 * `npm run dev`, is left out of the production HTML, and is printed as a
 * warning by the prerender step. A placeholder can't ship and can't be
 * forgotten.
 */
export type Todo = { readonly todo: string }

export const todo = (text: string): Todo => ({ todo: text })

export const isTodo = (value: unknown): value is Todo =>
  typeof value === 'object' && value !== null && 'todo' in value && Object.keys(value).length === 1

/** Walks data exports and returns every Todo with its path, for build warnings. */
export function collectTodos(value: unknown, path = ''): { path: string; text: string }[] {
  if (isTodo(value)) return [{ path, text: value.todo }]
  if (Array.isArray(value)) return value.flatMap((item, i) => collectTodos(item, `${path}[${i}]`))
  if (typeof value === 'object' && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      collectTodos(item, path ? `${path}.${key}` : key),
    )
  }
  return []
}
