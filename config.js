module.exports.DB_CONFIG = (serverless) => ({
    stage: {
        DB_HOST: 'artong-stg.c0ttxdhzwvfd.ap-northeast-2.rds.amazonaws.com'
        ,DB_DATABASE: 'artong'
        ,DB_USER: 'postgres'
        ,DB_PASSWORD: 'wjsxu8989!'
    },
    prod: {
        DB_HOST: ''
        ,DB_DATABASE: ''
        ,DB_USER: ''
        ,DB_PASSWORD: ''
    }
});