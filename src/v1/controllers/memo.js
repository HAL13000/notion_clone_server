const Memo = require("../modules/memo");

exports.create = async (req, res) => {
  try {
    const memoCount = await Memo.find().count();
    const memo = await Memo.create({
      user: req.user._id,
      position: memoCount > 0 ? memoCount : 0,
    });
    res.status(201).json(memo);
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.getAll = async (req, res) => {
  try {
    const memos = await Memo.find({ user: req.user._id }).sort("-position");
    res.status(200).json(memos);
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.getOne = async (req, res) => {
  const { memoId } = req.params;
  try {
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(404).json("Memo doesn't exist");
    res.status(200).json(memo);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.update = async (req, res) => {
  const { memoId } = req.params;
  const { title, description } = req.body;
  try {
    if (title === "") req.body.title = "No Title";
    if (description === "") req.body.description = "No Description";
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(404).json("Memo doesn't exist");

    const updatedMemo = await Memo.findByIdAndUpdate(memoId, {
      $set: req.body,
    });
    res.status(200).json(updatedMemo);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.delete = async (req, res) => {
  const { memoId } = req.params;
  const { title, description } = req.body;
  try {
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId });
    if (!memo) return res.status(404).json("Memo doesn't exist");

    await Memo.deleteOne({ _id: memoId });
    res.status(200).json("Successfully deleted");
  } catch (err) {
    res.status(500).json(err);
  }
};
