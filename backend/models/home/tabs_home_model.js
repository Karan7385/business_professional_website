import pool from "../../config/db.js";

function get_tabs_stats_itmes_model() {
    const query = `SELECT * FROM tabs_stat_items`;
    return pool.execute(query);
}

function get_tabs_service_itmes_model() {
    const query = `SELECT * FROM tabs_service_items`;
    return pool.execute(query);
}

function get_tabs_faq_itmes_model() {
    const query = `SELECT * FROM tabs_faq_items`;
    return pool.execute(query);
}

async function edit_tabs_stats_items_model(stats = []) {
    const query = `UPDATE tabs_stat_items SET title = ?, description = ? WHERE id = ?`;

    const promises = stats.map((item) =>
        pool.execute(query, [item.title, item.description, item.id])
    );

    await Promise.all(promises);
}

// expects: services = [{ id, title, desc/description }]
async function edit_tabs_service_items_model(services = []) {
    const query = `UPDATE tabs_service_items SET title = ?, description = ? WHERE id = ?`;

    const promises = services.map((item) =>
        pool.execute(query, [item.title, item.description, item.id])
    );

    await Promise.all(promises);
}

// expects: faqs = [{ id, question, answer }]
async function edit_tabs_faq_items_model(faqs = []) {
    const query = `UPDATE tabs_faq_items SET question = ?, answer = ? WHERE id = ?`;

    const promises = faqs.map((item) =>
        pool.execute(query, [item.question, item.answer, item.id])
    );

    await Promise.all(promises);
}

export {
    get_tabs_stats_itmes_model,
    get_tabs_service_itmes_model,
    get_tabs_faq_itmes_model,
    edit_tabs_stats_items_model,
    edit_tabs_service_items_model,
    edit_tabs_faq_items_model,
};