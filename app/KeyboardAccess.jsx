"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardAccess() {
  const router = useRouter();
  useEffect(() => {
    function onKeyDown(event) {
      if (!(event.altKey && event.shiftKey) || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const routes = { H: "/", M: "/menu", C: "/cart", O: "/orders", A: "/admin" };
      const route = routes[event.key.toUpperCase()];
      if (!route) return;
      event.preventDefault();
      router.push(route);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);
  return null;
}
