export const getOrganisationVariable = (variable) => {
    if (!process.env.ORGANISATION_PREFIX) {
        //epsagon
        throw Error(`Unknow ORGANISATION_PREFIX env var`);
    }
    if (process.env.ORGANISATION_PREFIX + variable in process.env) {
        return process.env[process.env.ORGANISATION_PREFIX + variable];
    } else {
        //epsagon
        throw Error(`Can't find variable process.env.ORGANISATION_PREFIX + variable`);
    }
};