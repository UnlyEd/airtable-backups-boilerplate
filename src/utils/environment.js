export const getOrganisationVariable = (variable) => {
    if (!process.env.ORGANISATION_PREFIX) {
        //epsagon
        throw Error(`Unknow ORGANISATION_PREFIX env var`);
    }
    if (process.env[process.env.ORGANISATION_PREFIX + variable]) {
        return process.env[process.env.ORGANISATION_PREFIX + variable];

    }
    //epsagon
    throw Error(`Can't find variable ${process.env.ORGANISATION_PREFIX + variable}`);
};