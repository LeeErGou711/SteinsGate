import React, { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openedFolders, setOpenedFolders] = useState({});

  useEffect(() => {
    // 从 JSON 文件获取产品数据
    fetch("https://leeergou711.github.io/SteinsGate/files.json")
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
        return product.name.toLowerCase().includes(lowercasedFilter);
      }
      return false;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, searchCategory, products]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const handleToggleFolder = (folderName) => {
    setOpenedFolders((prevState) => ({
      ...prevState,
      [folderName]: !prevState[folderName],
    }));
  };

  const handleOpenFile = (fileName) => {
    const filePath = `https://github.com/LeeErGou711/SteinsGate/blob/main/src/files/${fileName}`;
    window.open(filePath, "_blank");
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
              {product.category === "folder" ? (
                <>
                  <div
                    className="folder-name"
                    onClick={() => handleToggleFolder(product.name)}
                  >
                    <h3>{product.name}</h3>
                  </div>
                  {openedFolders[product.name] && (
                    <div className="folder-contents">
                      {products
                        .filter((item) => item.parent === product.name)
                        .map((child) => (
                          <div key={child.id} className="product-card child-card">
                            {child.category === "folder" ? (
                              <div
                                className="folder-name"
                                onClick={() => handleToggleFolder(child.name)}
                              >
                                <h4>{child.name}</h4>
                              </div>
                            ) : (
                              <div
                                className="file-name"
                                onClick={() => handleOpenFile(child.name)}
                              >
                                <h4>{child.name}</h4>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="file-name"
                  onClick={() => handleOpenFile(product.name)}
                >
                  <h3>{product.name}</h3>
                </div>
              )}
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
