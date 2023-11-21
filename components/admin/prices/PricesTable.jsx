import { motion } from "framer-motion";
import classes from "./PricesTable.module.scss";

const PricesTable = ({ pricesTableData, selectPrice }) => {
  return (
    <motion.table
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.33 }}
      className={classes["prices-table"]}
    >
      <thead>
        <tr>
          <motion.th
            key="SMB"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.33, delay: 0.1 }}
          >
            {pricesTableData.product.productName}
          </motion.th>
          {pricesTableData.prices.map((price, index) => (
            <motion.th
              key={price.slug}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.33, delay: (index * 0.1) + 0.1 }}
            >
              {price.pricingDate}
            </motion.th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          {pricesTableData.prices.map((price, index) => (
            <motion.td
              key={price.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.33, delay: index * 0.1 }}
              onClick={() => selectPrice(price)}
              className={price.published ? classes["published"] : classes["unpublished"]}
            >
              {Number(price.basePrice).toFixed(2)}
            </motion.td>
          ))}
        </tr>
      </tbody>
    </motion.table>
  );
}

export default PricesTable
