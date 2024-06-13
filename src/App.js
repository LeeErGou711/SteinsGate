import React, { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 设置搜索关键词的最大长度
  const MAX_SEARCH_LENGTH = 500; // 你可以根据需要调整这个值

  useEffect(() => {
    // 模拟 API 调用获取产品数据
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data); // 初始化过滤后的产品
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // 过滤产品列表
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      if (searchCategory === "all" || searchCategory === product.category) {
        return (
          product.name.toLowerCase().includes(lowercasedFilter) ||
          product.description.toLowerCase().includes(lowercasedFilter)
        );
      }
      return false;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, searchCategory, products]);

  const handleSearch = (event) => {
    const input = event.target.value;
    if (input.length <= MAX_SEARCH_LENGTH) {
      setSearchTerm(input);
    }
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>未来ガジェット研究所</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="搜索..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <select
            value={searchCategory}
            onChange={handleCategoryChange}
            className="search-select"
          >
            <option value="all">全部</option>
            <option value="folder">文件夹</option>
            <option value="file">文件</option>
          </select>
        </div>
      </header>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
          ))
        ) : (
          <p>暂无结果</p>
        )}
      </div>
    </div>
  );
};

export default App;
