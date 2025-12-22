const authorizationRole= (...alowRoles)=>{
    return (req,res,next)=>{
        if (!alowRoles.includes(req.user.roles)) {
            return res.status(403).json({'Acces denied'})

            
        }
    }
}
module.exports = authorizationRole