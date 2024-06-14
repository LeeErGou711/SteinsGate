import React, { useState, useEffect } from "react";
import "./styles.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openedFolders, setOpenedFolders] = useState({});

  useEffect(() => {
    fetch("https://leeergou711.github.io/SteinsGate/files.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        const initialOpenedFolders = data
          .filter(product => product.category === "folder")
          .reduce((acc, product) => {
            acc[product.path] = false;
            return acc;
          }, {});
        setOpenedFolders(initialOpenedFolders);
        setFilteredProducts(data.filter(product => product.category === "folder" && !product.parent));
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = products.filter((product) => {
      if (product.category === "folder" && !product.parent) {
        return product.name.toLowerCase().includes(lowercasedFilter);
      }
      return false;
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleFolder = (folderPath) => {
    setOpenedFolders((prevState) => ({
      ...prevState,
      [folderPath]: !prevState[folderPath],
    }));
  };

  const handleOpenFile = (filePath, fileName) => {
    const extension = filePath.split('.').pop();
    if (extension === 'mp3') {
      const playerUrl = `/player.html?file=${encodeURIComponent(filePath)}&name=${encodeURIComponent(fileName)}`;
      window.open(playerUrl, "_blank");
    } else {
      let fullPath = `https://github.com/LeeErGou711/SteinsGate/raw/main/src/files/${filePath}`;
      if (extension === 'epub') {
        fullPath = `https://raw.githubusercontent.com/LeeErGou711/SteinsGate/main/src/files/${filePath}`;
      }
      window.open(fullPath, "_blank");
    }
  };

  const renderFolderContents = (parentPath) => {
    return products
      .filter((item) => item.parent === parentPath)
      .map((child) => (
        <div key={child.id} className="product-card child-card">
          {child.category === "folder" ? (
            <div>
              <div
                className="folder-name"
                onClick={() => handleToggleFolder(child.path)}
              >
                <h4>{child.name}</h4>
              </div>
              {openedFolders[child.path] && (
                <div className="folder-contents">
                  {renderFolderContents(child.path)}
                </div>
              )}
            </div>
          ) : (
            <div
              className="file-name"
              onClick={() => handleOpenFile(child.path, child.name)}
            >
              <h4>{child.name}</h4>
            </div>
          )}
        </div>
      ));
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
                onClick={() => handleToggleFolder(product.path)}
              >
                <h3>{product.name}</h3>
              </div>
              {openedFolders[product.path] && (
                <div className="folder-contents">
                  {renderFolderContents(product.path)}
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
