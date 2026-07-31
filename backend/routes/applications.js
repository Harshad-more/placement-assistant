const express = require("express");
const db = require("../db");

const router = express.Router();

// ================= GET ALL APPLICATIONS =================

router.get("/applications/:userId", (req, res) => {
    const { userId } = req.params;

    db.query(
        "SELECT * FROM applications WHERE user_id=? ORDER BY id DESC",
        [userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(result);

        }
    );
});

// ================= ADD APPLICATION =================

router.post("/applications", (req, res) => {

    const {
        company_name,
        role,
        status,
        applied_date,
        deadline_date,
        notes,
        user_id
    } = req.body;

    db.query(
        `INSERT INTO applications
        (company_name,role,status,applied_date,deadline_date,notes,user_id)
        VALUES (?,?,?,?,?,?,?)`,
        [
            company_name,
            role,
            status,
            applied_date,
            deadline_date,
            notes,
            user_id
        ],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success:false,
                    message:err.message
                });
            }

            res.json({
                success:true,
                message:"Application Added Successfully"
            });

        }
    );

});

// ================= UPDATE =================

router.put("/applications/:id",(req,res)=>{

    const {id}=req.params;

    const{
        company_name,
        role,
        status,
        applied_date,
        deadline_date,
        notes
    }=req.body;

    db.query(
        `UPDATE applications
        SET company_name=?,role=?,status=?,applied_date=?,deadline_date=?,notes=?
        WHERE id=?`,
        [
            company_name,
            role,
            status,
            applied_date,
            deadline_date,
            notes,
            id
        ],
        (err)=>{

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({
                success:true,
                message:"Application Updated Successfully"
            });

        }
    );

});

// ================= DELETE =================

router.delete("/applications/:id",(req,res)=>{

    const{id}=req.params;

    db.query(
        "DELETE FROM applications WHERE id=?",
        [id],
        (err)=>{

            if(err){

                return res.status(500).json({
                    success:false,
                    message:err.message
                });

            }

            res.json({
                success:true,
                message:"Application Deleted Successfully"
            });

        }
    );

});

module.exports=router;