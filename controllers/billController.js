const Bill = require("../models/billModel");

exports.getAllBills = async (req, res, next) => {
  try {
    let query = Bill.find();

    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);
    query = Bill.find(queryObj);

    // Sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const bills = await query;

    res.status(200).json({
      status: "success",
      message: `${bills.length} bills found..`,
      results: bills.length,
      bills,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch bills data",
    });
  }
};

exports.getOneBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        status: "failed",
        message: "No bill found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Found the bill...",
      bill,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch bill data",
    });
  }
};

exports.createOneBill = async (req, res, next) => {
  try {
    const bill = await Bill.create(req.body);

    res.status(200).json({
      status: "success",
      message: "Bill created successfully..",
      bill,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to create bill",
    });
  }
};

exports.updateOneBill = async (req, res, next) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!bill) {
      return res.status(404).json({
        status: "failed",
        message: "No document found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Bill updated successfully..",
      bill,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to update bill",
    });
  }
};

exports.deleteOneBill = async (req, res, next) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);

    if (!bill) {
      return res.status(404).json({
        status: "failed",
        message: "No bill found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Bill deleted successfully..",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to delete bill",
    });
  }
};

exports.billNameId = async (req, res, next) => {
  try {
    const doc = await Bill.find({}, { billName: 1, _id: 1 });

    res.status(200).json({
      status: "success",
      message: `${doc.length} documents found...`,
      results: doc.length,
      doc,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Failed to fetch bill data",
    });
  }
};
