import React from 'react';

function Header({ onOpenCart }) {
  return (
    <header className="site-header">
      <a className="brand-logo" href="/">
        <span className="brand-mark">S</span>
        <span>SDN <strong>Mart</strong></span>
      </a>

      <form className="header-search" onSubmit={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /></svg>
        <input type="search" placeholder="Bạn muốn tìm sản phẩm gì?" />
        <button type="submit">Tìm kiếm</button>
      </form>

      <div className="header-actions">
        <button className="icon-action cart-button" type="button" onClick={onOpenCart}>
          <svg viewBox="0 0 24 24"><path d="M3 3h2l2.2 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 7H6m4 12a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" /></svg>
          <span>Giỏ hàng</span>
          <b>0</b> {/* Sẽ lấy từ CartContext sau này */}
        </button>
      </div>
    </header>
  );
}

export default Header;