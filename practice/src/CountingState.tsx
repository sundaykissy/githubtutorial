import React, { useState, useEffect } from "react";

function CountingState() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Counter:{count}</h1>
      <p>
        <button
          onClick={() => {
            return setCount(count + 1);
          }}
        >
          Increment Counter
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            return setCount(count - 1);
          }}
        >
          Decrement Counter
        </button>
      </p>
    </>
  );
}

export default CountingState;
