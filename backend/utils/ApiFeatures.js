class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword
        ?{
            name:{
                $regex: this.queryStr.keyword,
                $options:"i"
            },
         }
        :{};

        this.query = this.query.find({...keyword});  // find function takes object in spread (properties) format 
        return this;
    }

    filter(){
        const queryCopy = {...this.queryStr}

        const removeFields = ["keyword","page","limit"];

        removeFields.forEach((key)=> delete queryCopy[key]);

        // filter for price and rating

        //console.log(queryCopy);
        // replacing properties of json obj to mongo exp for find function
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|lt|lte|gte)\b/g, (key)=>`$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        //console.log(queryStr);
        return this;
    }

    pagination(productPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = productPerPage*(currentPage-1);

        this.query = this.query.limit(productPerPage).skip(skip);

        return this;
    }
};

module.exports = ApiFeatures;