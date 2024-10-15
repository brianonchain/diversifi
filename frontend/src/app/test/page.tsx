"use client";
import { useState, useEffect } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { increment, decrement } from "@/state/counterSlice";
// zustand
import { useCounterStore } from "@/store";
// react query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function Test() {
  console.log("test rendered once");

  // useState
  const [title, setTitle] = useState("");
  // redux
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  // zustand
  const counterZustand = useCounterStore((state) => state.count);
  const incrementZustand = useCounterStore((state) => state.increment);
  const decrementZustand = useCounterStore((state) => state.decrement);

  // react query
  const queryClient = useQueryClient();

  // react query - get todos
  const todosQuery = useQuery({
    queryFn: () =>
      fetch("/api/getTodos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user: "brianonchain" }),
      }).then((res) => res.json()),
    queryKey: ["todos"],
  });
  console.log("todosQuery.data", todosQuery.data);

  // react query - add todo
  const addTodoMutation = useMutation({
    mutationFn: (title: string) =>
      fetch("/api/addTodo", {
        method: "POST",
        body: JSON.stringify({ title: title }),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  // /react query - delete todo
  const deleteTodoMutation = useMutation({
    mutationFn: (titleToDelete: string) =>
      fetch("/api/deleteTodo", {
        method: "POST",
        body: JSON.stringify({ titleToDelete: titleToDelete }),
        headers: { "content-type": "application/json" },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  return (
    <div className="flex-1 w-full flex justify-center">
      <div className="sectionSize flex flex-col items-center justify-center">
        <div className="grid grid-cols-[repeat(3,auto)_40px] items-center w-full max-w-[400px] gap-y-8">
          {/*--- redux ---*/}
          <div>Redux:</div>
          <div>
            <button className="px-3 py-2 border rounded-lg active:bg-blue2 hover:bg-blue2" onClick={() => dispatch(increment())}>
              increment
            </button>
          </div>
          <div>
            <button className="px-3 py-2 border rounded-lg active:bg-blue2 hover:bg-blue2" onClick={() => dispatch(decrement())}>
              decrement
            </button>
          </div>
          <div className="justify-self-end">{count}</div>
          {/*--- zustand ---*/}
          <div>Zustand:</div>
          <div>
            <button className="px-3 py-2 border rounded-lg active:bg-blue2 hover:bg-blue2" onClick={incrementZustand}>
              increment
            </button>
          </div>
          <div>
            <button className="px-3 py-2 border rounded-lg active:bg-blue2 hover:bg-blue2" onClick={decrementZustand}>
              decrement
            </button>
          </div>
          <div className="justify-self-end">{counterZustand}</div>
        </div>
        {/*--- to do list ---*/}
        <div className="w-full max-w-[400px] mt-12 grid grid-cols-[auto,auto] gap-4">
          <input className="grow px-3 py-2 rounded-lg outline-blue2 bg-slate-200 text-black" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
          <button
            className="shrink-0 px-3 py-2 border rounded-lg active:bg-blue2 hover:bg-blue2 whitespace-nowrap"
            onClick={async () => {
              if (title) {
                try {
                  setTitle("");
                  await addTodoMutation.mutateAsync(title);
                } catch (e) {
                  console.log(e);
                }
              }
            }}
          >
            Add To Do
          </button>
          <div className="col-span-2 h-[250px]">
            {todosQuery.isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {todosQuery.data.map((i: string, index: number) => (
                  <div key={index} className="p-1 w-full flex justify-between items-center hover:bg-blue2 cursor-pointer">
                    <div>{i}</div>
                    <div
                      className="text-blue-500 hover:underline underline-offset-4 cursor-pointer"
                      onClick={async () => {
                        try {
                          await deleteTodoMutation.mutateAsync(i);
                        } catch (e) {
                          console.log(e);
                        }
                      }}
                    >
                      remove
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
