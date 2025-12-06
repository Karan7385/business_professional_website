// models/home/carousel_home_model.js
import pool from "../../config/db.js";

function get_carousel_home_model() {
    const query = `SELECT * FROM slides_home`;
    return pool.execute(query);
}

function edit_carousel_home_model(items = []) {
    const queryWithSrc = `
        UPDATE slides_home
        SET src = ?, alt = ?, label = ?
        WHERE id = ?
    `;

    const queryWithoutSrc = `
        UPDATE slides_home
        SET alt = ?, label = ?
        WHERE id = ?
    `;

    const promises = items
        // skip items without a valid id
        .filter((item) => item && item.id != null)
        .map((item) => {
            const alt = item.alt ?? "";
            const label = item.label ?? "";

            if (item.src != null) {
                // update src + text
                return pool.execute(queryWithSrc, [item.src, alt, label, item.id]);
            }

            // only update text fields
            return pool.execute(queryWithoutSrc, [alt, label, item.id]);
        });

    return Promise.all(promises);
}

export {
    get_carousel_home_model,
    edit_carousel_home_model
}
