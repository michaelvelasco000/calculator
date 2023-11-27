import { useReducer } from "react";
import DigitButton from "./DigitButton.jsx";
import OperationButton from "./OperationButton.jsx";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentoperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentoperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentoperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentoperand: `${state.currentoperand || ""}${payload.digit}`,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentoperand: null,
        };
      }
      if (state.currentoperand == null) return state;
      if (state.currentoperand.length === 1) {
        return {
          ...state,
          currentoperand: null,
        };
      }
      return {
        ...state,
        currentoperand: state.currentoperand.slice(0, -1),
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentoperand == null && state.previousoperand == null) {
        return state;
      }

      if (state.currentoperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousoperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousoperand: state.currentoperand,
          currentoperand: null,
        };
      }
      return {
        ...state,
        previousoperand: evaluate(state),
        currentoperand: null,
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentoperand == null ||
        state.previousoperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousoperand: null,
        operation: null,
        currentoperand: evaluate(state),
      };
  }
}

function evaluate({ currentoperand, previousoperand, operation }) {
  const prev = parseFloat(previousoperand);
  const current = parseFloat(currentoperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;

    case "-":
      computation = prev - current;
      break;

    case "*":
      computation = prev * current;
      break;

    case "/":
      computation = prev / current;
      break;
  }
  return computation.toString();
}
const INTIGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(",");
  if (decimal == null) return INTIGER_FORMATTER.format(integer);
}

function App() {
  const [{ currentoperand, previousoperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <>
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousoperand)}
            {operation}
          </div>
          <div className="current-operand">{formatOperand(currentoperand)}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
