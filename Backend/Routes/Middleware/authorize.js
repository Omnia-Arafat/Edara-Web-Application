// ====================== Initialization ======================
const conn = require('../../DB/Connection')
const util = require("util");
const jwt = require('jsonwebtoken');

// router.use(cookieParser());


exports.adminAuthorize = async (req, res, next) => {
    const query = util.promisify(conn.query).bind(conn);
    const Token = req.cookies.Token;
    const networksec = jwt.verify(Token, 'secretKey', (err, decoded) => {
        if (err) {
            // Handle invalid token
            console.log(err);
        } else {
            return decoded;
        }
    });
    const user = await query("select * from user where Token = '" + networksec.token + "'");
    if (user[0] && user[0].Type === "Admin") {
        next();
    }
    else {
        res.status(401).json("Unauthorized");
    }
}

exports.supervisorAuthorize = async (req, res, next) => {
    const query = util.promisify(conn.query).bind(conn);
    const Token = req.cookies.Token;
    req.user = jwt.verify(Token, 'secretKey', (err, decoded) => {
        if (err) {
            // Handle invalid token
            console.log(err);
        } else {
            return decoded;
        }
    });
    const user = await query("select * from user where Token = '" + req.user.token + "'");
    if (user[0] && user[0].Type === "Supervisor") {
        next();
    }
    else {
        res.status(401).json("Unauthorized");
    }
}