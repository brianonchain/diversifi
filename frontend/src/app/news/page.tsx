"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { increment, decrement } from "@/state/counterSlice";

export default function page() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="flex-1 w-full flex justify-center">
      <div className="sectionSize w-full flex flex-col items-center justify-center space-y-8">
        <div>{count}</div>
        <button className="p-4 border" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button className="p-4 border" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}
