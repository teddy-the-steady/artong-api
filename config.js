module.exports.DB_CONFIG = (serverless) => ({
    stage: {
        DB_HOST: 'artong-staging.cbicx7dyouhk.ap-northeast-2.rds.amazonaws.com'
        ,DB_DATABASE: 'artong'
        ,DB_USER: 'artong'
        ,DB_PASSWORD: 'wjsxu8989!'
    },
    prod: {
        DB_HOST: ''
        ,DB_DATABASE: ''
        ,DB_USER: ''
        ,DB_PASSWORD: ''
    }
});