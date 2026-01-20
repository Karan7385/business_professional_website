import pool from "../../config/db.js";

function get_certificates_model() {
  const query = `SELECT * FROM certificates`;
  return pool.execute(query); // [rows, fields]
}


function get_certificate_by_id_model(id) {
  const query = `SELECT * FROM certificates WHERE id = ?`;
  return pool.execute(query, [id]);
}


function create_certificate_model(items = {}) {
  const { title, issuer, year, src, category, color, logo } = items;

  const query = `
    INSERT INTO certificates (title, issuer, year, src, category, color, logo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return pool.execute(query, [title, issuer, year, src, category, color, logo]);
}


function update_certificate_model(items = {}) {
  const { id, title, issuer, year, src, category, color, logo } = items;

  const query = `
    UPDATE certificates
    SET title = ?, issuer = ?, year = ?, src = ?, category = ?, color = ?, logo = ?
    WHERE id = ?
  `;

  return pool.execute(query, [title, issuer, year, src, category, color, logo, id]);
}


function delete_certificate_model(id) {
  const query = `DELETE FROM certificates WHERE id = ?`;
  return pool.execute(query, [id]);
}

export {
  get_certificates_model,
  get_certificate_by_id_model,
  create_certificate_model,
  update_certificate_model,
  delete_certificate_model,
};