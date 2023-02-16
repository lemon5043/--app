import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Picture from "../components/Picture";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const Home = () => {
  let [input, setInput] = useState("");
  let [data, setData] = useState(null);
  let [page, setPage] = useState(1);
  let [currentSearch, setCurrentSearch] = useState("");
  //pexel api 需要的 key
  const auth = "";
  //網頁顯示的頁數及每次顯示幾筆圖片
  const Page = "1";
  const Per_page = "15";
  //網頁讀取後展示介面的 api
  const initialURL = `https://api.pexels.com/v1/curated?page=${Page}&per_page=${Per_page}`;
  //搜尋所需的 api
  let searchURL = `https://api.pexels.com/v1/search?query=${input}&per_page=${Per_page}&page=${Page}`;

  //get 資料
  const search = async (url) => {
    let result = await axios.get(url, {
      headers: { Authorization: auth },
    });
    setData(result.data.photos);
    setCurrentSearch(input);
  };

  useEffect(() => {
    search(initialURL);
  }, []);

  // 設定 button 按下後會再往下讀取 15 張相片
  const morePicture = async () => {
    let newURL;
    setPage(page + 1);
    if (currentSearch === "") {
      //因為 JS 會遵循 closure 規則，這裡的 page 我們需要先自己 +1
      newURL = `https://api.pexels.com/v1/curated?page=${
        page + 1
      }&per_page=${Per_page}`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=${Per_page}&page=${
        page + 1
      }`;
    }
    let result = await axios.get(newURL, {
      headers: { Authorization: auth },
    });
    setTimeout(() => {
      setData(data.concat(result.data.photos));
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        search={() => {
          search(searchURL);
        }}
        setInput={setInput}
      />
      {/* 使用 infinite scroll，網頁下拉會自動刷新 */}
      <InfiniteScroll
        dataLength={15}
        next={morePicture}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <div className="pictures">
          {data &&
            data.map((d) => {
              return <Picture data={d} />;
            })}
        </div>
      </InfiniteScroll>
      <div className="morePicture">
        <button onClick={morePicture}>更多圖片</button>
      </div>
    </div>
  );
};

export default Home;
