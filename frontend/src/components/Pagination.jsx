export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav>
      <ul className="pagination pagination-sm justify-content-end mb-0">
        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
          <button className="page-link text-dark" onClick={() => onChange(page - 1)}>
            &laquo;
          </button>
        </li>
        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
            <button
              className={`page-link ${p === page ? "bg-dark border-dark text-white" : "text-dark"}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
          <button className="page-link text-dark" onClick={() => onChange(page + 1)}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}