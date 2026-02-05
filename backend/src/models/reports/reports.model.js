const db = require("../../config/db");
const { Sales, Product, Category, Sequelize } = db;
const { fn, col, Op } = Sequelize;

const pad2 = (value) => String(value).padStart(2, "0");

const formatDate = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate(),
  )}`;

const formatMonth = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, days) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const addMonths = (date, months) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);

const startOfWeek = (date) => {
  const day = date.getDay();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - day);
};

const getBucketKey = (date, groupBy) => {
  if (groupBy === "week") {
    return formatDate(startOfWeek(date));
  }
  if (groupBy === "month") {
    return formatMonth(date);
  }
  return formatDate(date);
};

const buildBuckets = (startDate, endDate, groupBy) => {
  const buckets = [];
  let cursor =
    groupBy === "month"
      ? new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      : startOfDay(startDate);

  while (cursor <= endDate) {
    let bucketStart = cursor;
    let bucketEnd;
    let label;

    if (groupBy === "week") {
      bucketStart = startOfWeek(cursor);
      bucketEnd = addDays(bucketStart, 6);
      label = `${formatDate(bucketStart)} to ${formatDate(bucketEnd)}`;
      cursor = addDays(bucketStart, 7);
    } else if (groupBy === "month") {
      bucketEnd = new Date(bucketStart.getFullYear(), bucketStart.getMonth() + 1, 0);
      label = formatMonth(bucketStart);
      cursor = addMonths(bucketStart, 1);
    } else {
      bucketEnd = bucketStart;
      label = formatDate(bucketStart);
      cursor = addDays(bucketStart, 1);
    }

    if (bucketEnd < startDate) {
      continue;
    }
    if (bucketStart > endDate) {
      break;
    }

    buckets.push({
      key: getBucketKey(bucketStart, groupBy),
      label,
      start: bucketStart,
      end: bucketEnd,
      total: 0,
      count: 0,
      details: [],
    });
  }

  return buckets;
};

const buildReportRows = (items, options) => {
  const { startDate, endDate, groupBy, getDate, getAmount, getDetails, includeDetails } = options;
  const buckets = buildBuckets(startDate, endDate, groupBy);
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  for (const item of items) {
    const itemDate = getDate(item);
    if (!itemDate || Number.isNaN(itemDate.getTime())) {
      continue;
    }
    if (itemDate < startDate || itemDate > endDate) {
      continue;
    }

    const key = getBucketKey(itemDate, groupBy);
    const bucket = bucketMap.get(key);
    if (!bucket) {
      continue;
    }

    const amount = getAmount(item);
    bucket.total += amount;
    bucket.count += 1;
    if (includeDetails) {
      bucket.details.push(getDetails(item));
    }
  }

  return buckets.map((bucket) => ({
    period_key: bucket.key,
    label: bucket.label,
    total: Number(bucket.total) || 0,
    count: bucket.count,
    details: includeDetails ? bucket.details : undefined,
  }));
};

async function getReportSummary(entrepriseId, dateRange) {
  try {
    const salesData = await Sales.findOne({
      where: {
        entreprise_id: entrepriseId,
        createdAt: {
          [Op.between]: [dateRange.startDate, dateRange.endDate],
        },
      },
      attributes: [
        [fn("SUM", col("total_price")), "totalSales"],
        [fn("COUNT", col("id")), "salesCount"],
      ],
      raw: true,
    });

    return {
      totalSales: Number(salesData?.totalSales) || 0,
      salesCount: Number(salesData?.salesCount) || 0,
    };
  } catch (error) {
    console.error("Erreur getSummary:", error);
    throw error;
  }
}

async function getSalesByCategory(entrepriseId, dateRange) {
  try {
    const allCategories = await Category.findAll({
      where: { entreprise_id: entrepriseId },
      attributes: ["id", "name"],
      raw: true,
    });

    const salesByCategory = await Product.findAll({
      attributes: [
        [fn("MAX", col("category.id")), "categoryId"],
        [fn("MAX", col("category.name")), "categoryName"],
        [fn("SUM", col("sales.total_price")), "totalSales"],
        [fn("COUNT", col("sales.id")), "salesCount"],
      ],
      include: [
        {
          model: Category,
          as: "category",
          attributes: [],
        },
        {
          model: Sales,
          as: "sales",
          attributes: [],
          where: {
            entreprise_id: entrepriseId,
            createdAt: {
              [Op.between]: [dateRange.startDate, dateRange.endDate],
            },
          },
          required: false,
        },
      ],
      where: { entreprise_id: entrepriseId },
      group: ["Product.category_id"],
      raw: true,
      subQuery: false,
    });

    // Map avec toutes les catégories
    return allCategories.map((cat) => {
      const sales = salesByCategory.find((s) => s.categoryId === cat.id);
      return {
        id: cat.id,
        name: cat.name,
        totalSales: sales ? Number(sales.totalSales) || 0 : 0,
        salesCount: sales ? Number(sales.salesCount) || 0 : 0,
      };
    });
  } catch (error) {
    console.error("Erreur getSalesByCategory:", error);
    throw error;
  }
}

async function getExpenses(entrepriseId, dateRange) {
  try {
    const expenses = await db.Expense.findAll({
      where: {
        entreprise_id: entrepriseId,
        createdAt: {
          [Op.between]: [dateRange.startDate, dateRange.endDate],
        },
      },
      attributes: ["id", "description", "amount", "createdAt"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    return {
      total,
      expenses,
    };
  } catch (error) {
    console.error("Erreur getExpenses:", error);
    throw error;
  }
}

async function getProfits(entrepriseId, dateRange) {
  try {
    const profits = await Sales.findOne({
      where: {
        entreprise_id: entrepriseId,
        createdAt: {
          [Op.between]: [dateRange.startDate, dateRange.endDate],
        },
      },
      attributes: [
        [fn("SUM", col("total_profit")), "totalProfit"],
        [fn("AVG", col("total_profit")), "averageProfit"],
      ],
      raw: true,
    });

    const expenses = await db.Expense.findOne({
      where: {
        entreprise_id: entrepriseId,
        createdAt: {
          [Op.between]: [dateRange.startDate, dateRange.endDate],
        },
      },
      attributes: [[fn("SUM", col("amount")), "totalExpenses"]],
      raw: true,
    });

    const totalProfit = Number(profits?.totalProfit) || 0;
    console.log(totalProfit);
    const totalExpenses = Number(expenses?.totalExpenses) || 0;
    console.log(totalExpenses);

    return {
      totalProfit,
      averageProfit: Number(profits?.averageProfit) || 0,
      totalExpenses,
      netProfit: totalProfit - totalExpenses,
    };
  } catch (error) {
    console.error("Erreur getProfits:", error);
    throw error;
  }
}

async function getBestSellingProduct(entrepriseId, dateRange) {
  try {
    const product = await Product.findOne({
      attributes: [
        "id",
        [col("Product.Prod_name"), "name"],
        // Ensure correct column name is used
        [fn("SUM", col("sales.quantity_sold")), "totalQuantity"],
        [fn("SUM", col("sales.total_price")), "totalRevenue"],
      ],
      include: [
        {
          model: Sales,
          as: "sales",
          attributes: [],
          where: {
            entreprise_id: entrepriseId,
            createdAt: {
              [Op.between]: [dateRange.startDate, dateRange.endDate],
            },
          },
          required: true,
        },
      ],
      group: ["Product.id", "Product.Prod_name"],
      order: [[fn("SUM", col("sales.quantity_sold")), "DESC"]],
      limit: 1,
      raw: true,
      subQuery: false,
    });

    return (
      product || {
        id: null,
        name: "Aucun produit vendu",
        totalQuantity: 0,
        totalRevenue: 0,
      }
    );
  } catch (error) {
    console.error("Erreur getBestSellingProduct:", error);
    throw error;
  }
}

async function getDiscounts(entrepriseId, dateRange) {
  try {
    const invoices = await db.Invoice.findAll({
      where: {
        entreprise_id: entrepriseId,
        createdAt: {
          [Op.between]: [dateRange.startDate, dateRange.endDate],
        },
      },
      include: [
        {
          model: db.Client,
          as: "client",
          attributes: ["client_name"],
        },
        {
          model: db.InvoiceItem,
          as: "items",
          attributes: ["discount"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    let totalVal = 0;
    const discountList = [];

    for (const inv of invoices) {
      const invDisc = Number(inv.discount) || 0;
      const itemsDisc = inv.items
        ? inv.items.reduce((s, i) => s + (Number(i.discount) || 0), 0)
        : 0;
      const totalInvDisc = invDisc + itemsDisc;

      if (totalInvDisc > 0) {
        totalVal += totalInvDisc;
        // Construct a plain object for the list
        discountList.push({
          id: inv.id,
          // Handle client object structure (sequelize object vs raw)
          client: inv.client
            ? { name: inv.client.client_name }
            : { name: "Client Inconnu" },
          total_amount: inv.general_total || inv.total,
          discount: totalInvDisc,
          createdAt: inv.createdAt,
        });
      }
    }

    return {
      totalDiscount: totalVal,
      discounts: discountList,
    };
  } catch (error) {
    console.error("Erreur getDiscounts:", error);
    throw error;
  }
}

async function getReportTable(entrepriseId, options) {
  const { reportType, dateRange, groupBy, includeDetails } = options;

  if (reportType === "expenses") {
    const expenses = await db.Expense.findAll({
      where: {
        entreprise_id: entrepriseId,
        createdAt: {
          [Op.between]: [dateRange.startDate, dateRange.endDate],
        },
      },
      attributes: ["id", "description", "amount", "createdAt"],
      order: [["createdAt", "ASC"]],
      raw: true,
    });

    return buildReportRows(expenses, {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      groupBy,
      includeDetails,
      getDate: (row) => new Date(row.createdAt),
      getAmount: (row) => Number(row.amount) || 0,
      getDetails: (row) => ({
        id: row.id,
        amount: Number(row.amount) || 0,
        description: row.description,
        createdAt: row.createdAt,
      }),
    });
  }

  if (reportType === "sales") {
    const sales = await Sales.findAll({
      where: {
        entreprise_id: entrepriseId,
        createdAt: {
          [Op.between]: [dateRange.startDate, dateRange.endDate],
        },
      },
      attributes: ["id", "total_price", "quantity_sold", "createdAt"],
      order: [["createdAt", "ASC"]],
      raw: true,
    });

    return buildReportRows(sales, {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      groupBy,
      includeDetails,
      getDate: (row) => new Date(row.createdAt),
      getAmount: (row) => Number(row.total_price) || 0,
      getDetails: (row) => ({
        id: row.id,
        total_price: Number(row.total_price) || 0,
        quantity_sold: Number(row.quantity_sold) || 0,
        createdAt: row.createdAt,
      }),
    });
  }

  throw new Error("Type de rapport non pris en charge");
}

module.exports = {
  getReportSummary,
  getSalesByCategory,
  getExpenses,
  getProfits,
  getBestSellingProduct,
  getDiscounts,
  getReportTable,
};
