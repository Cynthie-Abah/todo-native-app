
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";

import { useState } from 'react';


export const useUpdateTodo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutation = useMutation(api.todo.updateTodo).withOptimisticUpdate(
  (localStore, { _id, completed }) => {
    const todos = localStore.getQuery(api.todo.getTodo);
    if (!todos) return;

    const updated = todos.map((t) => (t._id === _id ? { ...t, completed } : t));
    localStore.setQuery(api.todo.getTodo, {}, updated);
  }
);

  const updateTodo = async ({ _id, completed }: { _id: Id<string>; completed: boolean }) => {
    try {
      setIsLoading(true);
      await mutation({ _id, completed });
    } finally {
      setIsLoading(false);
    }
  };

  return { updateTodo, isLoading };
};
