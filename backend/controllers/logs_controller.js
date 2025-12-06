import { get_logs } from '../models/logs/logs_model.js';

async function get_logs_controller(req, res) {
    const resp = await get_logs();

    return res.status(200).json({success: true, data: resp[0]})
}

export {
    get_logs_controller
}