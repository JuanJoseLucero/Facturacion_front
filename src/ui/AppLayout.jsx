import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";

export default function AppLayout() {
  return (
    <div>
      <main>
        <h1>FACTURACION ELECTRONICA</h1>
        <br />
        <Header />
        <br />
        <Outlet />
      </main>
    </div>
  );
}
