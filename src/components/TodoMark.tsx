import type { Todo } from '../lib/todo'

/** Visible in dev, absent from production HTML. See src/lib/todo.ts. */
export function TodoMark({ item }: { item: Todo }) {
  if (!import.meta.env.DEV) return null
  return <span className="u-todo">TODO: {item.todo}</span>
}
