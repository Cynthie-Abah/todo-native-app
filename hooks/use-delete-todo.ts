// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { useMutation } from "convex/react";

// import { useState } from 'react';


// export const useDeleteTodo = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const mutation = useMutation(api.todo.deleteTodo).withOptimisticUpdate(
//   (localStore, { _id, isCompleted }) => {
//     if (_id) {
//         const todos = localStore.getQuery(api.todo.getTodo);
//         if (!todos) return;
//         const updated = todos.filter((t) => (t._id !== _id));
//         localStore.setQuery(api.todo.getTodo, {}, updated);
//     }

//     if (isCompleted) {
//         const todos = localStore.getQuery(api.todo.getTodo);
//         if (!todos) return;
//         const updated = todos.filter((t) => (t.completed !== isCompleted));
//         localStore.setQuery(api.todo.getTodo, {}, updated);
//     }


//   }
// );

//   const deleteTodo = async ({ _id, isCompleted }: { _id?: Id<string>; isCompleted?: boolean }) => {
//     try {
//       setIsLoading(true);
//       await mutation({ _id, isCompleted });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { deleteTodo, isLoading };
// };


import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";

type DeleteTodoArgs = { _id?: Id<string> };

export const useDeleteTodo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const todos = useQuery(api.todo.getTodo) ?? [];

  const mutation = useMutation(api.todo.deleteTodo).withOptimisticUpdate(
    (localStore, { _id }: DeleteTodoArgs) => {
      if (!_id) return;
      const todos = localStore.getQuery(api.todo.getTodo);
      if (!todos) return;
      const updated = todos.filter((t) => t._id !== _id);
      localStore.setQuery(api.todo.getTodo, {}, updated);
    }
  );

  const deleteOneTodo = async ({ _id }: DeleteTodoArgs) => {
    if (!_id) return;
    try {
      setIsLoading(true);
      await mutation({ _id });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompletedTodos = async () => {
    try {
      setIsLoading(true);
      const completedIds = todos
      .filter((t) => t.completed)
      .map((t) => t._id) ?? '';

      for (const id of completedIds) {
        await mutation({ _id: id });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteOneTodo, deleteCompletedTodos, isLoading };
};
