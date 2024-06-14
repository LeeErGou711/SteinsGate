import React, { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("folder");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openedFolders, setOpenedFolders] = useState({});

  useEffect(() => {
    // 从 JSON 文件获取产品数据
    fetch("https://leeergou711.github.io/SteinsGate/files.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const topFolders = data.filter(product => product.category === "folder" && product.parent === "files");
        setFilteredProducts(topFolders); // 只初始化files目录下的文件夹
        // 将files目录下的文件夹设置为展开状态
        const initialOpenedFolders = {};
        topFolders.forEach(folder => {
          initialOpenedFolders[folder.name] = true;
        });
        setOpenedFolders(initialOpenedFolders);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // 过滤产品列表，只显示files目录下的文件夹
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      if (product.category === "folder" && product.parent === "files") {
        return product.name.toLowerCase().includes(lowercasedFilter);
      }
      return false;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleFolder = (folderName) => {
    setOpenedFolders((prevState) => ({
      ...prevState,
      [folderName]: !prevState[folderName],
    }));
  };

  const handleOpenFile = (filePath) => {
    const fullPath = `https://github.com/LeeErGou711/SteinsGate/raw/main/src/files/${filePath}`;
    window.open(fullPath, "_blank");
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
        </div>
      </header>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
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
                            onClick={() => handleOpenFile(child.path)}
                          >
                            <h4>{child.name}</h4>
                          </div>
                        )}
                      </div>
                    ))}
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
