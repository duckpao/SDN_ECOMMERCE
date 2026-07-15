/* eslint-disable no-unused-vars */
import React from 'react';

function Header() {
  return (
    <header className="site-header">
      <a className="brand-logo" href="/">
        <span className="brand-mark">S</span>
        <span>SDN <strong>Mart</strong></span>
      </a>

      <form className="header-search" onSubmit={(e) => e.preventDefault()}>
        <input type="search" placeholder="Bạn muốn tìm sản phẩm gì?" />
        <button type="submit">Tìm kiếm</button>
      </form>

      <div className="header-actions">
        <button className="icon-action cart-button" type="button">
          <span>Giỏ hàng</span>
          <b>0</b>
        </button>
      </div>
    </header>
  );
}

export default Header;