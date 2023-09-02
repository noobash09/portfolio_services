exports.getAllUsers = (req,res)=>{
    res.status(200).json({
        status: "success",
        data : {
            message : "All Users"
        }
    });
};

exports.createUser = (req,res)=>{
    // console.log(req.body);
    res.status(201).send('Done');
};

exports.getUser = (req,res)=>{
    // console.log(req.params);
    const id = req.params.id * 1; 
    res.status(200).json({
        status: "success",
        data : {
            message : "User"
        }
    });
};

exports.updateUser = (req,res)=>{
    const id = req.params.id * 1; 
    res.status(200).json({
        status: "success",
        data : {
            message : "User Updated Successfully!"
        }
    });
};

exports.deleteUser = (req,res)=>{
    const id = req.params.id * 1; 
    res.status(204).json({
        status: "success",
        data : {
            message : "User deleted Successfully!"
        }
    });
};

