"use client";

import { useState } from "react";
import Link from "next/link";
import CartLink from "./cart/CartLink";
import { signOut } from "./actions";

export default function MainNavigation({ user }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="navigation-area">
      <button className="menu-toggle" type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen((value) => !value)}>
        <span></span><span></span><span></span>
      </button>
      <nav id="main-navigation" className={open ? "main-navigation is-open" : "main-navigation"} aria-label="Main navigation">
        {user?.role === "admin" ? <>
          <Link onClick={close} href="/admin">Admin dashboard</Link><Link onClick={close} href="/orders?sort=date&dir=desc&page=1">Orders</Link><Link onClick={close} href="/dashboard">Reports</Link><Link onClick={close} href="/kitchen">Kitchen</Link><span className="nav-user">{user.name}</span><form action={signOut} className="nav-signout"><button className="nav-button" type="submit">Sign out</button></form>
        </> : <>
          <Link onClick={close} href="/menu">Menu</Link>
          {user?.role === "staff" ? <><Link onClick={close} href="/kitchen">Kitchen</Link><Link onClick={close} href="/dashboard">Reports</Link><Link onClick={close} href="/orders?sort=date&dir=desc&page=1">Orders</Link></> : null}
          {user?.role !== "staff" ? <><Link onClick={close} href="/orders">My orders</Link><Link onClick={close} href="/favorites">Favorites</Link><Link onClick={close} href="/track">Track delivery</Link><CartLink /><Link onClick={close} className="nav-button" href="/checkout">Checkout</Link></> : null}
          {user ? <><span className="nav-user">{user.name}</span><form action={signOut} className="nav-signout"><button className="nav-button" type="submit">Sign out</button></form></> : <Link onClick={close} className="nav-button" href="/signin">Sign in</Link>}
        </>}
      </nav>
    </div>
  );
}
