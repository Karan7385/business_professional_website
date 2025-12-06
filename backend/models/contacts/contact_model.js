import pool from "../../config/db.js";

function submit_contact_model(items) {
    const query = `
        INSERT INTO enquiries
        (name, company, email, country_code, phone, message, categories, products)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;

    return pool.execute(query, [items.name, items.company, items.email, items.country_code, items.phone, items.message, items.categories, items.products]);
}


function get_enquiries_model() {
    const query = `SELECT * FROM enquiries`;
    return pool.execute(query);
}

function update_enquiry_model(id) {
    const query = `UPDATE enquiries SET status = ? WHERE id = ?`;
    return pool.execute(query, ["seen", id]);
}

export {
    submit_contact_model,
    get_enquiries_model,
    update_enquiry_model
}