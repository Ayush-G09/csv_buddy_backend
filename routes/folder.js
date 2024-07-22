const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   POST api/folder
// @desc    Add a folder to user's docs
// @access  Private
router.post("/add", auth, async (req, res) => {
  const { name } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const newFolder = {
      type: "folder",
      folder: {
        name,
        addedOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        files: [],
      },
    };

    user.docs.push(newFolder);
    await user.save();

    res.status(201).json({ msg: "Folder added", docs: user.docs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/folder/:folderId/file
// @desc    Add a file to a folder inside user's docs
// @access  Private
router.post("/:folderId/file", auth, async (req, res) => {
  const { data, name } = req.body;
  const { folderId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const folder = user.docs.find(
      (doc) => doc.type === "folder" && doc.folder._id.toString() === folderId
    );

    if (!folder) {
      return res.status(404).json({ msg: "Folder not found" });
    }

    const newFile = {
      data,
      name,
      addedOn: new Date().toISOString(),
      updatedOn: new Date().toISOString(),
    };

    folder.folder.files.push(newFile);
    await user.save();

    res.status(201).json({ msg: "File added to folder", docs: user.docs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
