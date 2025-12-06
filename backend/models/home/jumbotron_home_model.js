import pool from "../../config/db.js";

async function edit_home_jumbotron_model(
  backgroundAlt,
  body,
  intro,
  title,
  backgroundImagePath
) {
  const query = `
    UPDATE home_jumbotron
    SET background_alt = ?, body = ?, intro = ?, title = ?, background_image = ?
    WHERE id = 1
  `;
  const values = [backgroundAlt, body, intro, title, backgroundImagePath];

  return pool.execute(query, values);
}

async function get_home_jumbotron_model() {
  const query = `SELECT * FROM home_jumbotron WHERE id = 1`;
  return pool.execute(query);
}

export {
  edit_home_jumbotron_model,
  get_home_jumbotron_model,
};