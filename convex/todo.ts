import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// create new todo - consumed!
export const createTodo = mutation({
  args: {
    id: v.string(),
    title: v.string(), 
    completed: v.boolean(), 
  },

  handler: async ({ db }, args) => {
    // create a new Todo
    const cart = await db.insert("todo", args);
    return { success: true, id: cart, message: "Todo created successfully" };
      }
});

// READ-one - DONE
export const getTodobyId = query({
  args: { _id: v.string() },
  handler: async ({db}, {_id}) => {
    const todo = await db
      .query("todo")
      .filter((q) => q.eq(q.field("_id"), _id)).first();
    return todo;
  },
});
// READ- consumed!
export const getTodo = query({
  handler: async ({ db }, { completed }: { completed?: boolean }) => {
    let q = db.query("todo");
    
    if (completed !== undefined) {
      q = q.filter((ref) => ref.eq(ref.field("completed"), completed));
    }

    const todos = await q.collect();
    return todos;
  },
});

// Update todo - consumed!
export const updateTodo = mutation(async ({db}, {_id, completed } : {_id: Id<string>, completed: boolean,}) => {
  const existing = await db.get(_id)

  if (!existing) {
      throw new Error("Todo not found for this user");
    }

  await db.patch(existing._id,  { ...existing, completed } );

    return {
      success: true,
      message: "Todo updated successfully",
    };
});

// deleteTodo - consumed!
export const deleteTodo = mutation(async ({db}, { _id, isCompleted }: {_id?: Id<string>, isCompleted?: boolean }) => {
  // delete one todo
    if (_id) {
      const cart = await db.get(_id)
      if(cart) {
      await db.delete(cart._id);
  }
}
// delete all completed 
    if (isCompleted) {
        const carts = await db
    .query("todo")
    .filter((q) => q.eq(q.field("completed"), isCompleted))
    .collect();

  for (const cart of carts) {
    await db.delete(cart._id); 
    }
}});
