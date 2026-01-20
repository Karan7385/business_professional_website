import db from "../config/db.js";

export const createPreference = async (req, res) => {
  const { preferences } = req.body;

  if (!preferences || !preferences.length) {
    return res.status(400).json({
      success: false,
      message: "Preferences are required"
    });
  }

  try {
    // Remove old preferences
    await db.query("DELETE FROM preferences");

    // Insert new preferences
    const values = preferences.map(p => [
      p.product_id,
      p.priority
    ]);

    await db.query(
      "INSERT INTO preferences (product_id, priority) VALUES ?",
      [values]
    );

    res.status(201).json({
      success: true,
      message: "Preferences saved successfully"
    });

  } catch (error) {
    console.error("Create Preference Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getPreferredProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        pr.priority
      FROM products p
      JOIN preferences pr 
        ON pr.product_id = p.id
      ORDER BY pr.priority ASC;
    `);

    res.json({
      success: true,
      data: rows
    });
  } catch
   (error) {
    console.error("Get Preferred Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};