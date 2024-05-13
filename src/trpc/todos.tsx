import { publicProcedure, router } from "./base";
import { z } from "zod";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

const getRandomId = () => Math.random().toString(36).substring(7);

let TODO_LIST: Todo[] = [
  { id: getRandomId(), text: "Buy milk", completed: false },
  { id: getRandomId(), text: "Buy eggs", completed: false },
  { id: getRandomId(), text: "Buy bread", completed: false },
];

export const todoRouter = router({
  getTodos: publicProcedure.query(() => {
    return TODO_LIST;
  }),

  addTodo: publicProcedure.input(z.string()).mutation(({ input }) => {
    const newTodo = { id: getRandomId(), text: input, completed: false };
    TODO_LIST.push(newTodo);
    return newTodo;
  }),

  toggleTodo: publicProcedure.input(z.string()).mutation(({ input }) => {
    const todo = TODO_LIST.find((todo) => todo.id === input);
    if (!todo) {
      throw new Error("Todo not found");
    }
    todo.completed = !todo.completed;
    return todo;
  }),
});
