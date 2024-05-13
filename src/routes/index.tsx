import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { trpc } from "~/internal/trpc";
import { Todo as TodoType } from "~/trpc/todos";

export const Route = createFileRoute("/")({
  component: IndexComponent,
  wrapInSuspense: true,
});

function IndexComponent() {
  const [todos] = trpc.todos.getTodos.useSuspenseQuery();

  return (
    <div>
      <h1>Todos</h1>
      <div className="mb-4 text-sm">
        All HTML is server rendered btw (no loading spinner necessary)
      </div>
      {todos.map((todo) => (
        <Todo key={todo.id} todo={todo} />
      ))}
      <AddTodo />
    </div>
  );
}

function AddTodo() {
  const utils = trpc.useUtils();
  const addTodoMutation = trpc.todos.addTodo.useMutation({
    onSettled() {
      utils.todos.getTodos.invalidate();
    },
  });
  const [text, setText] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodoMutation.mutate(text);
    setText("");
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        className="bg-gray-800"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="ml-3" type="submit">
        Add
      </button>
    </form>
  );
}

function Todo({ todo }: { todo: TodoType }) {
  const utils = trpc.useUtils();

  const toggleTodoMutation = trpc.todos.toggleTodo.useMutation({
    onSettled(data, error, variables, context) {
      trpc.useUtils().todos.getTodos.invalidate();
    },

    // Example of an optimistic update
    onMutate(vars) {
      utils.todos.getTodos.setData(undefined, (prev) => {
        return prev?.map((todo) => {
          if (todo.id === vars) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }
          return todo;
        });
      });
    },
  });

  return (
    <div>
      <input
        onChange={(_e) => toggleTodoMutation.mutate(todo.id)}
        className="mr-2"
        type="checkbox"
        defaultChecked={todo.completed}
      />
      <span>{todo.text}</span>
    </div>
  );
}
