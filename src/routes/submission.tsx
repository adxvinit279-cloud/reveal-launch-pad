import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/submission")({
  beforeLoad: () => { throw redirect({ to: "/submit-product" }); },
});