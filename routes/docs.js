const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();

// @route   GET api/users/docs
// @desc    Get user's docs
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ docs: user.docs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/users/docs/file/:fileId
// @desc    Update the data of a file inside user's docs or folders
// @access  Private
router.put("/file/:fileId", auth, async (req, res) => {
  const { data } = req.body;
  const { fileId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let fileFound = false;

    for (const doc of user.docs) {
      if (doc.type === "folder") {
        const file = doc.folder.files.id(fileId);
        if (file) {
          file.data = data;
          fileFound = true;
          break;
        }
      } else if (doc.type === "file" && doc.file._id.toString() === fileId) {
        doc.file.data = data;
        fileFound = true;
        break;
      }
    }

    if (!fileFound) {
      return res.status(404).json({ msg: "File not found" });
    }

    await user.save();
    res
      .status(200)
      .json({ msg: "File data updated successfully", docs: user.docs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/users/docs/file
// @desc    Delete a file inside user's docs or folders
// @access  Private
router.delete("/file/:fileId", auth, async (req, res) => {
  const { fileId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let fileFound = false;

    for (const docIndex in user.docs) {
      const doc = user.docs[docIndex];
      if (doc.type === "folder") {
        const fileIndex = doc.folder.files.findIndex(
          (file) => file._id.toString() === fileId
        );
        if (fileIndex !== -1) {
          doc.folder.files.splice(fileIndex, 1);
          fileFound = true;
          break;
        }
      } else if (doc.type === "file" && doc.file._id.toString() === fileId) {
        user.docs.splice(docIndex, 1);
        fileFound = true;
        break;
      }
    }

    if (!fileFound) {
      return res.status(404).json({ msg: "File not found" });
    }

    await user.save();
    res.status(200).json({ msg: "File deleted successfully", docs: user.docs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/users/docs/folder
// @desc    Delete a folder inside user's docs
// @access  Private
router.delete("/folder/:folderId", auth, async (req, res) => {
  const { folderId } = req.params;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let folderFound = false;

    for (const docIndex in user.docs) {
      const doc = user.docs[docIndex];
      if (doc.type === "folder" && doc.folder._id.toString() === folderId) {
        user.docs.splice(docIndex, 1);
        folderFound = true;
        break;
      }
    }

    if (!folderFound) {
      return res.status(404).json({ msg: "Folder not found" });
    }

    await user.save();
    res
      .status(200)
      .json({ msg: "Folder deleted successfully", docs: user.docs });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
