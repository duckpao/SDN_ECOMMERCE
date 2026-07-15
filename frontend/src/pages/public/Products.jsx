import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api";
import ProductFilterBar from "../../components/public/ProductFilterBar";
import ProductCard from "../../components/public/ProductCard";

export default function Products() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category") || "";
    if (categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [location.search, selectedCategory]);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, brandsRes, categoriesRes] = await Promise.all([
          api.get("/products?limit=60"),
          api.get("/brands?limit=100"),
          api.get("/categories?limit=100"),
        ]);

        if (!ignore) {
          setProducts(productsRes.data.data || []);
          setBrands(brandsRes.data.data || []);
          setCategories(categoriesRes.data.data || []);
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return [...products]
      .filter((product) => {
        const matchKeyword = !keyword || product.name.toLowerCase().includes(keyword);
        const matchBrand = !selectedBrand || product.brand?._id === selectedBrand;
        const matchCategory = !selectedCategory || product.category?._id === selectedCategory;
        return matchKeyword && matchBrand && matchCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return (a.discountPrice > 0 ? a.discountPrice : a.price) - (b.discountPrice > 0 ? b.discountPrice : b.price);
        }
        if (sortBy === "price-desc") {
          return (b.discountPrice > 0 ? b.discountPrice : b.price) - (a.discountPrice > 0 ? a.discountPrice : a.price);
        }
        if (sortBy === "name-asc") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [products, search, selectedBrand, selectedCategory, sortBy]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 className="fw-bold mb-1">Tất cả sản phẩm</h2>
          <p className="text-muted mb-0">Khám phá sản phẩm theo nhu cầu của bạn</p>
        </div>
        <div className="badge bg-dark rounded-pill px-3 py-2">
          {filteredProducts.length} sản phẩm
        </div>
      </div>

      <ProductFilterBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        brands={brands}
        categories={categories}
      />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-5 border rounded-4 bg-light">
          <h5 className="fw-semibold">Không có sản phẩm phù hợp</h5>
          <p className="text-muted">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}