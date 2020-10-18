module.exports.DB_CONFIG = (serverless) => ({
    stage: {
        DB_HOST: 'kcmta.czl2qpvgencs.ap-northeast-2.rds.amazonaws.com'
        ,DB_DATABASE: 'test'
        ,DB_USER: 'test_user'
        ,DB_PASSWORD: 'xogh891115@'
    },
    prod: {
        DB_HOST: 'kcmta.czl2qpvgencs.ap-northeast-2.rds.amazonaws.com'
        ,DB_DATABASE: 'test'
        ,DB_USER: 'test_user'
        ,DB_PASSWORD: 'xogh891115@'
    }
});