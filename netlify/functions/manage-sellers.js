// netlify/functions/manage-sellers.js
const GOOGLE_SCRIPT_URL = process.env.MANAGE_SELLERS_SCRIPT_URL;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    if (!GOOGLE_SCRIPT_URL) {
      throw new Error('MANAGE_SELLERS_SCRIPT_URL غير مضبوط في متغيرات البيئة');
    }

    const body = JSON.parse(event.body);
    body.apiKey = 'ealam2026secure';

    // ==== تحويل الأرقام العشرية (للتأكد من أنها أرقام) ====
    if (body.durationDays !== undefined) body.durationDays = parseFloat(body.durationDays);
    if (body.additionalDays !== undefined) body.additionalDays = parseFloat(body.additionalDays);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
