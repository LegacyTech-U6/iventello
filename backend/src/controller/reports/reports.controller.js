const reportModel = require("../../models/reports/reports.model");

const VALID_PERIODS = new Set(["day", "week", "month", "semester", "year"]);
const VALID_REPORT_TYPES = new Set(["expenses", "sales"]);
const VALID_GROUPS = new Set(["day", "week", "month"]);

const getDateRange = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "semester":
      startDate = new Date(now.getFullYear(), now.getMonth() >= 6 ? 6 : 0, 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return { startDate, endDate: new Date() };
};

const parseDateOnly = (value) => {
  if (!value || typeof value !== "string") {
    return null;
  }
  const parts = value.split("-").map((val) => Number(val));
  if (parts.length !== 3) {
    return null;
  }
  const [year, month, day] = parts;
  if (!year || !month || !day) {
    return null;
  }
  return new Date(year, month - 1, day);
};

const buildAnchorDate = (query) => {
  const directDate = parseDateOnly(query.date);
  if (directDate && !Number.isNaN(directDate.getTime())) {
    return directDate;
  }

  const year = Number(query.year);
  if (!Number.isNaN(year) && year > 0) {
    const month = Number(query.month);
    const day = Number(query.day);
    const safeMonth = Number.isNaN(month) ? 1 : Math.min(Math.max(month, 1), 12);
    const safeDay = Number.isNaN(day) ? 1 : Math.min(Math.max(day, 1), 31);
    return new Date(year, safeMonth - 1, safeDay);
  }

  return new Date();
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const endOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

const getReportDateRange = (period, anchorDate) => {
  const safePeriod = VALID_PERIODS.has(period) ? period : "month";
  let startDate;
  let endDate;

  switch (safePeriod) {
    case "day": {
      startDate = startOfDay(anchorDate);
      endDate = endOfDay(anchorDate);
      break;
    }
    case "week": {
      const day = anchorDate.getDay();
      startDate = new Date(
        anchorDate.getFullYear(),
        anchorDate.getMonth(),
        anchorDate.getDate() - day,
      );
      endDate = endOfDay(
        new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6),
      );
      break;
    }
    case "month": {
      startDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
      endDate = endOfDay(
        new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0),
      );
      break;
    }
    case "semester": {
      const semesterStartMonth = anchorDate.getMonth() >= 6 ? 6 : 0;
      startDate = new Date(anchorDate.getFullYear(), semesterStartMonth, 1);
      endDate = endOfDay(
        new Date(anchorDate.getFullYear(), semesterStartMonth + 6, 0),
      );
      break;
    }
    case "year":
    default: {
      startDate = new Date(anchorDate.getFullYear(), 0, 1);
      endDate = endOfDay(new Date(anchorDate.getFullYear(), 11, 31));
      break;
    }
  }

  return { startDate, endDate };
};

const normalizeGroupBy = (period, groupBy) => {
  if (groupBy && VALID_GROUPS.has(groupBy)) {
    return groupBy;
  }
  if (period === "month") {
    return "day";
  }
  if (period === "semester" || period === "year") {
    return "month";
  }
  return period === "week" ? "week" : "day";
};

const parseBoolean = (value) => {
  if (value === true || value === false) {
    return value;
  }
  const normalized = String(value || "").toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
};

const getEnterpriseId = (req) => {
  // Pour les workers: utilisé l'entreprise_id du user
  if (req.user.entreprise_id) {
    return req.user.entreprise_id;
  }

  // Pour les admins: utiliser l'en-tête X-Entreprise-Id ou le paramètre query
  const headerId = req.headers["x-entreprise-id"];
  const queryId = req.query.entreprise_id;

  return headerId || queryId;
};

const getReportSummary = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const entreprise_id = getEnterpriseId(req);

    if (!entreprise_id) {
      return res.status(400).json({ error: "Entreprise ID requis" });
    }

    const dateRange = getDateRange(period);
    const summary = await reportModel.getReportSummary(
      entreprise_id,
      dateRange,
    );

    res.json({ data: summary });
  } catch (error) {
    console.error("Erreur getReportSummary:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSalesByCategory = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const entreprise_id = getEnterpriseId(req);

    if (!entreprise_id) {
      return res.status(400).json({ error: "Entreprise ID requis" });
    }

    const dateRange = getDateRange(period);
    const data = await reportModel.getSalesByCategory(entreprise_id, dateRange);

    res.json({ data });
  } catch (error) {
    console.error("Erreur getSalesByCategory:", error);
    res.status(500).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const entreprise_id = getEnterpriseId(req);

    if (!entreprise_id) {
      return res.status(400).json({ error: "Entreprise ID requis" });
    }

    const dateRange = getDateRange(period);
    const data = await reportModel.getExpenses(entreprise_id, dateRange);

    res.json({ data });
  } catch (error) {
    console.error("Erreur getExpenses:", error);
    res.status(500).json({ error: error.message });
  }
};

const getProfits = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const entreprise_id = getEnterpriseId(req);

    if (!entreprise_id) {
      return res.status(400).json({ error: "Entreprise ID requis" });
    }

    const dateRange = getDateRange(period);
    const data = await reportModel.getProfits(entreprise_id, dateRange);

    res.json({ data });
  } catch (error) {
    console.error("Erreur getProfits:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBestSellingProduct = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const entreprise_id = getEnterpriseId(req);

    if (!entreprise_id) {
      return res.status(400).json({ error: "Entreprise ID requis" });
    }

    const dateRange = getDateRange(period);
    const data = await reportModel.getBestSellingProduct(
      entreprise_id,
      dateRange,
    );

    res.json({ data });
  } catch (error) {
    console.error("Erreur getBestSellingProduct:", error);
    res.status(500).json({ error: error.message });
  }
};

const getDiscounts = async (req, res) => {
  try {
    const { period = "month" } = req.query;
    const entreprise_id = getEnterpriseId(req);

    if (!entreprise_id) {
      return res.status(400).json({ error: "Entreprise ID requis" });
    }

    const dateRange = getDateRange(period);
    const data = await reportModel.getDiscounts(entreprise_id, dateRange);

    res.json({ data });
  } catch (error) {
    console.error("Erreur getDiscounts:", error);
    res.status(500).json({ error: error.message });
  }
};

const getReportTable = async (req, res) => {
  try {
    const { period = "month", report_type, group_by, include_details } = req.query;
    const entreprise_id = getEnterpriseId(req);

    if (!entreprise_id) {
      return res.status(400).json({ error: "Entreprise ID requis" });
    }

    if (!report_type || !VALID_REPORT_TYPES.has(report_type)) {
      return res.status(400).json({
        error: "Type de rapport invalide",
        allowed: Array.from(VALID_REPORT_TYPES),
      });
    }

    const anchorDate = buildAnchorDate(req.query);
    const dateRange = getReportDateRange(period, anchorDate);
    const groupBy = normalizeGroupBy(period, group_by);
    const includeDetails = parseBoolean(include_details);

    const data = await reportModel.getReportTable(entreprise_id, {
      reportType: report_type,
      dateRange,
      groupBy,
      includeDetails,
    });

    res.json({
      meta: {
        reportType: report_type,
        period,
        groupBy,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        includeDetails,
      },
      data,
    });
  } catch (error) {
    console.error("Erreur getReportTable:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getReportSummary,
  getSalesByCategory,
  getExpenses,
  getProfits,
  getBestSellingProduct,
  getDiscounts,
  getReportTable,
};
