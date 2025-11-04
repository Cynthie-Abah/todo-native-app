import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function useTodo(filter?: string) {
  // Determine completed value based on filter
  let completed: boolean | undefined;
  if (filter === "Active") completed = false;
  if (filter === "Completed") completed = true;

  //  Convex query
  const todos = useQuery(api.todo.getTodo, completed !== undefined ? { completed } : {});

  const isLoading = todos === undefined;
  const error = todos === null ? "Failed to fetch todo" : null;

  return { todos, isLoading, error };
}
