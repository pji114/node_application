let queryObj = {
    "SELECT_TEMP" : (params) => {
        return `
                SELECT 
                    A.NAME AS NAME
                FROM TEMP A
                WHERE 1=1;
            `;
    },
};

module.exports = queryObj;
