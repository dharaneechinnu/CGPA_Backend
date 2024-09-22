const usermodel = require('../Model/User');

const getStudents = async(req,res)=>{
    try {
        const {year, section} = req.body;
        if(!year || !section){
            res.json({"message": "please enter the year and section details"})
        }
        const students = await usermodel.find({year, section, role: "student"});
        res.json(students);
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {getStudents}