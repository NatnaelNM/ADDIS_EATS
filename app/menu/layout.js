export default function MenuLayout({ children }) {
  return <div className="menu-layout container"><aside className="category-sidebar"><span className="eyebrow">MENU</span><h2>Explore</h2><ul><li><a href="/menu">All dishes</a></li><li><a href="/menu/kitfo">Kitfo</a></li><li><a href="/menu/shiro">Shiro</a></li><li><a href="/menu/doro">Doro Wot</a></li></ul></aside>{children}</div>;
}
