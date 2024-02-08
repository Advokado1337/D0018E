const queryAsync = (database, sql, params) => {
    return new Promise((resolve, reject) => {
        database.query(sql, params, (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            resolve(result)
        })
    })
}

export default queryAsync
