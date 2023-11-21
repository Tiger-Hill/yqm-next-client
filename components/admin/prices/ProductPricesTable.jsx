"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAllProductPrices } from "@/lib/redux/slices/adminSlice";

import ProductListItem from "./ProductListItem";
import PricesTable from "./PricesTable";
import InputMui from "@/components/forms/InputMui";
import EditIcon from "@mui/icons-material/Edit";

import classes from "./ProductPricesTable.module.scss";

const ProductPricesTable = ({ lng }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, pricesTableData } = useSelector(state => state.rootReducer.admin);

  // * To handle the serach input and render table for selected product
  const [searchResults, setSearchResults] = useState([]);
  const filterResultsHandler = (e) => {
    if (e.target.value === "") return setSearchResults([]); // Guard clause

    const searchStr = e.target.value;
    const filteredResults = products.filter(product => product.productName.toLowerCase().includes(searchStr.toLowerCase()));
    setSearchResults(filteredResults);
    console.log("filteredResults", filteredResults);
  }

  const setPriceTableHandler = (productSlug) => {
    dispatch(getAllProductPrices(productSlug));
    setSearchResults([]);
  }

  // * To render action for a specific price
  const [selectedPrice, setSelectedPrice] = useState(null);

  const selectPriceHandler = price => {
    console.log(price.slug);
    setSelectedPrice(price);
  };

  console.log("selectedPrice", selectedPrice);

  // * Redirect to the price edit form
  const redirectToPriceEditFormHandler = (selectedPriceSlug) => {
    router.push(`/${lng}/admin_dashboard/prices/${selectedPriceSlug}`);
  };

  return (
    <div className={classes["prices-summup-container"]}>
      {products && (
        <>
          <div className={classes["search-input"]}>
            <InputMui
              required
              id="outlined-required search-product"
              name="search-product"
              type="text"
              label="Search for a product to manage its prices"
              // helperText={searchResults.length === 0 ? "No product found" : ""}
              onChangeHandler={e => filterResultsHandler(e)}
              onBlurHandler={() => {}}
            />
          </div>

          <div className={classes["search-results-list"]}>
            <ul>
              {searchResults.map(product => (
                <ProductListItem key={product.slug} product={product} setPriceTable={setPriceTableHandler} />
              ))}
            </ul>
          </div>

          {pricesTableData &&
            <>
              <div className={classes["prices-table-container"]}>
                <PricesTable pricesTableData={pricesTableData} selectPrice={selectPriceHandler} />
              </div>

              {selectedPrice &&
                <div className={classes["price-details-actions-container"]}>
                  <div className={classes["price-details"]}>
                    <p>Price ref: {selectedPrice.slug}</p>
                    <p>Base price:  {selectedPrice.currency} {Number(selectedPrice.basePrice).toFixed(2)}</p>
                    <p>Published: {selectedPrice.published ? "Yes" : "No"}</p>
                    <p>Pricing date: {selectedPrice.pricingDate}</p>
                    <p>Creation date: {selectedPrice.createdAt}</p>
                  </div>

                  <div className={classes["price-actions-container"]}>
                    <EditIcon
                      className={classes["edit-icon"]}
                      onClick={() => redirectToPriceEditFormHandler(selectedPrice.slug)}
                    />
                  </div>
                </div>
              }
            </>
          }
        </>
      )}
    </div>
  );
}

export default ProductPricesTable
