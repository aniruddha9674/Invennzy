const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/AccountCreation/emailsender'); // ✅ add this import

class Lab {
  static async findByAdminId(adminId) {
    const [rows] = await db.query(`
      SELECT 
        l.*, 
        e.monitors, e.projectors, e.switch_boards, e.fans, e.wifi, e.others,
        s.incharge_name, s.incharge_email, s.incharge_phone,
        s.assistant_name, s.assistant_email, s.assistant_phone
      FROM labs l
      LEFT JOIN equipment e ON l.id = e.lab_id
      LEFT JOIN staff s ON l.id = s.lab_id
      WHERE l.admin_id = ?
      ORDER BY l.lab_no
    `, [adminId]);
    return rows;
  }

  static async findAll() {
    const [rows] = await db.query(`
      SELECT 
        l.*, 
        e.monitors, e.projectors, e.switch_boards, e.fans, e.wifi, e.others,
        s.incharge_name, s.incharge_email, s.incharge_phone,
        s.assistant_name, s.assistant_email, s.assistant_phone
      FROM labs l
      LEFT JOIN equipment e ON l.id = e.lab_id
      LEFT JOIN staff s ON l.id = s.lab_id
      ORDER BY l.lab_no
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT 
        l.*, 
        e.monitors, e.projectors, e.switch_boards, e.fans, e.wifi, e.others,
        s.incharge_name, s.incharge_email, s.incharge_phone,
        s.assistant_name, s.assistant_email, s.assistant_phone
      FROM labs l
      LEFT JOIN equipment e ON l.id = e.lab_id
      LEFT JOIN staff s ON l.id = s.lab_id
      WHERE l.id = ?
    `, [id]);
    return rows[0];
  }

  // ✅ UPDATED create() with account creation + email sending
  static async create(labData) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // ✅ Insert into labs
      const [labResult] = await conn.query(`
        INSERT INTO labs (lab_no, lab_name, building, floor, capacity, status, admin_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        labData.labNo,
        labData.labName,
        labData.building,
        labData.floor,
        labData.capacity,
        labData.status,
        labData.adminId
      ]);

      const labId = labResult.insertId;

      // ✅ Insert into equipment
      await conn.query(`
        INSERT INTO equipment (lab_id, monitors, projectors, switch_boards, fans, wifi, others)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        labId,
        labData.monitors,
        labData.projectors,
        labData.switchBoards,
        labData.fans,
        labData.wifi,
        labData.others
      ]);

      // ✅ Insert into staff
      const [staffResult] = await conn.query(`
        INSERT INTO staff (lab_id, incharge_name, incharge_email, incharge_phone, 
                          assistant_name, assistant_email, assistant_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        labId,
        labData.inchargeName,
        labData.inchargeEmail,
        labData.inchargePhone,
        labData.assistantName,
        labData.assistantEmail,
        labData.assistantPhone
      ]);

      const staffId = staffResult.insertId;

      // ✅ Generate random passwords instead of default
      const inchargePlainPassword = crypto.randomBytes(4).toString('hex');
      const assistantPlainPassword = crypto.randomBytes(4).toString('hex');

      // ✅ Hash passwords
      const inchargeHashed = await bcrypt.hash(inchargePlainPassword, 10);
      const assistantHashed = await bcrypt.hash(assistantPlainPassword, 10);

      // ✅ Insert into labincharge
      await conn.query(`
        INSERT INTO labincharge (staff_id, name, email, password, google_id, profile_picture, role, notify_email, notify_push, notify_sms, created_at, updated_at)
        VALUES (?, ?, ?, ?, NULL, NULL, ?, 1, 1, 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE name = VALUES(name), password = VALUES(password)
      `, [
        staffId,
        labData.inchargeName,
        labData.inchargeEmail,
        inchargeHashed,
        'lab_incharge'
      ]);

      // ✅ Check if assistant email exists
      const [[existingAssistant]] = await conn.query(
        `SELECT id, staff_id FROM labassistant WHERE email = ?`,
        [labData.assistantEmail]
      );

      let sendAssistantEmail = false;

      if (existingAssistant) {
        // Email exists - append staff_id
        const existingStaffIds = existingAssistant.staff_id ? existingAssistant.staff_id.toString() : '';
        const updatedStaffIds = existingStaffIds ? `${existingStaffIds},${staffId}` : staffId.toString();
        
        await conn.query(
          `UPDATE labassistant SET staff_id = ? WHERE id = ?`,
          [updatedStaffIds, existingAssistant.id]
        );
      } else {
        // Email doesn't exist - create new account
        await conn.query(`
          INSERT INTO labassistant (staff_id, name, email, password, google_id, profile_picture, role, notify_email, notify_push, notify_sms, created_at, updated_at)
          VALUES (?, ?, ?, ?, NULL, NULL, ?, 1, 1, 1, NOW(), NOW())
        `, [
          staffId,
          labData.assistantName,
          labData.assistantEmail,
          assistantHashed,
          'lab_assistant'
        ]);
        sendAssistantEmail = true;
      }

      await conn.commit();

      // ✅ Send emails (after transaction is committed)
      try {
        if (labData.inchargeEmail) {
          await sendEmail({
            to: labData.inchargeEmail,
            name: labData.inchargeName,
            plainPassword: inchargePlainPassword,
            subject: `Your Invennzy Account (Lab Incharge - ${labData.labName})`
          });
        }
        if (sendAssistantEmail && labData.assistantEmail) {
          await sendEmail({
            to: labData.assistantEmail,
            name: labData.assistantName,
            plainPassword: assistantPlainPassword,
            subject: `Your Invennzy Account (Lab Assistant - ${labData.labName})`
          });
        }
        console.log("✅ Account creation emails sent successfully!");
      } catch (emailErr) {
        console.error("⚠️ Email sending failed:", emailErr.response?.data || emailErr.message);
      }

      // ✅ Return full lab with joins
      const fullLab = await Lab.findById(labId);
      return fullLab;

    } catch (err) {
      await conn.rollback();
      console.error("❌ Transaction failed:", err.message);
      throw err;
    } finally {
      conn.release();
    }
  }

static async update(id, labData) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // --------------------------------------
    // 1️⃣ Fetch Old Staff Data for Fallbacks
    // --------------------------------------
    const [[oldStaff]] = await conn.query(
      `SELECT * FROM staff WHERE lab_id = ?`,
      [id]
    );

    if (!oldStaff) throw new Error("Staff record not found for this lab.");

    // Fallback values — do NOT allow blanks/undefined
    const safe = (value, fallback) =>
      value && value.trim() !== "" ? value : fallback;

    const newIncharge = {
      name: safe(labData.inchargeName, oldStaff.incharge_name),
      email: safe(labData.inchargeEmail, oldStaff.incharge_email),
      phone: safe(labData.inchargePhone, oldStaff.incharge_phone),
    };

    const newAssistant = {
      name: safe(labData.assistantName, oldStaff.assistant_name),
      email: safe(labData.assistantEmail, oldStaff.assistant_email),
      phone: safe(labData.assistantPhone, oldStaff.assistant_phone),
    };

    // -------------------------------
    // 2️⃣ Update labs (unchanged)
    // -------------------------------
    await conn.query(
      `
      UPDATE labs 
      SET lab_no = ?, lab_name = ?, building = ?, floor = ?, 
          capacity = ?, status = ?, last_updated = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        labData.labNo,
        labData.labName,
        labData.building,
        labData.floor,
        labData.capacity,
        labData.status,
        id,
      ]
    );

    // -------------------------------
    // 3️⃣ Update equipment (unchanged)
    // -------------------------------
    await conn.query(
      `
      UPDATE equipment 
      SET monitors = ?, projectors = ?, switch_boards = ?, fans = ?, wifi = ?, others = ?
      WHERE lab_id = ?
    `,
      [
        labData.monitors,
        labData.projectors,
        labData.switchBoards,
        labData.fans,
        labData.wifi,
        labData.others,
        id,
      ]
    );

    // -------------------------------
    // 4️⃣ Update staff table
    // -------------------------------
    await conn.query(
      `
      UPDATE staff 
      SET incharge_name = ?, incharge_email = ?, incharge_phone = ?,
          assistant_name = ?, assistant_email = ?, assistant_phone = ?
      WHERE lab_id = ?
    `,
      [
        newIncharge.name,
        newIncharge.email,
        newIncharge.phone,
        newAssistant.name,
        newAssistant.email,
        newAssistant.phone,
        id,
      ]
    );

    // -------------------------------
    // 5️⃣ Get staff_id (foreign key)
    // -------------------------------
    const staffId = oldStaff.id;

    // -------------------------------------------
    // 6️⃣ Helper: Process Incharge/Assistant roles
    // -------------------------------------------
    const processAccountUpdate = async ({
      table,
      oldEmailQuery,
      newData,
      roleName,
    }) => {
      const [[oldAcc]] = await conn.query(oldEmailQuery, [staffId]);
      const emailChanged = oldAcc && oldAcc.email !== newData.email;

      let hashedPassword = null;
      let plainPassword = null;

      if (emailChanged) {
        plainPassword = crypto.randomBytes(4).toString("hex");
        hashedPassword = await bcrypt.hash(plainPassword, 10);
      }

      // 🔥 Build dynamic SQL for google_id & password
      const updateQuery = `
        UPDATE ${table}
        SET name = ?, email = ?, phone = ?,
            password = ${emailChanged ? "?" : "password"},
            google_id = ${emailChanged ? "NULL" : "google_id"}
        WHERE staff_id = ?
      `;

      const queryParams = emailChanged
        ? [newData.name, newData.email, newData.phone, hashedPassword, staffId]
        : [newData.name, newData.email, newData.phone, staffId];

      await conn.query(updateQuery, queryParams);

      return {
        emailChanged,
        plainPassword,
        name: newData.name,
        email: newData.email,
        roleName,
      };
    };

    // Process Incharge Update
    const inchargeResult = await processAccountUpdate({
      table: "labincharge",
      oldEmailQuery: "SELECT email FROM labincharge WHERE staff_id = ?",
      newData: newIncharge,
      roleName: "Lab Incharge",
    });

    // Process Assistant Update
    const assistantResult = await processAccountUpdate({
      table: "labassistant",
      oldEmailQuery: "SELECT email FROM labassistant WHERE staff_id = ?",
      newData: newAssistant,
      roleName: "Lab Assistant",
    });

    // -------------------------------
    // 7️⃣ Commit DB transaction
    // -------------------------------
    await conn.commit();

    // -------------------------------
    // 8️⃣ Send Emails (AFTER COMMIT)
    // -------------------------------
    const sendEmailIfChanged = async (result) => {
      if (result.emailChanged) {
        await sendEmail({
          to: result.email,
          name: result.name,
          plainPassword: result.plainPassword,
          subject: `Your Updated Invennzy Account (${result.roleName} - ${labData.labName})`,
        });
      }
    };

    try {
      await sendEmailIfChanged(inchargeResult);
      await sendEmailIfChanged(assistantResult);
    } catch (err) {
      console.error("⚠ Email sending failed:", err.message);
    }

    return true;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}




  static async delete(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query('DELETE FROM staff WHERE lab_id = ?', [id]);
      await conn.query('DELETE FROM equipment WHERE lab_id = ?', [id]);
      await conn.query('DELETE FROM labs WHERE id = ?', [id]);

      await conn.commit();
      return true;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
}

module.exports = Lab;
