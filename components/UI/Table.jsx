

const Table = ({ headers, rows }) => {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => {
            return <th key={`${header}${i}`}>{header}</th>;
          })}
        </tr>
      </thead>

  {/* headers={["order",  "type", "date", "price", "quantity", "status"]} */}
      <tbody>
        {rows.map((row, i) => {
          return (
            <tr key={`${row}${i}`}>
              <td>{row.attributes.slug}</td>
              <td>{row.relationships.user.data.id}</td>
              <td>{row.relationships.product.data.id}</td>
              <td>{row.attributes.orderType}</td>
              <td>{row.attributes.orderDate}</td>
              <td>{row.attributes.orderCurrency}{row.orderPrice}</td>
              <td>{row.attributes.orderQuantity}</td>
              <td>{row.attributes.orderStatus}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table
