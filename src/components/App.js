import React, { useState, useEffect } from "react";
import "../styles/App.css";
import logo from "../icon.jpeg";
import cartSvg from "../shopping-cart-solid.svg";
import prodcutData from "../../data";
import Product from "./Product";
const App = () => {
  const [selectedSort, setSelectedSort] = useState(0);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [modalShirt, setModalShirt] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [data, setData] = useState(prodcutData.filter((e) => e.gender === "M"));
  const [serachStr, setSearchStr] = useState("");
  const [filtertList, setFilterList] = useState({ gender: "M" });
  const openProductModal = () => {
    if (modalShirt.name !== undefined) {
      let returnData = [];
      returnData.push(
        <div
          className="close-box"
          onClick={() => {
            setModalShirt({});
          }}
        >
          &times;
        </div>
      );
      let imageData = [];
      modalShirt.otherImages.forEach((element) => {
        imageData.push(
          <img className={"modal-image"} width={"200px"} src={element} />
        );
      });
      returnData.push(<div className="other-image-wrapper">{imageData}</div>);

      let sizeOption = [];
      modalShirt.productSize.split(" ").forEach((element) => {
        sizeOption.push(
          <div className={"size-option"}>{element.substr(0, 2)}</div>
        );
      });
      returnData.push(
        <div id="modal-meta-data">
          <h3>{modalShirt.name}</h3>
          <div>
            <i>{modalShirt.description}</i>
          </div>
          <div>
            {modalShirt.finalPrice ? "Rs. " + modalShirt.finalPrice : ""}
          </div>
          <div>
            <strike>
              {modalShirt.strickPrice ? "Rs. " + modalShirt.strickPrice : ""}
            </strike>
          </div>
          <div style={{ color: "red" }}>
            {modalShirt.discount ? modalShirt.discount + "%" : ""}
          </div>

          <div className="size-chart-holder">
            <div className="size-char-heading">Size Chart</div>
            <div className="size-chart-option-holder">{sizeOption}</div>
          </div>
        </div>
      );
      returnData.push(
        <button
          onClick={() => {
            setShoppingCart([...shoppingCart, modalShirt]);
          }}
        >
          Add to Cart
        </button>
      );
      return returnData;
    } else return;
  };

  const updateShirtList = (newfilterList) => {
    console.log(prodcutData);
    setFilterList(newfilterList);
    let preData = prodcutData;
    if (newfilterList["searchStr"] !== undefined) {
      preData = preData.filter((e) => {
        if (
          e.name.match(new RegExp(`.*${newfilterList["searchStr"]}.*`, "i")) ||
          e.description.match(
            new RegExp(`.*${newfilterList["searchStr"]}.*`, "i")
          )
        ) {
          return true;
        }
        return false;
      });
    }

    preData = preData.filter((e) => e.gender === newfilterList["gender"]);

    if (newfilterList["white"]) {
      preData = preData.filter((e) => e.cat === "W");
    }

    if (newfilterList["folded"]) {
      preData = preData.filter((e) => e.folded === "Y");
    }

    if (newfilterList["sort"] !== undefined) {
      let value = newfilterList["sort"];
      if (parseInt(value) == 1) {
        setSelectedSort(1);
      }
      if (parseInt(value) === 2) {
        console.log(preData);
        preData = preData.sort((a, b) => a.discount * -1 + b.discount);
        setSelectedSort(value);
      } else if (parseInt(value) === 3) {
        preData = preData.sort(
          (a, b) => parseInt(a.finalPrice) - parseInt(b.finalPrice)
        );
        setSelectedSort(value);
      }
    }

    setData(preData);
    console.log(newfilterList, parseInt(newfilterList["sort"]) === 2);
  };

  const openCartModal = () => {
    let a = [];
    let total = 0;
    let totalSave = 0;
    let totalItem = 0;
    let totalPrice = 0;
    shoppingCart.forEach((element) => {
      total += parseInt(element.finalPrice);
      totalPrice += parseInt(element.strickPrice);
      totalSave += parseInt(element.strickPrice) - parseInt(element.finalPrice);
      totalItem++;
      a.push(<Product data={element} />);
    });

    return (
      <div id="cart-modal-content">
        <div
          className="close-box"
          onClick={() => {
            setShowCart(false);
          }}
        >
          &times;
        </div>
        <div style={{ display: "flex" }}>
          <div id="cart-product-section"> {a}</div>
          <div id="cart-total-section">
            <table>
              <tbody>
                <tr>
                  <th>Total Items </th>
                  <td>{totalItem}</td>
                </tr>

                <tr>
                  <th>Total Original Price </th>
                  <td>{totalPrice}</td>
                </tr>

                <tr>
                  <th>Total Discount </th>
                  <td>{totalSave}</td>
                </tr>
                <tr>
                  <th>Final Price </th>
                  <td>{totalPrice}</td>
                </tr>
              </tbody>
            </table>
            <button>Buy</button>
          </div>
        </div>
      </div>
    );
  };

  const displayProductTiles = () => {
    let a = [];
    let i = 0;
    data.forEach((element) => {
      i++;
      a.push(
        <Product
          data={element}
          clickHandler={setModalShirt}
          key={element.name + i}
        />
      );
    });
    return a;
  };
  return (
    <div id="main">
      <div
        id="product-modal-wrapper"
        style={modalShirt.name ? {} : { display: "none" }}
      >
        <div
          id="product-modal"
          style={modalShirt.name ? {} : { display: "none" }}
        >
          {openProductModal()}
        </div>
      </div>
      <div id="cart-modal" style={showCart ? {} : { display: "none" }}>
        {openCartModal()}
      </div>
      <nav className="top-nav">
        <div className="nav-line">
          <div className="icon-holder">
            <img src={logo} width={"50px"}></img>
          </div>
          <div className="cat-link-holder">
            <ol>
              <li>MEN</li>
              <li>WOMEN</li>
              <li>KID</li>
            </ol>
          </div>
        </div>
        <div className="nav-line">
          <div className="search-bar-holder">
            <input
              placeholder={"Search your product here"}
              value={serachStr}
              onChange={(e) => setSearchStr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateShirtList({ ...filtertList, searchStr: serachStr });
                }
              }}
            ></input>
          </div>
          <div className="cart-holder" onClick={() => setShowCart(true)}>
            <img src={cartSvg} width={"40px"}></img>
            <div className={"cart-list-length"}>{shoppingCart.length}</div>
          </div>
        </div>
      </nav>
      <div id={"page-body"}>
        <div className={"filter-holder"}>
          <div className={"gender-list"}>
            Gender:-
            <li>
              <input
                type="radio"
                name="gender-grp"
                value="M"
                onClick={() => {
                  updateShirtList({ ...filtertList, gender: "M" });
                }}
                checked={filtertList["gender"] === "M"}
              ></input>
              MEN
            </li>
            <li>
              <input
                type="radio"
                name="gender-grp"
                value="F"
                onClick={() => {
                  updateShirtList({ ...filtertList, gender: "F" });
                }}
                checked={filtertList["gender"] === "F"}
              />
              WOMEN
            </li>
          </div>

          <br />
          <div className={"categories-holder"}>
            Categories:-
            <div className={"indiv-cat-holder"}>
              <div className={"indiv-cat-checkbox"}>
                <input
                  type={"checkbox"}
                  style={{ display: "inline" }}
                  onClick={() => {
                    updateShirtList({
                      ...filtertList,
                      white: filtertList.white ? false : true,
                    });
                  }}
                ></input>
                <div className={"indiv-cat-text"}>White</div>
              </div>
              <div className={"indiv-cat-checkbox"}>
                <input
                  type={"checkbox"}
                  style={{ display: "inline" }}
                  onClick={() => {
                    updateShirtList({
                      ...filtertList,
                      folded: filtertList.folded ? false : true,
                    });
                  }}
                ></input>
                <div className={"indiv-cat-text"}>Folded Sleeves</div>
              </div>
            </div>
          </div>
        </div>
        <div className={"content-holder"}>
          <div className={"sort-holder"}>
            Sort by:-
            <select
              value={selectedSort}
              onChange={(e) => {
                updateShirtList({ ...filtertList, sort: e.target.value });
              }}
            >
              <option value="1">What's New</option>
              <option value="2">Better Discount</option>
              <option value="3">Price low to high</option>
            </select>
          </div>
          <div className={"product-tile-holder"}>{displayProductTiles()}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
