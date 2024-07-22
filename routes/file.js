const express = require("express");
const User = require("../models/User");
const router = express.Router();
const auth = require("../middleware/auth");

// @route   POST api/users/add-file
// @desc    Add a file to user's docs
// @access  Private
router.post("/add", auth, async (req, res) => {
  const { data, name } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newFile = {
      type: "file",
      file: {
        data,
        name,
        addedOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
      },
    };

    user.docs.push(newFile);
    await user.save();

    res.status(200).json({ msg: "File added to user docs", docs: user.docs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
