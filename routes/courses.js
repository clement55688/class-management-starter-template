const express = require("express");
const router = express.Router();
const slugify = require("slugify");
const db = require("../config/db");
const { v4: uuidV4 } = require("uuid");

/**
 * @route Type("post")
 * */
router.post("/create", (req, res) => {
  const { name } = req.body;

  // Simple Validation
  if (!name)
    return res.status(400).json({ msg: "Please enter a course name..." });

  //SQL for course
  let sqlCheck = `SELECT * FROM courses where slug = ?`;
  let sqlInsert = "INSERT INTO courses SET ?";
  const slug = slugify(name).toLowerCase();

  db.query(sqlCheck, slug, (err, course) => {
    if (course.length > 0) return res.status(400).json({ msg: "Course Exits" });

    const data = {
      course_name: name.toLowerCase(),
      slug: slugify(name).toLowerCase(),
      uid: uuidV4(),
    };

    db.query(sqlInsert, data, (err, result) => {
      if (err) return res.status(400).json({ msg: "Unable to insert course" });
      return res.status(200).json({ data });
    });
  });
});

/**
 * @route Type("get")
 * Get all the course
 * */
router.get("/", (req, res) => {
  let getQuery = `SELECT * FROM courses`;

  db.query(getQuery, (err, results) => {
    return res.status(200).json(results);
  });
});

/**
 * @route Type("update")
 * Update a course
 * */
router.put("/", (req, res) => {
  const { course_name, students, slug } = req.body;
  const newSlug = slugify(course_name).toLowerCase();

  // if (students.length == 0) {
  //   return res.status(400).json({ msg: "Please add students to this course" });
  // }

  let updatedata = `UPDATE courses SET course_name = ?, course_students = ?, slug = ? WHERE slug = ?`;
  db.query(
    updatedata,
    [
      course_name.toLowerCase(),
      students.toString().toLowerCase(),
      newSlug,
      slug,
    ],
    (err) => {
      if (err)
        return res.status(400).json({ msg: "Unable to update the course" });
      res.status(200).json({ msg: "Updated!" });
    }
  );
});

/**
 * @route Type("delete")
 * Delete a course
 * */
router.delete("/", (req, res) => {
  const { course_id } = req.body;
  let delQuery = `DELETE FROM courses WHERE course_id = ?`;

  db.query(delQuery, [course_id], (err, _) => {
    if (err) return res.status(400).json({ msg: "Unable to delete..." });
    res.status(200).json({ success: "true" });
  });
});

module.exports = router;
