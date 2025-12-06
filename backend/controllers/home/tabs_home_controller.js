import {
  get_tabs_stats_itmes_model,
  get_tabs_service_itmes_model,
  get_tabs_faq_itmes_model,
  edit_tabs_stats_items_model,
  edit_tabs_service_items_model,
  edit_tabs_faq_items_model
} from "../../models/home/tabs_home_model.js";

import { create_logs } from "../../models/logs/logs_model.js";

async function get_tabs_controller(req, res) {
  try {
    const [stats_items] = await get_tabs_stats_itmes_model();
    const [service_items] = await get_tabs_service_itmes_model();
    const [faq_items] = await get_tabs_faq_itmes_model();

    console.log("============= TABS ===============");
    console.log({
      data: {
        stats: stats_items,
        services: service_items,
        faqs: faq_items
      }
    });
    console.log("============= TABS ===============");

    return res.status(200).json({
      data: {
        stats: stats_items,
        services: service_items,
        faqs: faq_items
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to load tabs data",
    });
  }
}

async function edit_tabs_controller(req, res) {
  try {
    console.log(req.body);
    const { stats = [], services = [], faqs = [] } = req.body;

    // run updates in parallel
    await Promise.all([
      edit_tabs_stats_items_model(stats),
      edit_tabs_service_items_model(services),
      edit_tabs_faq_items_model(faqs),
    ]);

    create_logs(
      "Edit Tabs",
      "Fields have been changed"
    )

    return res.status(200).json({
      message: "Tabs updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to update tabs data",
    });
  }
}

export {
  get_tabs_controller,
  edit_tabs_controller
}