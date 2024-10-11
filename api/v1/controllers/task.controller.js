const Task = require('../models/task.model');
const paginationHelper = require('../../../helpers/pagination');
const searchHelper = require('../../../helpers/search');
const { create } = require('../models/user.model');

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        $or : [
            {createBy: req.user.id},
            {listUser: req.user.id}
        ],
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;
    }

    //Search
    const objectSearch = searchHelper(req.query);

    if (req.query.keyword) {
        find.title = objectSearch.regex
    }
    //End Search

    //Pagination
    let initPagination = {
        limitItem: 2,
        currentPage: 1
    }
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(initPagination, req.query, countTasks)
    //End Pagination

    //Sort
    const sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort
    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(task);
    } catch (error) {
        res.json("error");
    }
}

//[PATCH] /api/v1/tasks/change-status
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id: id
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }

}

//[PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const {ids , key , value} = req.body;
        console.log(ids , key , value);

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids }
                }, {
                    status: value
                });
                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công"
                })
                break;
            case "delete":
                await Task.updateMany({
                    _id: { $in: ids }
                },{
                    deleted: true,
                    deletedAt: new Date()
                })
                res.json({
                    code: 200,
                    message: "Xóa thành công"
                })
                break;
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                })
                break;
        }
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }
}

//[POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
    try {
        req.body.createBy =  req.user.id;
        const product = new Task(req.body);
        const data = await product.save();
        
        res.json({
            code: 200,
            message: "Tạo thành công !!",
            data : data
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Error!!!"
        })
    }
}

//[PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        }, req.body);
        res.json({
            code: 200,
            message: "Cập nhật thành công"
        })
    }  catch {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}

//[DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Task.updateOne({
            _id: id
        }, {
            deleted: true,
            deletedAt: new Date()
        });
        res.json({
            code: 200,
            message: "Xóa thành công"
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Lỗi!"
        })
    }
}