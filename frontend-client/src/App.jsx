/* eslint-disable no-unused-vars */
import React from 'react';
import Header from './components/Layout/Header';
import Catalog from './components/Catalog/Catalog';

function App() {
  return (
    <>
      <div className="announcement">
        Miễn phí giao hàng cho đơn từ 300.000đ <span>•</span> Đổi trả dễ dàng trong 7 ngày
      </div>

      <Header />

      <main>
        {/* Sau này bạn có thể tạo component Hero và Benefits thêm vào đây */}
        <Catalog />
      </main>
    </>
  );
}

export default App;