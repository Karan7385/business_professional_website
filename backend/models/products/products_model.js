import pool from "../../config/db.js";

function get_product_model() {
  const query = `SELECT * FROM products`;
  return pool.execute(query);
}

function get_products_name_model() {
  const query = `SELECT id, name FROM products`;
  return pool.execute(query);
}

function get_categories_name_model() {
  const query = `
    SELECT 
      MIN(id) AS id,
      category
    FROM products
    GROUP BY category
    ORDER BY category ASC
  `;
  return pool.execute(query);
}

// id is passed separately for clarity
function edit_product_model(id, items = {}) {
  const query = `
    UPDATE products
    SET
      name = ?,
      category = ?,
      origin = ?,
      grade = ?,
      moisture = ?,
      description = ?,
      min_order_qty = ?,
      packaging = ?,
      images = ?,

      -- NEW FIELDS
      hs_code = ?,
      loading = ?,
      colour = ?,
      stems = ?,
      size = ?,
      port_of_loading = ?

    WHERE id = ?
  `;

  const params = [
    items.name,
    items.category,
    items.origin,
    items.grade,
    items.moisture,
    items.description,
    items.min_order_qty,
    items.packaging,
    items.images,

    // NEW FIELDS
    items.hs_code,
    items.loading,
    items.colour,
    items.stems,
    items.size,
    items.port_of_loading,

    id,
  ];

  return pool.execute(query, params);
}

function create_product_model(items = {}) {
  const query = `
    INSERT INTO products
    (
      name,
      category,
      origin,
      grade,
      moisture,
      description,
      min_order_qty,
      packaging,
      images,

      -- NEW FIELDS
      hs_code,
      loading,
      colour,
      stems,
      size,
      port_of_loading
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    items.name,
    items.category,
    items.origin,
    items.grade,
    items.moisture,
    items.description,
    items.min_order_qty,
    items.packaging,
    items.images,

    // NEW FIELDS
    items.hs_code,
    items.loading,
    items.colour,
    items.stems,
    items.size,
    items.port_of_loading,
  ];

  return pool.execute(query, params);
}

function delete_product_model(id) {
  const query = `DELETE FROM products WHERE id = ?`;
  return pool.execute(query, [id]);
}

export {
  get_product_model,
  edit_product_model,
  create_product_model,
  delete_product_model,
  get_products_name_model,
  get_categories_name_model
};