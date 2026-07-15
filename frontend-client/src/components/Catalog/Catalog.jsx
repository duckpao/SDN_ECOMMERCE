import React from 'react';

function Catalog() {
  return (
    <section className="catalog" id="products">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Sản phẩm dành cho bạn</span>
          <h2>Mua sắm dễ dàng</h2>
        </div>
      </div>

      <div className="catalog-layout">
        <div className="products-area">
          <p>Danh sách sản phẩm sẽ được render tại đây bằng React...</p>
        </div>
      </div>
    </section>
  );
}

export default Catalog;