const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUser) {
    const authUser = async (rollNo, password, done) => {
        const user = getUser(rollNo)
        if(user == null){
            return done(null, false, {message: "User not exist"})
        }
        try{
            if(await password === user.password){
                return done(null, user)
            }
            else{
                return done(null, false, {message: 'Password not match'})
            }
        }
        catch(e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'rollNo' }, authUser))
    passport.serializeUser((user, done) => done(null, user.rollNo))
    passport.deserializeUser((rollNo, done) => {
        return done(null, getUser(rollNo))
    })
}

module.exports = initialize