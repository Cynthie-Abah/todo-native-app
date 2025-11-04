import { api } from "@/convex/_generated/api";
import { todo } from "@/type";
import { useMutation } from "convex/react";
import { useState } from 'react';

export const useCreateTodo = ()=> {
    const [isloading ,setIsLoading] = useState(false);
    const mutate = useMutation(api.todo.createTodo)

    const handleCreateTodo = async (todo: todo) => {
        setIsLoading(true)
  try {

    const data = await mutate(todo)
    console.log(data);
    setIsLoading(false)
  } catch (error) {
    setIsLoading(false)
    console.error("Error adding to cart:", error);
  }
};

return {handleCreateTodo, isloading}
}
