module.exports = (query) =>{
    let objectSearch = {
        keyword : "",
        // regex : ""
    }
   
    if(query.keyword){
        objectSearch.keyword = query.keyword;
        const regex = new RegExp(objectSearch.keyword , 'i'); //tim kiem k phan biet chu hoa chu thuong sd thu vien regular expression
        objectSearch.regex = regex
    }
    return objectSearch;
}