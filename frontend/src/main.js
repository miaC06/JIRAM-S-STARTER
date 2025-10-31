import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Import your API service file here
import "./services/api.js"; // <-- this triggers console.table(API_ROUTES)

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
